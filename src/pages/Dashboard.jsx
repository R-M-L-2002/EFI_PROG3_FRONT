"use client"

import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    
    console.log("[v0] Usuario actual en Dashboard:", user)
    
    const handleLogout = () => {
        console.log("[v0] Cerrando sesión...")
        logout()
        navigate("/login")
    }
    
    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
            return "Administrador"
            case 2:
            return "Técnico"
            case 3:
            return "Recepcionista"
            default:
            return "Usuario"
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sistema de Reparaciones</h1>
        <div className="flex items-center gap-4">
        <span className="text-gray-700">
        {user?.name} ({getRoleName(user?.role_id)})
        </span>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
        Cerrar Sesión
        </button>
        </div>
        </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
        <h3 className="font-bold text-green-800 mb-2">✓ Test Exitoso</h3>
        <p className="text-sm text-green-700">
        Si puedes ver esta página, significa que la autenticación, contextos y rutas funcionan correctamente. Revisa
        la consola del navegador para ver los logs con prefijo [v0].
        </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Órdenes de Reparación</h3>
        <p className="text-gray-600">Gestiona las órdenes de reparación</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Dispositivos</h3>
        <p className="text-gray-600">Administra los dispositivos</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Reparaciones</h3>
        <p className="text-gray-600">Gestiona las tareas de reparación</p>
        </div>
        </div>
        </main>
        </div>
    )
}

export default Dashboard
