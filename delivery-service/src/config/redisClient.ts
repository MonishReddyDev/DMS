import Redis from "ioredis";
import logger from "../utils/logger";

// Create Redis client using ioredis
const redisClient = new Redis({
  host: "localhost", // Redis server host
  port: 6379, // Redis server port
  // Optional: Additional Redis configuration options
  enableOfflineQueue: false,
});

redisClient.on("connect", () => logger.info("Redis Database is connected"));

redisClient.on("error", () =>
  logger.info("Error while connecting to Redis Database!")
);

export default redisClient;
