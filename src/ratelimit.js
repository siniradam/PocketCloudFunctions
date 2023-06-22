import { RateLimiterCluster } from "rate-limiter-flexible";
import { config } from "../config";

const rateLimiter = new RateLimiterCluster({
  keyPrefix: config?.ratelimit?.keyPrefix || "express",
  points: config?.ratelimit?.points || 5, // Number of points
  duration: config?.ratelimit?.duration || 1,
});

export const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};
