import io from "socket.io-client";

const socket = io("http://localhost:3002", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZmZmRhODRjLTUyNTAtNDFhYy1hY2RhLTc1NTIyOGFlMzEwZiIsImVtYWlsIjoiS2lyYW5AZ21haWxjLmNvbSIsInJvbGUiOiJEUklWRVIiLCJpYXQiOjE3NDQ0ODM3NzEsImV4cCI6MTc0NDQ4NzM3MX0.LmJfoliYJI4r4JsemP8X_1-cg6YHG8bdfPJUGJqBtUc",
  },
});

const deliveryId = "ab4168d2-ae81-4727-9a4e-04b0c7a2698d";

socket.on("connect", () => {
  console.log("🚚 Driver connected");

  setInterval(() => {
    const latitude = 17.385 + Math.random() * 0.01;
    const longitude = 78.4867 + Math.random() * 0.01;

    socket.emit("location:update", {
      deliveryId: deliveryId, // Replace with real deliveryId
      latitude,
      longitude,
    });

    console.log("📍 Sent location:", latitude, longitude);
  }, 5000);
});

socket.on("delivery:blocked", (data: any) => {
  console.log("⛔ BLOCKED BY SERVER:", data.message);
  process.exit(); // stop the script
});

socket.on("disconnect", () => {
  console.log("Driver disconnected");
});
