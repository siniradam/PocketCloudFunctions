// # Node Utils

// # Config
import { config, __dirname } from "./config.js";
import { setupCluster } from "./src/cluster.js";

const state = {
  restarts: 0,
  instances: 0,
};

setupCluster(__dirname, "/index.js", config, state);
