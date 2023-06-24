//Server
import Express from "express";
import Cors from "cors";
import Helmet from "helmet";

// Rate Limit
import { rateLimiterMiddleware } from "./hooks/ratelimit.js";

//Pocketbase
import { pbHook, pbTriggers } from "./hooks/pocketbase.js";

// Node Utils
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url.split("server.js")[0]);
// const { version: serverVersion } = require("../package.json");

// import {version} from "../package.json";

process.env.npm_package_version;
const version = process.env.npm_package_version || 0;

const express = () => {
  const app = Express();
  const cors = Cors({ origin: true });

  //const morgan = require("morgan");

  app.use(Helmet());
  app.use(function (req, res, next) {
    res.setHeader("X-Powered-By", "PocketCloud");
    res.setHeader("X-Server-Version", version);
    next();
  });
  app.use(cors);
  app.use(Express.json());
  app.use(rateLimiterMiddleware);

  // app.use(pbTriggers);
  app.use("/pbTriggers", pbTriggers);
  app.use(pbHook);

  // app.emit('testEvent');

  //app.use(morgan("combined"));

  console.log(`Express ${process.pid} loaded.`);

  return app;
};

let app = express();
app.listen(process.env.PORT || 3000);

const httpMethods = {
  all: app.all.bind(app),
  get: app.get.bind(app),
  post: app.post.bind(app),
  delete: app.delete.bind(app),
  put: app.put.bind(app),
  use: app.use.bind(app),
};

const user = {
  onCreate: (fn: (userRecord) => {}) => app.on("userRegistration", fn),
  onDelete: (fn: (userRecord) => {}) => app.on("userDeletion", fn),
};

export default { http: httpMethods, user };
