import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import MapView from "../components/MapView"; // ✅ Ensure correct import

type LatLng = {
  lat: number;
  lng: number;
};

export default function Track() {
  const { deliveryId } = useParams();

  const [driverLocation, setDriverLocation] = useState<LatLng>({
    lat: 17.385,
    lng: 78.4867,
  });

  // Dummy pickup & drop (replace with real API later)
  const pickup: LatLng = { lat: 17.385, lng: 78.4867 };
  const drop: LatLng = { lat: 17.437, lng: 78.502 };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !deliveryId) return;

    const socket: Socket = io("http://localhost:3002", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      socket.emit("delivery:subscribe", { deliveryId });
    });

    socket.on("location:update", (data: any) => {
      console.log("📡 Received location update:", data);
      setDriverLocation({
        lat: data.latitude,
        lng: data.longitude,
      });
    });

    return () => {
      socket.disconnect();
      console.log("❌ Socket disconnected");
    };
  }, [deliveryId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📍 Live Tracking</h2>
      <MapView pickup={pickup} drop={drop} driver={driverLocation} />
    </div>
  );
}
