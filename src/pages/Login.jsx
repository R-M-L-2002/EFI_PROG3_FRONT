"use client"

import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        
        console.log("[v0] Intentando login con:", { email })
        
        try {
            await login({ email, password })
            console.log("[v0] Login exitoso, redirigiendo...")
            navigate("/dashboard")
        } catch (err) {
            console.error("[v0] Error en login:", err)
            setError(err.response?.data?.message || "Error al iniciar sesión")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
        Email
        </label>
        <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        />
        </div>
        
        <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        Contraseña
        </label>
        <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        />
        </div>
        
        <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
        {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-semibold text-center mb-1">Usuario de prueba:</p>
        <p className="text-center text-gray-700">admin@test.com / password123</p>
        </div>
        </div>
        </div>
    )
}

export default Login
