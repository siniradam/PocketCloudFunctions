import os from "os";
import cluster from "cluster";
import chalk from "chalk";

import { watchFile } from "node:fs";
import { RateLimiterClusterMaster } from "rate-limiter-flexible";

import { __dirname } from "../utils.js";

export function setupCluster(config, state) {
  // # References (list) of cluster processes.
  const workers = new Map();

  // # Main function process.
  const file = "index.js";

  // # Pathopf the proccess
  const path = `${__dirname}${config.functionsPath}/${file}`;

  // # Main Process Rate Limiter
  new RateLimiterClusterMaster();

  // # Setup
  cluster.setupPrimary({
    exec: path,
  });

  const cpuCount = os.cpus().length;

  // # Number of maximum workers.
  const maxInstances = Math.max(1, cpuCount - config.freeCpuSlots);

  // # Initial run
  for (let i = 0; i < maxInstances; i++) {
    // Spawn process
    let clstr = cluster.fork();

    // Add to workers map.
    workers.set(clstr.process.pid, clstr);

    // Update running instance count
    state.instances++;
  }

  // # Cluster process close event;
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

  // # Watch functions root file for changes.
  watchFile(path, () => {
    console.log(chalk.yellow(`File changed. Restarting workers.`));
    workers.forEach((worker) => worker.kill());
  });

  info(process, cpuCount, maxInstances);

  return {
    cluster,
    workers,
  };
}

function info(process: any, cpuCount: Number, maxInstances: Number) {
  console.log(chalk.green(`Cluster started pid=${process.pid}`));

  console.log(
    chalk.yellowBright(
      `The total number of CPUs is ${cpuCount}, launching ${maxInstances} instances.`
    )
  );
}
