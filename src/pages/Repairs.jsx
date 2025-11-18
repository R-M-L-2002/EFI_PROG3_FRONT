"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"
import { exportToPDF, exportRepairDetailsToPDF } from "../utils/exportToPDF"
import { useRepairs } from "../contexts/RepairsContext"
import { repairOrdersService } from "../services/repairOrders"

import { FaEdit, FaTrash, FaPlay, FaCheck, FaFilePdf } from "react-icons/fa"

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

        if (!validateForm()) return

        try {
            let payload = { ...formData }
            const now = new Date().toISOString()

            // limpiar fechas vacías
            if (!payload.fecha_inicio) delete payload.fecha_inicio
            if (!payload.fecha_fin) delete payload.fecha_fin

            // sanear costo / tiempo
            if (payload.tiempo_invertido_min === "" || payload.tiempo_invertido_min === null) {
            delete payload.tiempo_invertido_min
            } else {
            payload.tiempo_invertido_min = Number(payload.tiempo_invertido_min)
            }

            if (editingRepair) {
            const prevState = editingRepair.estado
            const nextState = formData.estado

            if (nextState === "pendiente") {
                // volver a pendiente = resetea todo
                delete payload.fecha_inicio
                delete payload.fecha_fin
            } else if (prevState === "completado" && nextState === "en_progreso") {
                // bajar de completado a en_progreso = solo borro fecha_fin
                delete payload.fecha_fin
            }

            if (prevState === "pendiente" && nextState === "en_progreso" && !editingRepair.fecha_inicio) {
                payload.fecha_inicio = now
            }

            if (nextState === "completado") {
                if (!editingRepair.fecha_inicio && !payload.fecha_inicio) {
                payload.fecha_inicio = now
                }
                payload.fecha_fin = now
            }

            await updateRepair(editingRepair.id, payload)
            } else {
            // CREAR nueva reparación
            const nextState = formData.estado

            if (nextState === "en_progreso") {
                payload.fecha_inicio = now
            } else if (nextState === "completado") {
                payload.fecha_inicio = now
                payload.fecha_fin = now
            }

            await createRepair(payload)
            }

            await fetchRepairs()
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
            fecha_inicio: repair.fecha_inicio || "",
            fecha_fin: repair.fecha_fin || "",
        })
        setShowModal(true)
    }

    const startRepair = async (repair) => {
        const now = new Date().toISOString()
        await updateRepair(repair.id, {
            estado: "en_progreso",
            fecha_inicio: repair.fecha_inicio || now,
        })
        await fetchRepairs()
    }

    const completeRepair = async (repair) => {
        const now = new Date().toISOString()
        await updateRepair(repair.id, {
            estado: "completado",
            fecha_inicio: repair.fecha_inicio || now,
            fecha_fin: now,
        })
        await fetchRepairs()
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

        const data = repairs.map((r) => {
        const order = r.RepairOrder || r.Order || {}
        const device = order.Device || order.device || {}
        const deviceModel = device.DeviceModel || device.device_model || device.model || {}
        const brand = deviceModel.Brand || deviceModel.brand || {}
        const customer = order.Customer || order.customer || {}
        const technician = order.Tecnico || order.tecnico || order.Technician || order.technician || {}
        
        const deviceName = brand.name && deviceModel.name
            ? `${brand.name} ${deviceModel.name}`
            : deviceModel.name || brand.name || "N/A"
        
        const customerName = customer.name || customer.first_name 
            ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.name
            : "N/A"
        
        const technicianName = technician.first_name
            ? `${technician.first_name} ${technician.last_name || ''}`.trim()
            : technician.name || "N/A"
        
        return {
            ID: r.id,
            Orden: order.id ? `#${order.id}` : r.order_id ? `#${r.order_id}` : "N/A",
            Dispositivo: deviceName,
            Cliente: customerName,
            Problema: order.problema_reportado?.substring(0, 30) || "N/A",
            Tarea: r.titulo || "N/A",
            Estado: r.estado || "Pendiente",
            Costo: `$${r.tiempo_invertido_min || 0}`,
            Técnico: technicianName,
        }
        })
        exportToPDF(data, "Reparaciones", ["ID", "Orden", "Dispositivo", "Cliente", "Problema", "Tarea", "Estado", "Costo", "Técnico"])
    }

    const handleExportDetail = (repair) => {
        console.log("RepairOrder en export:", repair.RepairOrder)
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
                        {/* BOTÓN EDITAR */}
                        <button className="btn btn--ghost" onClick={() => handleEdit(repair)} title="Editar">
                            <FaEdit size={18} />
                        </button>

                        {/* BOTÓN INICIAR */}
                        {repair.estado === "pendiente" && (
                            <button className="btn btn--ghost" onClick={() => startRepair(repair)} title="Iniciar">
                                <FaPlay size={18} />
                            </button>
                        )}

                        {/* BOTÓN COMPLETAR */}
                        {repair.estado === "en_progreso" && (
                            <button className="btn btn--ghost" onClick={() => completeRepair(repair)} title="Completar">
                                <FaCheck size={18} />
                            </button>
                        )}

                        {/* BOTÓN PDF */}
                        <button className="btn btn--ghost" onClick={() => handleExportDetail(repair)} title="Exportar a PDF">
                            <FaFilePdf size={18} />
                        </button>

                        {/* BOTÓN ELIMINAR */}
                        <button className="btn btn--ghost" onClick={() => handleDelete(repair.id)} title="Eliminar">
                            <FaTrash size={18} />
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
