"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"
import { exportToPDF } from "../utils/exportToPDF"
import { useRepairOrders } from "../contexts/RepairOrdersContext"
import { customersService } from "../services/customers"
import { devicesService } from "../services/devices"
import { usersService } from "../services/user"

export default function Orders() {
    const { orders, loading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useRepairOrders()
    const [showModal, setShowModal] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const [customers, setCustomers] = useState([])
    const [devices, setDevices] = useState([])
    const [technicians, setTechnicians] = useState([])
    const [loadingDropdowns, setLoadingDropdowns] = useState(false)
    
    const [formData, setFormData] = useState({
        customer_id: "",
        device_id: "",
        tecnico_id: "",
        problema_reportado: "",
        estado_id: 1,
        fecha_recibido: "",
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        if (showModal) {
        loadDropdownData()
        }
    }, [showModal])

    const loadDropdownData = async () => {
        setLoadingDropdowns(true)
        try {
        const [customersData, devicesData, usersData] = await Promise.all([
            customersService.getAll(),
            devicesService.getAll(),
            usersService.getAll(),
        ])
        
        setCustomers(customersData?.data || customersData || [])
        setDevices(devicesData?.data || devicesData || [])
        const techniciansList = (usersData?.data || usersData || []).filter(
            (user) => user.role_id === 2
        )
        setTechnicians(techniciansList)
        } catch (err) {
        console.error("Error loading dropdown data:", err)
        } finally {
        setLoadingDropdowns(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.customer_id) {
        newErrors.customer_id = "Debe seleccionar un cliente"
        }
        if (!formData.device_id) {
        newErrors.device_id = "Debe seleccionar un dispositivo"
        }
        if (!formData.tecnico_id) {
        newErrors.tecnico_id = "Debe seleccionar un técnico"
        }
        if (!formData.problema_reportado || formData.problema_reportado.trim().length < 10) {
        newErrors.problema_reportado = "El problema debe tener al menos 10 caracteres"
        }
        if (!formData.fecha_recibido) {
        newErrors.fecha_recibido = "Debe seleccionar una fecha"
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
        if (editingOrder) {
            await updateOrder(editingOrder.id, formData)
        } else {
            await createOrder(formData)
        }
        handleCloseModal()
        fetchOrders()
        } catch (err) {
        console.error(err)
        }
    }

    const handleEdit = (order) => {
        setEditingOrder(order)
        setFormData({
        customer_id: order.customer_id || "",
        device_id: order.device_id || "",
        tecnico_id: order.tecnico_id || "",
        problema_reportado: order.problema_reportado || "",
        estado_id: order.estado_id || 1,
        fecha_recibido: order.fecha_recibido ? new Date(order.fecha_recibido).toISOString().split("T")[0] : "",
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta orden?")) {
        await deleteOrder(id)
        fetchOrders()
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingOrder(null)
        setFormData({
        customer_id: "",
        device_id: "",
        tecnico_id: "",
        problema_reportado: "",
        estado_id: 1,
        fecha_recibido: "",
        })
        setErrors({})
    }

    const handleExport = () => {
        if (!orders || !Array.isArray(orders)) return

        const data = orders.map((o) => ({
        ID: o.id,
        Cliente: o.Customer?.name || "N/A",
        Dispositivo: o.Device?.DeviceModel?.name || "N/A",
        Estado: o.OrderStatus?.name || "N/A",
        Fecha: o.fecha_recibido ? new Date(o.fecha_recibido).toLocaleDateString() : "N/A",
        }))
        exportToPDF(data, "Órdenes de Reparación", ["ID", "Cliente", "Dispositivo", "Estado", "Fecha"])
    }

    return (
        <AdminLayout>
        <div className="admin-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <h1 style={{ margin: "0 0 8px" }}>Órdenes de Reparación</h1>
                <p style={{ margin: 0, color: "var(--muted)" }}>Gestiona las órdenes de reparación del taller</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn--ghost" onClick={handleExport}>
                Exportar PDF
                </button>
                <button className="btn btn--primary" onClick={() => setShowModal(true)}>
                Nueva Orden
                </button>
            </div>
            </div>
        </div>

        {loading ? (
            <LoadingSpinner message="Cargando órdenes..." />
        ) : error ? (
            <ErrorState message={error} onRetry={fetchOrders} />
        ) : orders && orders.length === 0 ? (
            <EmptyState
            icon="📋"
            title="No hay órdenes"
            description="Comienza creando tu primera orden de reparación"
            actionLabel="Crear Primera Orden"
            onAction={() => setShowModal(true)}
            />
        ) : (
            <div className="table-wrapper">
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Dispositivo</th>
                    <th>Problema</th>
                    <th>Estado</th>
                    <th>Fecha Recibido</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.Customer?.name || "N/A"}</td>
                    <td>{order.Device?.DeviceModel?.name || "N/A"}</td>
                    <td>{order.problema_reportado?.substring(0, 50) || "Sin descripción"}...</td>
                    <td>
                        <span className="badge badge--info">{order.OrderStatus?.name || "Pendiente"}</span>
                    </td>
                    <td>{order.fecha_recibido ? new Date(order.fecha_recibido).toLocaleDateString() : "N/A"}</td>
                    <td>
                        <button
                        className="btn btn--ghost"
                        style={{ padding: "6px 12px", marginRight: "8px" }}
                        onClick={() => handleEdit(order)}
                        >
                        Editar
                        </button>
                        <button
                        className="btn btn--ghost"
                        style={{ padding: "6px 12px" }}
                        onClick={() => handleDelete(order.id)}
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
                <h2>{editingOrder ? "Editar Orden" : "Nueva Orden"}</h2>
                <button className="btn btn--ghost" onClick={handleCloseModal}>
                    ✕
                </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                <div className="form__field">
                    <label htmlFor="customer_id">Cliente *</label>
                    {loadingDropdowns ? (
                    <div style={{ padding: "8px", color: "var(--muted)" }}>Cargando clientes...</div>
                    ) : (
                    <select
                        id="customer_id"
                        required
                        value={formData.customer_id}
                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                        style={{ borderColor: errors.customer_id ? "#ef4444" : undefined }}
                    >
                        <option value="">Seleccione un cliente</option>
                        {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.email}
                        </option>
                        ))}
                    </select>
                    )}
                    {errors.customer_id && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.customer_id}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="device_id">Dispositivo *</label>
                    {loadingDropdowns ? (
                    <div style={{ padding: "8px", color: "var(--muted)" }}>Cargando dispositivos...</div>
                    ) : (
                    <select
                        id="device_id"
                        required
                        value={formData.device_id}
                        onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                        style={{ borderColor: errors.device_id ? "#ef4444" : undefined }}
                    >
                        <option value="">Seleccione un dispositivo</option>
                        {devices.map((device) => (
                        <option key={device.id} value={device.id}>
                            {device.DeviceModel?.Brand?.name} {device.DeviceModel?.name} - S/N: {device.serial_number}
                        </option>
                        ))}
                    </select>
                    )}
                    {errors.device_id && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.device_id}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="tecnico_id">Técnico Asignado *</label>
                    {loadingDropdowns ? (
                    <div style={{ padding: "8px", color: "var(--muted)" }}>Cargando técnicos...</div>
                    ) : (
                    <select
                        id="tecnico_id"
                        required
                        value={formData.tecnico_id}
                        onChange={(e) => setFormData({ ...formData, tecnico_id: e.target.value })}
                        style={{ borderColor: errors.tecnico_id ? "#ef4444" : undefined }}
                    >
                        <option value="">Seleccione un técnico</option>
                        {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                            {tech.name} - {tech.email}
                        </option>
                        ))}
                    </select>
                    )}
                    {errors.tecnico_id && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.tecnico_id}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="fecha_recibido">Fecha Recibido *</label>
                    <input
                    id="fecha_recibido"
                    type="date"
                    required
                    value={formData.fecha_recibido}
                    onChange={(e) => setFormData({ ...formData, fecha_recibido: e.target.value })}
                    style={{ borderColor: errors.fecha_recibido ? "#ef4444" : undefined }}
                    />
                    {errors.fecha_recibido && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.fecha_recibido}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="problema_reportado">Problema Reportado *</label>
                    <textarea
                    id="problema_reportado"
                    rows={4}
                    required
                    placeholder="Describe el problema reportado por el cliente..."
                    value={formData.problema_reportado}
                    onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
                    style={{ borderColor: errors.problema_reportado ? "#ef4444" : undefined }}
                    />
                    {errors.problema_reportado && (
                    <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
                        {errors.problema_reportado}
                    </span>
                    )}
                </div>

                <div className="form__field">
                    <label htmlFor="estado_id">Estado</label>
                    <select
                    id="estado_id"
                    value={formData.estado_id}
                    onChange={(e) => setFormData({ ...formData, estado_id: e.target.value })}
                    >
                    <option value="1">Pendiente</option>
                    <option value="2">En Proceso</option>
                    <option value="3">Completado</option>
                    </select>
                </div>

                <div className="form__actions">
                    <button type="submit" className="btn btn--primary" disabled={loadingDropdowns}>
                    {editingOrder ? "Actualizar" : "Crear"}
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
