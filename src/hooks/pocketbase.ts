import PocketBase from "pocketbase";

import express from "express";
import { pbMethods, pbUser } from "./types.js";

const pb = new PocketBase("http://127.0.0.1:8090");

export function pbHook(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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

  next();
}
export default pb;
