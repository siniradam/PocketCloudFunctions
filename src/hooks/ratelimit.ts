import { RateLimiterCluster } from "rate-limiter-flexible";
import { config } from "../serverconfig.js";

// Types
import { NextFunction, Request, Response } from "express";

const rateLimiter = new RateLimiterCluster({
  keyPrefix: config?.ratelimit?.keyPrefix || "express",
  points: config?.ratelimit?.points || 5, // Number of points
  duration: config?.ratelimit?.duration || 1,
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};
