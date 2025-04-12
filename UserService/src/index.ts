import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import express from "express";
import authRoutes from "./routes/userRoutes";
import helmet from "helmet";
import cors from "cors";
import rateLimiterMiddleware from "./middlewares/rateLimitMiddleware";
import logger from "./utils/logger";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import prisma from "./config/prismaClient";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 4000;

// Example route
app.get("/", (req, res) => {
  res.send("Hello, this is your MovieService response!");
});

//DDos protection and rate limiting
app.use(rateLimiterMiddleware);

app.use("/api/auth", authRoutes);

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

app.use(globalErrorHandler);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
