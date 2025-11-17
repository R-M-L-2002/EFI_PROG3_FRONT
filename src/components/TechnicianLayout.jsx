"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function TechnicianLayout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    
    const navItems = [
        { path: "/technician/dashboard", label: "Mis Asignaciones", icon: "🔧" },
        { path: "/profile", label: "Mi Perfil", icon: "👤" },
        { path: "/change-password", label: "Cambiar Contraseña", icon: "🔒" },
    ]
    
    const handleLogout = () => {
        logout()
        navigate("/login")
    }
    
    return (
        <div className="admin-layout">
        <aside className="admin-sidebar">
        <div className="brand">
        <span className="brand__logo">⚡</span>
        <span className="brand__name">TechFix</span>
        </div>
        
        <ul className="sidebar-nav">
        {navItems.map((item) => (
            <li key={item.path}>
            <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            </Link>
            </li>
        ))}
        </ul>
        
        <div style={{ marginTop: "auto", padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <p style={{ margin: "0 0 4px", fontSize: ".9rem" }}>{user?.name || user?.email}</p>
        <p style={{ margin: "0 0 12px", fontSize: ".85rem", color: "var(--muted)" }}>
        {user?.Role?.name || "Técnico"}
        </p>
        <button 
        onClick={handleLogout} 
        className="btn btn--ghost" 
        style={{ width: "100%", padding: "8px" }}
        >
        Cerrar Sesión
        </button>
        </div>
        </aside>
        
        <main className="admin-main">{children}</main>
        </div>
    )
}
