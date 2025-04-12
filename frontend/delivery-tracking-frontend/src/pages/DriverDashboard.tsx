import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

type Delivery = {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  status: string;
  assignedToId?: string;
};

export default function DriverDashboard() {
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>(
    []
  );
  const [myDelivery, setMyDelivery] = useState<Delivery | null>(null);

  const token = localStorage.getItem("token");
  const driverId = localStorage.getItem("userId"); // Store this at login
  const [socket, setSocket] = useState<Socket | null>(null);

  // ✅ Socket Setup
  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:3002", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("✅ DRIVER connected to socket");
    });

    newSocket.on("delivery:new", (delivery: Delivery) => {
      console.log("📦 New delivery broadcast:", delivery);
      setAvailableDeliveries((prev) => [...prev, delivery]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Accept delivery
  const acceptDelivery = async (deliveryId: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3002/api/deliveries/${deliveryId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Delivery accepted!");
      setMyDelivery(res.data.data); // save accepted one
      setAvailableDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "❌ Failed to accept delivery. Someone else might’ve accepted it."
      );
    }
  };

  // ✅ Mark as Delivered
  const markAsDelivered = async (deliveryId: string) => {
    try {
      await axios.patch(
        `http://localhost:3002/api/deliveries/${deliveryId}/status`,
        { status: "DELIVERED" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("🎉 Delivery completed!");
      setMyDelivery(null);
    } catch (err) {
      alert("❌ Failed to mark as delivered");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🚚 Driver Dashboard</h2>

      {/* 👇 New Deliveries */}
      <section style={{ marginTop: "2rem" }}>
        <h3>📦 New Deliveries</h3>
        {availableDeliveries.length === 0 && (
          <p>No new deliveries at the moment.</p>
        )}
        {availableDeliveries.map((d) => (
          <div
            key={d.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Pickup:</strong> {d.pickupLocation}
            </p>
            <p>
              <strong>Drop:</strong> {d.dropLocation}
            </p>
            <p>
              <strong>Status:</strong> {d.status}
            </p>
            <button onClick={() => acceptDelivery(d.id)}>Accept</button>
          </div>
        ))}
      </section>

      {/* 👇 Accepted Delivery */}
      {myDelivery && (
        <section style={{ marginTop: "3rem" }}>
          <h3>🛠️ Your Current Delivery</h3>
          <div
            style={{
              padding: "1rem",
              border: "2px solid green",
              borderRadius: "8px",
              backgroundColor: "#f5fff5",
            }}
          >
            <p>
              <strong>Pickup:</strong> {myDelivery.pickupLocation}
            </p>
            <p>
              <strong>Drop:</strong> {myDelivery.dropLocation}
            </p>
            <p>
              <strong>Status:</strong> {myDelivery.status}
            </p>
            <button
              onClick={() => markAsDelivered(myDelivery.id)}
              style={{ marginRight: "10px" }}
            >
              ✅ Mark as Delivered
            </button>
            <button
              onClick={() => window.open(`/track/${myDelivery.id}`, "_blank")}
            >
              📍 Track
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
