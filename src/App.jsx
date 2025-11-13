"use client"

import "./App.css"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"

// Hooks / Providers
import useAuthClient from "./hooks/useAuthClient"
import { AuthProvider } from "./contexts/AuthContext"
import { DevicesProvider } from "./contexts/DevicesContext"
import { RepairOrdersProvider } from "./contexts/RepairOrdersContext"
import { RepairsProvider } from "./contexts/RepairsContext"

// Páginas públicas
import HomePage from "./pages/HomePage"
import Contact from "./pages/Contact"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

// Páginas de administración
import Dashboard from "./pages/Dashboard"
import Devices from "./pages/Devices"
import Orders from "./pages/Orders"
import Repairs from "./pages/Repairs"
import AdminRoute from "./routes/AdminRoute"

//   Componente para scroll suave
function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    // si no hay hash, volvemos arriba cuando cambiamos de ruta
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    // si hay hash, intentar scrollear a ese id
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [hash, pathname])

  return null
}

export default function App() {
  const auth = useAuthClient()

  return (
    <Router>
      <ScrollToHash />
      <AuthProvider>
        <DevicesProvider>
          <RepairOrdersProvider>
            <RepairsProvider>
              <Routes>
                {/* Públicas */}
                <Route path="/" element={<HomePage auth={auth} />} />
                <Route path="/contact" element={<Contact auth={auth} />} />
                <Route path="/register" element={<Register auth={auth} />} />
                <Route path="/login" element={<Login auth={auth} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute auth={auth}>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute auth={auth}>
                      <Orders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/devices"
                  element={
                    <AdminRoute auth={auth}>
                      <Devices />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/repairs"
                  element={
                    <AdminRoute auth={auth}>
                      <Repairs />
                    </AdminRoute>
                  }
                />
              </Routes>
            </RepairsProvider>
          </RepairOrdersProvider>
        </DevicesProvider>
      </AuthProvider>
    </Router>
  )
}
