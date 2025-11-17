"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"
import { exportToPDF, exportRepairDetailsToPDF } from "../utils/exportToPDF"
import { useRepairs } from "../contexts/RepairsContext"
import { repairOrdersService } from "../services/repairOrders"

export default function Repairs() {
    const { repairs, loading, error, fetchRepairs, createRepair, updateRepair, deleteRepair } = useRepairs()
    const [showModal, setShowModal] = useState(false)
    const [editingRepair, setEditingRepair] = useState(null)
    const [repairOrders, setRepairOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(false)
    
    const [formData, setFormData] = useState({
        order_id: "",
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        tiempo_invertido_min: "",
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetchRepairs()
    }, [])

    useEffect(() => {
        if (showModal) {
        loadRepairOrders()
        }
    }, [showModal])

    const loadRepairOrders = async () => {
        setLoadingOrders(true)
        try {
        const ordersData = await repairOrdersService.getAll()
        setRepairOrders(ordersData?.data || ordersData || [])
        } catch (err) {
        console.error("Error loading repair orders:", err)
        } finally {
        setLoadingOrders(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.order_id) {
        newErrors.order_id = "Debe seleccionar una orden"
        }
        if (!formData.titulo || formData.titulo.trim().length < 3) {
        newErrors.titulo = "El título debe tener al menos 3 caracteres"
        }
        if (!formData.descripcion || formData.descripcion.trim().length < 10) {
        newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
        }
        if (formData.tiempo_invertido_min && formData.tiempo_invertido_min < 0) {
        newErrors.tiempo_invertido_min = "El costo no puede ser negativo"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
        return
        }
        
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
        setErrors({})
    }

    const handleExport = () => {
        if (!repairs || !Array.isArray(repairs)) return

        const data = repairs.map((r) => ({
        ID: r.id,
        Orden: r.RepairOrder?.id ? `#${r.RepairOrder.id}` : r.order_id ? `#${r.order_id}` : "N/A",
        Dispositivo: r.RepairOrder?.Device?.DeviceModel?.Brand?.name 
            ? `${r.RepairOrder.Device.DeviceModel.Brand.name} ${r.RepairOrder.Device.DeviceModel.name}`
            : "N/A",
        Cliente: r.RepairOrder?.Customer?.name || "N/A",
        Problema: r.RepairOrder?.problema_reportado?.substring(0, 30) || "N/A",
        Tarea: r.titulo || "N/A",
        Estado: r.estado || "Pendiente",
        Costo: `$${r.tiempo_invertido_min || 0}`,
        Técnico: r.RepairOrder?.Tecnico?.name || "N/A",
        }))
        exportToPDF(data, "Reparaciones", ["ID", "Orden", "Dispositivo", "Cliente", "Problema", "Tarea", "Estado", "Costo", "Técnico"])
    }

    const handleExportDetail = (repair) => {
        exportRepairDetailsToPDF(repair)
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
            <LoadingSpinner message="Cargando reparaciones..." />
        ) : error ? (
            <ErrorState message={error} onRetry={fetchRepairs} />
        ) : repairs && repairs.length === 0 ? (
            <EmptyState
            icon="🔧"
            title="No hay reparaciones"
            description="Comienza creando tu primera tarea de reparación"
            actionLabel="Crear Primera Reparación"
            onAction={() => setShowModal(true)}
            />
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
                {repairs.map((repair) => (
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
                        style={{ padding: "6px 12px", marginRight: "8px" }}
                        onClick={() => handleExportDetail(repair)}
                        title="Exportar detalles a PDF"
                        >
                        PDF
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
                ))}
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
                    <label htmlFor="order_id">Orden de Reparación *</label>
                    {loadingOrders ? (
                    <div style={{ padding: "8px", color: "var(--muted)" }}>Cargando órdenes...</div>
                    ) : (
                    <select
                        id="order_id"
                        required
                        value={formData.order_id}
                        onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                        style={{ borderColor: errors.order_id ? "#ef4444" : undefined }}
                    >
                        <option value="">Seleccione una orden</option>
                        {repairOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                            #{order.id} - {order.Customer?.name || "Sin cliente"} - {order.Device?.DeviceModel?.name || "Sin dispositivo"}
                        </option>
                        ))}
                    </select>
                    )}
                    {errors.order_id && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.order_id}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="titulo">Título de Tarea *</label>
                    <input
                    id="titulo"
                    type="text"
                    required
                    placeholder="Ej: Reemplazar pantalla"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    style={{ borderColor: errors.titulo ? "#ef4444" : undefined }}
                    />
                    {errors.titulo && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.titulo}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="descripcion">Descripción *</label>
                    <textarea
                    id="descripcion"
                    rows={4}
                    required
                    placeholder="Describe los detalles de la reparación..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    style={{ borderColor: errors.descripcion ? "#ef4444" : undefined }}
                    />
                    {errors.descripcion && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.descripcion}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="tiempo_invertido_min">Costo (pesos)</label>
                    <input
                    id="tiempo_invertido_min"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.tiempo_invertido_min}
                    onChange={(e) => setFormData({ ...formData, tiempo_invertido_min: e.target.value })}
                    style={{ borderColor: errors.tiempo_invertido_min ? "#ef4444" : undefined }}
                    />
                    {errors.tiempo_invertido_min && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.tiempo_invertido_min}
                    </span>
                    )}
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
                    <button type="submit" className="btn btn--primary" disabled={loadingOrders}>
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
