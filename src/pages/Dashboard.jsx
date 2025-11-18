"use client"

import { Link, useNavigate } from "react-router-dom"

import AdminLayout from "../components/AdminLayout"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    
    const handleBack = () => {
        navigate("/")
    }
    
    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
            return "Administrador"
            case 2:
            return "Técnico"
            case 3:
            return "Usuario"
            default:
            return "Usuario"
        }
    }
    
    const stats = [
        { label: "Órdenes Pendientes", value: "12", color: "var(--brand)" },
        { label: "En Reparación", value: "8", color: "var(--brand-2)" },
        { label: "Completadas Hoy", value: "5", color: "#86efac" },
        { label: "Total del Mes", value: "47", color: "#fde047" },
    ]
    
    return (
        <AdminLayout>
        <div className="admin-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
        <h1 style={{ margin: "0 0 8px" }}>Dashboard</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
        Bienvenido, {user?.name || user?.email} ({getRoleName(user?.role_id)})
        </p>
        </div>
        <button className="btn btn--ghost" onClick={handleBack}>
        Volver
        </button>
        </div>
        </div>
        
        <div className="grid" style={{ marginBottom: "24px" }}>
        {stats.map((stat) => (
            <div key={stat.label} className="card">
            <h3 style={{ margin: "0 0 8px", fontSize: "2rem", color: stat.color }}>{stat.value}</h3>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: ".9rem" }}>{stat.label}</p>
            </div>
        ))}
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <Link to="/admin/orders" style={{ textDecoration: "none" }}>
        <div className="card service">
        <div className="service__icon">📋</div>
        <h3 className="service__title">Órdenes de Reparación</h3>
        <p style={{ color: "var(--muted)", margin: 0 }}>Gestionar órdenes de reparación</p>
        </div>
        </Link>
        
        <Link to="/admin/devices" style={{ textDecoration: "none" }}>
        <div className="card service">
        <div className="service__icon">📱</div>
        <h3 className="service__title">Dispositivos</h3>
        <p style={{ color: "var(--muted)", margin: 0 }}>Administrar dispositivos</p>
        </div>
        </Link>
        
        <Link to="/admin/repairs" style={{ textDecoration: "none" }}>
        <div className="card service">
        <div className="service__icon">🔧</div>
        <h3 className="service__title">Reparaciones</h3>
        <p style={{ color: "var(--muted)", margin: 0 }}>Gestionar tareas de reparación</p>
        </div>
        </Link>
        </div>

        <Link to="/admin/technicians" style={{ textDecoration: "none" }}>
        <div className="card service">
            <div className="service__icon">👨‍🔧</div>
            <h3 className="service__title">Técnicos</h3>
            <p style={{ color: "var(--muted)", margin: 0 }}>Gestionar técnicos</p>
        </div>
        </Link>
        </AdminLayout>
    )
}

export default Dashboard
