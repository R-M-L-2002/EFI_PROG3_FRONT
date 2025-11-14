"use client"

import { Navigate, Route, Routes } from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import Home from "../pages/Home"
import { useAuth } from "../contexts/AuthContext"

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  if (user) {
    return <Navigate to="/" />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home - según el rol */}
      <Route path="/" element={<Home />} />

      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Rutas privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Ruta 404 */}
      <Route
        path="/unauthorized"
        element={<div className="text-center py-8">No tienes permisos para acceder a esta página</div>}
      />
      <Route path="*" element={<div className="text-center py-8">Página no encontrada</div>} />
    </Routes>
  )
}

export default AppRoutes
