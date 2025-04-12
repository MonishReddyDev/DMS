import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { Role } from "../types/roles";
import { TrackingRepository } from "../Repository/TrackingRepository";
import { Socket } from "socket.io-client";
import prisma from "../config/prismaClient";

// Declare variable to hold the io instance
let io: Server;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const trackingRepo = new TrackingRepository();

  //Socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token missing"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.user = decoded; // Save decoded user
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`Socket connected → ${user.id} (${user.role})`);

    // Driver sends location updates
    socket.on(
      "location:update",
      async ({ deliveryId, latitude, longitude }) => {
        try {
          if (user.role !== Role.DRIVER) return;

          // 🔍 Step 1: Check delivery status
          const delivery = await prisma.delivery.findUnique({
            where: { id: deliveryId },
          });

          if (!delivery) {
            console.warn("🚫 Invalid deliveryId");
            return;
          }
          if (delivery.status === "DELIVERED") {
            socket.emit("delivery:blocked", {
              message: "Delivery is completed. Stop location updates.",
            });
            console.warn(
              `⛔ Cannot update location. Delivery ${deliveryId} is already DELIVERED`
            );
            return;
          }

          console.log("✅ EMIT ALLOWED");
          // ✅ Step 2: Save and emit location
          await trackingRepo.saveLocation({ deliveryId, latitude, longitude });

          // Broadcast to subscribed users
          io.to(`delivery:${deliveryId}`).emit("location:update", {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          });

          console.log(`📍 Updated location for delivery ${deliveryId}`);
        } catch (error) {
          console.error("Error handling location update:", error);
        }
      }
    );

    // User subscribes to delivery
    socket.on("delivery:subscribe", ({ deliveryId }) => {
      socket.join(`delivery:${deliveryId}`);
      console.log(`👤 User joined room delivery:${deliveryId}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket server not initialized");
  return io;
};
