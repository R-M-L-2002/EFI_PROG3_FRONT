import "./App.css"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import useAuthClient from "./hooks/useAuthClient"
import TopNav from "./components/TopNav"
import LayoutWrapper from "./components/LayoutWrapper"

// Providers
import { AuthProvider } from "./contexts/AuthContext";
import { DevicesProvider } from "./contexts/DevicesContext";
import { RepairOrdersProvider } from "./contexts/RepairOrdersContext";
import { RepairsProvider } from "./contexts/RepairsContext";

// Páginas públicas
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Orders from "./pages/Orders";
import Repairs from "./pages/Repairs";
import AdminRoute from "./routes/AdminRoute";

// Técnico / Cliente
import TechnicianDashboard from "./pages/TechnicianDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import TechnicianRoute from "./routes/TechnicianRoute";
import CustomerRoute from "./routes/CustomerRoute";

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, pathname]);

  return null;
}

export default function App() {
  const auth = useAuthClient(); // <-- necesario para pasar info a TopNav

  return (
    <Router>
      <ScrollToHash />
      <AuthProvider>
        <DevicesProvider>
          <RepairOrdersProvider>
            <RepairsProvider>
              <LayoutWrapper> 
                <Routes>

                  {/* Públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Admin */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <Orders />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/devices"
                    element={
                      <AdminRoute>
                        <Devices />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/repairs"
                    element={
                      <AdminRoute>
                        <Repairs />
                      </AdminRoute>
                    }
                  />

                  {/* Técnico */}
                  <Route
                    path="/technician/dashboard"
                    element={
                      <TechnicianRoute>
                        <TechnicianDashboard />
                      </TechnicianRoute>
                    }
                  />

                  {/* Cliente */}
                  <Route
                    path="/customer/dashboard"
                    element={
                      <CustomerRoute>
                        <CustomerDashboard />
                      </CustomerRoute>
                    }
                  />
                </Routes>
              </LayoutWrapper>
            </RepairsProvider>
          </RepairOrdersProvider>
        </DevicesProvider>
      </AuthProvider>
    </Router>
  );
}
