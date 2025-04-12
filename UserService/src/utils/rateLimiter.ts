import redisClient from "../config/redisClient";
import { RateLimiterRedis } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100, // Number of requests allowed
  duration: 30, // Duration in seconds (1 minute)
  blockDuration: 60 * 15, // Block for 15 minutes if rate limit exceeded
  keyPrefix: "rate-limit-User-service",
});

export default rateLimiter;
