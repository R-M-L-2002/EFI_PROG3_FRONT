import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuthClient from "./hooks/useAuthClient";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import LoginPublic from "./pages/LoginPublic";

// Admin
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Login from "./pages/Login";           
import Orders from "./pages/Orders";
import Repairs from "./pages/Repairs";

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // si no hay hash, volvemos arriba cuando cambiamos de ruta
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // si hay hash, intentar scrollear a ese id
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, pathname]);

  return null;
}

export default function App() {
  const auth = useAuthClient();

  return (
    <Router>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage auth={auth} />} />
        <Route path="/contact" element={<Contact auth={auth} />} />
        <Route path="/register" element={<Register auth={auth} />} />
        <Route path="/login" element={<LoginPublic auth={auth} />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/devices" element={<Devices />} />
        <Route path="/admin/repairs" element={<Repairs />} />
      </Routes>
    </Router>
  );
}
