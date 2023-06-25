// # Node Utils

// # Config
import { config } from "./serverconfig.js";
import { setupCluster } from "./server/cluster.js";
// import { __dirname } from "./utils.js";

const state = {
  restarts: 0,
  instances: 0,
};

setupCluster(config, state);

// const cluster =
// const processOne = cluster.workers.entries().next().value[1];
// console.log(processOne._events);
// console.log(processOne.process._events);
// setInterval(() => {
//   console.log({
//     pCount: processOne._eventsCount,
//     ppCount: processOne.process._eventsCount,
//   });
// }, 1500);
