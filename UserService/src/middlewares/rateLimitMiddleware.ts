import { NextFunction, Response, Request } from "express";
import rateLimiter from "../utils/rateLimiter";

const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip as string;

  rateLimiter
    .consume(ip)
    .then(() => next())
    .catch((rej) => {
      res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    });
};

export default rateLimiterMiddleware;
