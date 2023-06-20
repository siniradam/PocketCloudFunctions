import os from "os";
import cluster from "cluster";

export function setupCluster(__dirname, file, config, state) {
  // # Setup
  cluster.setupPrimary({
    exec: __dirname + file,
  });

  const cpuCount = os.cpus().length;
  const maxInstances = Math.max(1, cpuCount - config.freeCpuSlots);

  // # Spawn
  for (let i = 0; i < maxInstances; i++) {
    cluster.fork();
    state.instances++;
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} has been killed`);

    // Update running instance count
    state.instances--;

    if (state.restarts < config.maxRestarts) {
      console.log("Starting worker.");

      // Update running instance count
      state.instances++;

      // Update restart count
      state.restarts++;

      cluster.fork();
    } else {
      console.log("Maximum number of restarts reached.");
    }
  });

  info(process, cpuCount, maxInstances);
}

function info(process, cpuCount, maxInstances) {
  console.log(`Primary pid=${process.pid}`);

  console.log(
    `The total number of CPUs is ${cpuCount}, launching ${maxInstances} instances.`
  );
}
