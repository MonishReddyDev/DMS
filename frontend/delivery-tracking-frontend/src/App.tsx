import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Track from "./pages/Track";
import Register from "./pages/Register";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/track/:deliveryId" element={<Track />} />
    </Routes>
  );
}

export default App;
