import { NextFunction, Request, Response } from "express";

export function webhooks(req: Request, res: Response, next: NextFunction) {
  next();
}
