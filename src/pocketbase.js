import PocketBase from "pocketbase";
import express from "express";

const pb = new PocketBase("http://127.0.0.1:8090");

// pb.collection('users').authWithOAuth2Code

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function pbHook(req, res, next) {
  const { baseUrl, lang, admins, collections, files, settings } = pb;

  const pbMethods = {
    baseUrl,
    lang,
    admins,
    collections,
    files,
    settings,
  };

  if (req.headers.authorization) {
    pb.authStore.save(req.headers.authorization);
    pbMethods.user = { ...pb.authStore.model };
  }

  Object.assign(req, {
    pb: pbMethods,
  });

  next();
}
