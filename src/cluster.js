import os from "os";
import cluster from "cluster";
import { stat, watchFile } from "node:fs";
import chalk from "chalk";

export function setupCluster(__dirname, file, config, state) {
  let workers = new Map();

  // # Setup
  cluster.setupPrimary({
    exec: __dirname + file,
  });

  const cpuCount = os.cpus().length;
  const maxInstances = Math.max(1, cpuCount - config.freeCpuSlots);

  // # Spawn
  for (let i = 0; i < maxInstances; i++) {
    // Spawn process
    let clstr = cluster.fork();

    // Add to workers map.
    workers.set(clstr.process.pid, clstr);

    // Update running instance count
    state.instances++;
  }

  cluster.on("exit", (worker, code, signal) => {
    // Info
    console.log(chalk.redBright(`worker ${worker.process.pid} has been killed`));

    // Delete from workers map.
    workers.delete(worker.process.pid);

    // Update running instance count.
    state.instances--;

    if (state.restarts < config.maxRestarts) {
      console.log(chalk.blue("Starting worker."));

      // Update running instance count
      state.instances++;

      if (signal !== "SIGTERM") {
        // Update restart count
        state.restarts++;
      }

      // Launch new worker
      let clstr = cluster.fork();
      workers.set(clstr.process.pid, clstr);
    } else {
      console.log(chalk.red("Maximum number of restarts reached."));
    }
  });

  watchFile(
    __dirname + file,
    { encoding: "buffer" },
    ({ mtime: preMtime }, { mtime: curMtime }) => {
      // console.log({ preMtime, curMtime });
      console.log(chalk.yellow(`File changed. Restarting workers.`));
      workers.forEach((worker) => worker.kill());
    }
  );

  info(process, cpuCount, maxInstances);

  return {
    cluster,
    workers,
  };
}

function info(process, cpuCount, maxInstances) {
  console.log(chalk.green(`Cluster started pid=${process.pid}`));

  console.log(
    chalk.yellowBright(
      `The total number of CPUs is ${cpuCount}, launching ${maxInstances} instances.`
    )
  );
}
