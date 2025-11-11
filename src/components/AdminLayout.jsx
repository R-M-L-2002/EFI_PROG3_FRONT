"use client"

import { Link, useLocation } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

export default function AdminLayout({ children }) {
    const location = useLocation()
    const { user } = useAuth()
    
    const navItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/admin/orders", label: "Órdenes", icon: "📋" },
        { path: "/admin/devices", label: "Dispositivos", icon: "📱" },
        { path: "/admin/repairs", label: "Reparaciones", icon: "🔧" },
    ]
    
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
        <p style={{ margin: 0, fontSize: ".85rem", color: "var(--muted)" }}>{user?.Role?.name || "Usuario"}</p>
        </div>
        </aside>
        
        <main className="admin-main">{children}</main>
        </div>
    )
}
