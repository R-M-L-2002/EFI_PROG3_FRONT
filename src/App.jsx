import "./App.css"

import { Route, BrowserRouter as Router, Routes} from "react-router-dom"
import useAuthClient from "./hooks/useAuthClient"; // si más adelante lo separás
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import Devices from "./pages/Devices"
import Login from "./pages/Login"
import Orders from "./pages/Orders"
import Repairs from "./pages/Repairs"

export default function App() {
  const auth = useAuthClient(); // si aún lo tenés inline, mantenelo así

  return (
    <Router>
      {/* providers... */}
      <Routes>
        <Route path="/" element={<HomePage auth={auth} />} />
        <Route path="/contact" element={<Contact auth={auth} />} />
        <Route path="/register" element={<Register auth={auth} />} />
        {/* admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/devices" element={<Devices />} />
        <Route path="/admin/repairs" element={<Repairs />} />
      </Routes>
    </Router>
  );
}
