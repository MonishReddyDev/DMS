import io from "socket.io-client";

const socket = io("http://localhost:3002", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI3ODY0YjFlLWE5NzItNGEwZC05M2U3LTFhOWMwY2Q2OTYyZiIsImVtYWlsIjoiUmF2aUBnbWFpbGMuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NDQ0ODM3OTcsImV4cCI6MTc0NDQ4NzM5N30.oQrjPXyuSML4LkhLfc_QWCncb5HsJbP5obPmzzTtPCk",
  },
});

socket.on("connect", () => {
  console.log("👤 User connected");

  const deliveryId = "6b5f886d-8c41-44ba-a848-42c8354472ef"; // Replace with real deliveryId

  socket.emit("delivery:subscribe", { deliveryId });

  socket.on(
    "location:update",
    (data: { latitude: number; longitude: number; timestamp: string }) => {
      console.log("📍 Received location update:", data);
    }
  );
});

socket.on("disconnect", () => {
  console.log("User disconnected");
});
