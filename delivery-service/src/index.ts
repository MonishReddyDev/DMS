import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import express, { Response, Request } from "express";
import deliveryRoutes from "./routes/delivery.routes";
import { errorHandler } from "./utils/errorHandler";
import { initSocketServer } from "./socket/index";
import http from "http";

const app = express();

const PORT = process.env.PORT || 4002;
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
initSocketServer(server);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/deliveries", deliveryRoutes);

// Optional ping route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Delivery Service with Socket.IO running");
});

// Error handling
app.use(errorHandler); // ⬅️ attach WebSocket

server.listen(PORT, () => {
  console.log(`🚚 Delivery Service running on port ${PORT}`);
});
