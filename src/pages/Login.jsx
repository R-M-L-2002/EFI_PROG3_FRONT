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
            navigate("/admin/dashboard")
        } catch (err) {
            console.error("[v0] Error en login:", err)
            setError(err.response?.data?.message || "Error al iniciar sesión")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="site" style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
        <div className="container" style={{ maxWidth: "450px" }}>
        <div className="card" style={{ textAlign: "center" }}>
        <div className="brand" style={{ justifyContent: "center", marginBottom: "24px" }}>
        <span className="brand__logo">⚡</span>
        <span className="brand__name">TechFix Admin</span>
        </div>
        
        <h2 style={{ marginBottom: "8px" }}>Iniciar Sesión</h2>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>Ingresa tus credenciales para acceder al panel</p>
        
        {error && (
            <div
            className="pill"
            style={{
                background: "rgba(239,68,68,.2)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,.4)",
                marginBottom: "16px",
            }}
            >
            {error}
            </div>
        )}
        
        <form className="form" onSubmit={handleSubmit}>
        <div className="form__field">
        <label htmlFor="email">Email</label>
        <input
        id="email"
        type="email"
        required
        placeholder="admin@techfix.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        />
        </div>
        
        <div className="form__field">
        <label htmlFor="password">Contraseña</label>
        <input
        id="password"
        type="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        />
        </div>
        
        <button className="btn btn--primary" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        </form>
        
        <p style={{ color: "var(--muted)", marginTop: "20px", fontSize: ".9rem" }}>
        Usuario demo: <strong>admin@techfix.com</strong> / <strong>admin123</strong>
        </p>
        </div>
        </div>
        </div>
    )
}

export default Login
