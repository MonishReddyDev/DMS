import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "DRIVER">("USER");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        email,
        password,
        role,
      });

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Role:</label>
      <br />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "USER" | "DRIVER")}
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <option value="USER">User (Shipper)</option>
        <option value="DRIVER">Driver</option>
      </select>

      <button onClick={handleRegister} style={{ width: "100%" }}>
        Register
      </button>
    </div>
  );
}
