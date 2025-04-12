import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [itemDescription, setitemDescription] = useState("");
  const [deliveries, setDeliveries] = useState<any[]>([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const createDelivery = async () => {
    try {
      await axios.post(
        "http://localhost:3002/api/deliveries",
        {
          pickupLocation: pickup,
          dropLocation: drop,
          itemDescription: "Package from UI",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPickup("");
      setDrop("");
      fetchDeliveries();
    } catch (err) {
      alert("Delivery creation failed");
      console.error(err);
    }
  };

  async function getCoordinatesFromAddress(
    address: string
  ): Promise<{ lat: number; lng: number }> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (!data.results.length) {
      throw new Error("Invalid address");
    }

    return data.results[0].geometry.location;
  }

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/deliveries/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries(res.data.data);
    } catch (err) {
      console.error("Error fetching deliveries", err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📦 User Dashboard</h2>

      <h4>Create New Delivery</h4>
      <input
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        style={{ marginBottom: "8px", width: "100%" }}
      />
      <br />
      <input
        placeholder="Drop Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
        style={{ marginBottom: "8px", width: "100%" }}
      />
      <br />
      <input
        placeholder="Item Description"
        value={itemDescription}
        onChange={(e) => setitemDescription(e.target.value)}
        style={{ marginBottom: "8px", width: "100%" }}
      />
      <br />
      <button onClick={createDelivery}>Create Delivery</button>

      <hr />

      <h4>My Deliveries</h4>
      {deliveries.map((d) => (
        <div
          key={d.id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div>
            <strong>Pickup:</strong> {d.pickupLocation}
          </div>
          <div>
            <strong>Drop:</strong> {d.dropLocation}
          </div>
          <div>
            <strong>Status:</strong> {d.status}
          </div>
          <button onClick={() => navigate(`/track/${d.id}`)}>
            Track Delivery
          </button>
        </div>
      ))}
    </div>
  );
}
