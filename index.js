// # Node Utils

// # Config
import { config, __dirname } from "./config.js";
import { setupCluster } from "./src/cluster.js";

const state = {
  restarts: 0,
  instances: 0,
};

const cluster = setupCluster(__dirname, "/index.js", config, state);
const processOne = cluster.workers.entries().next().value[1];
// console.log(processOne._events);
// console.log(processOne.process._events);
// setInterval(() => {
//   console.log({
//     pCount: processOne._eventsCount,
//     ppCount: processOne.process._eventsCount,
//   });
// }, 1500);
