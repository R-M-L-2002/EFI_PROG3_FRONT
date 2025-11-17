"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import { exportToPDF } from "../utils/exportToPDF"
import { useRepairOrders } from "../contexts/RepairOrdersContext"

export default function Orders() {
    const { orders, loading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useRepairOrders()
    const [showModal, setShowModal] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const [formData, setFormData] = useState({
        customer_id: "",
        device_id: "",
        tecnico_id: "",
        problema_reportado: "",
        estado_id: 1,
        fecha_recibido: "",
    })
    
    useEffect(() => {
        console.log("[v0] Orders page mounted, fetching orders")
        fetchOrders()
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
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
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            Cargando órdenes...
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
            <th>Cliente</th>
            <th>Dispositivo</th>
            <th>Problema</th>
            <th>Estado</th>
            <th>Fecha Recibido</th>
            <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {orders &&
                Array.isArray(orders) &&
                orders.map((order) => (
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
                <label htmlFor="customer_id">ID Cliente</label>
                <input
                id="customer_id"
                type="number"
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="device_id">ID Dispositivo</label>
                <input
                id="device_id"
                type="number"
                required
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="tecnico_id">ID Técnico</label>
                <input
                id="tecnico_id"
                type="number"
                required
                value={formData.tecnico_id}
                onChange={(e) => setFormData({ ...formData, tecnico_id: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="fecha_recibido">Fecha Recibido</label>
                <input
                id="fecha_recibido"
                type="date"
                required
                value={formData.fecha_recibido}
                onChange={(e) => setFormData({ ...formData, fecha_recibido: e.target.value })}
                />
                </div>
                <div className="form__field">
                <label htmlFor="problema_reportado">Problema Reportado</label>
                <textarea
                id="problema_reportado"
                rows={4}
                required
                value={formData.problema_reportado}
                onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
                />
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
                <button type="submit" className="btn btn--primary">
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
