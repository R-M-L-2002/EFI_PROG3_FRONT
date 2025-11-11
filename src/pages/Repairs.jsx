"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import { exportToPDF } from "../utils/exportToPDF"
import { useRepairs } from "../contexts/RepairsContext"

export default function Repairs() {
    const { repairs, loading, error, fetchRepairs, createRepair, updateRepair, deleteRepair } = useRepairs()
    const [showModal, setShowModal] = useState(false)
    const [editingRepair, setEditingRepair] = useState(null)
    const [formData, setFormData] = useState({
        order_id: "",
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        tiempo_invertido_min: "",
    })
    
    useEffect(() => {
        console.log("[v0] Repairs page mounted, fetching repairs")
        fetchRepairs()
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingRepair) {
                await updateRepair(editingRepair.id, formData)
            } else {
                await createRepair(formData)
            }
            handleCloseModal()
        } catch (err) {
            console.error(err)
        }
    }
    
    const handleEdit = (repair) => {
        setEditingRepair(repair)
        setFormData({
            order_id: repair.order_id || "",
            titulo: repair.titulo || "",
            descripcion: repair.descripcion || "",
            estado: repair.estado || "pendiente",
            tiempo_invertido_min: repair.tiempo_invertido_min || "",
        })
        setShowModal(true)
    }
    
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta reparación?")) {
            await deleteRepair(id)
        }
    }
    
    const handleCloseModal = () => {
        setShowModal(false)
        setEditingRepair(null)
        setFormData({ order_id: "", titulo: "", descripcion: "", estado: "pendiente", tiempo_invertido_min: "" })
    }
    
    const handleExport = () => {
        if (!repairs || !Array.isArray(repairs)) return
        
        const data = repairs.map((r) => ({
            ID: r.id,
            Orden: r.RepairOrder?.id ? `#${r.RepairOrder.id}` : r.order_id ? `#${r.order_id}` : "N/A",
            Tarea: r.titulo || "N/A",
            Estado: r.estado || "Pendiente",
            Costo: `$${r.tiempo_invertido_min || 0}`,
        }))
        exportToPDF(data, "Reparaciones", ["ID", "Orden", "Tarea", "Estado", "Costo"])
    }
    
    return (
        <AdminLayout>
        <div className="admin-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
        <h1 style={{ margin: "0 0 8px" }}>Reparaciones</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>Gestiona las tareas de reparación</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
        <button className="btn btn--ghost" onClick={handleExport}>
        Exportar PDF
        </button>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
        Nueva Reparación
        </button>
        </div>
        </div>
        </div>
        
        {loading ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            Cargando reparaciones...
            </div>
        ) : error ? (
            <div className="card" style={{ color: "#fca5a5" }}>
            Error: {error}
            </div>
        ) : (
            <div className="table-wrapper">
            <table>
            <thead>
            <tr>
            <th>ID</th>
            <th>Orden</th>
            <th>Tarea</th>
            <th>Estado</th>
            <th>Costo</th>
            <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {repairs && repairs.length > 0 ? (
                repairs.map((repair) => (
                    <tr key={repair.id}>
                    <td>#{repair.id}</td>
                    <td>#{repair.RepairOrder?.id || repair.order_id || "N/A"}</td>
                    <td>{repair.titulo || "N/A"}</td>
                    <td>
                    <span
                    className={`badge ${
                        repair.estado === "completado"
                        ? "badge--success"
                        : repair.estado === "en_progreso"
                        ? "badge--info"
                        : "badge--warning"
                    }`}
                    >
                    {repair.estado === "completado" && "Completado"}
                    {repair.estado === "en_progreso" && "En Progreso"}
                    {repair.estado === "pendiente" && "Pendiente"}
                    {repair.estado === "bloqueado" && "Bloqueado"}
                    {!["completado", "en_progreso", "pendiente", "bloqueado"].includes(repair.estado) &&
                        repair.estado}
                        </span>
                        </td>
                        <td>${repair.tiempo_invertido_min || 0}</td>
                        <td>
                        <button
                        className="btn btn--ghost"
                        style={{ padding: "6px 12px", marginRight: "8px" }}
                        onClick={() => handleEdit(repair)}
                        >
                        Editar
                        </button>
                        <button
                        className="btn btn--ghost"
                        style={{ padding: "6px 12px" }}
                        onClick={() => handleDelete(repair.id)}
                        >
                        Eliminar
                        </button>
                        </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    No hay reparaciones disponibles
                    </td>
                    </tr>
                )}
                </tbody>
                </table>
                </div>
            )}
            
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                <h2>{editingRepair ? "Editar Reparación" : "Nueva Reparación"}</h2>
                <button className="btn btn--ghost" onClick={handleCloseModal}>
                ✕
                </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                <div className="form__field">
                <label htmlFor="order_id">ID de Orden</label>
                <input
                id="order_id"
                type="number"
                required
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="titulo">Título de Tarea</label>
                <input
                id="titulo"
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                id="descripcion"
                rows={4}
                required
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="tiempo_invertido_min">Costo (pesos)</label>
                <input
                id="tiempo_invertido_min"
                type="number"
                min="0"
                step="1"
                value={formData.tiempo_invertido_min}
                onChange={(e) => setFormData({ ...formData, tiempo_invertido_min: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="estado">Estado</label>
                <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
                <option value="bloqueado">Bloqueado</option>
                </select>
                </div>
                <div className="form__actions">
                <button type="submit" className="btn btn--primary">
                {editingRepair ? "Actualizar" : "Crear"}
                </button>
                <button type="button" className="btn btn--ghost" onClick={handleCloseModal}>
                Cancelar
                </button>
                </div>
                </form>
                </div>
                </div>
            )}
            </AdminLayout>
        )
    }
    