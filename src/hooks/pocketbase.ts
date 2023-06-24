import PocketBase from "pocketbase";

import express from "express";
import { pbMethods, pbUser } from "./types.js";

const pb = new PocketBase("http://127.0.0.1:8090");

export function pbHook(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Authentication
  const { baseUrl, lang, admins, collections, files, settings } = pb;

  const pbMethods: pbMethods = {
    baseUrl,
    lang,
    admins,
    collections,
    files,
    settings,
  };

  if (req.headers.authorization) {
    // Set token
    pb.authStore.save(req.headers.authorization, null);

    const user: pbUser = pb.authStore.model;
    // Append User to pbMethods
    Object.assign(req, { user });
  }

  Object.assign(req, {
    pb: pbMethods,
  });

  return next();
}

/**
 * Defines user creation trigger endpoints
 */

const router = express.Router();
router.use((req, res, next) => {
  // console.log("Time: ", Date.now());
  next();
});

router.post("/userRegistration", (req, res) => {
  req.app.emit("userRegistration", req.body);
  res.sendStatus(200);
});

router.post("/userDeletion", (req, res) => {
  req.app.emit("userDeletion", req.body);
  res.sendStatus(200);
});

router.get("/events", (req, res) => {
  res.json(req.app.eventNames().filter((e) => e != "mount"));
});

// req.app.use("/pbTriggers", router);

export const pbTriggers = router;
export default pb;
