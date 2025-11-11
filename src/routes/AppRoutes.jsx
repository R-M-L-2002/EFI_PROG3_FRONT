"use client"

import { Navigate, Route, Routes } from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
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
        return <Navigate to="/dashboard" />
    }
    
    return children
}

const AppRoutes = () => {
    return (
        <Routes>
        {/* Rutas públicas */}
        <Route
        path="/login"
        element={
            <PublicRoute>
            <Login />
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
        
        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
        path="/unauthorized"
        element={<div className="text-center py-8">No tienes permisos para acceder a esta página</div>}
        />
        <Route path="*" element={<div className="text-center py-8">Página no encontrada</div>} />
        </Routes>
    )
}

export default AppRoutes
