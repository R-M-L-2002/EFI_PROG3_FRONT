"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import { exportToPDF } from "../utils/exportToPDF"
import { useRepairOrders } from "../contexts/RepairOrdersContext"

export default function Orders() {
    const { repairOrders, loading, error, fetchRepairOrders, createRepairOrder, updateRepairOrder, deleteRepairOrder } =
    useRepairOrders()
    const [showModal, setShowModal] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const [formData, setFormData] = useState({
        customer_id: "",
        device_id: "",
        descripcion_problema: "",
        estado_id: 1,
    })
    
    useEffect(() => {
        fetchRepairOrders()
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingOrder) {
                await updateRepairOrder(editingOrder.id, formData)
            } else {
                await createRepairOrder(formData)
            }
            setShowModal(false)
            setEditingOrder(null)
            setFormData({ customer_id: "", device_id: "", descripcion_problema: "", estado_id: 1 })
            fetchRepairOrders()
        } catch (err) {
            console.error(err)
        }
    }
    
    const handleEdit = (order) => {
        setEditingOrder(order)
        setFormData({
            customer_id: order.customer_id,
            device_id: order.device_id,
            descripcion_problema: order.descripcion_problema,
            estado_id: order.estado_id,
        })
        setShowModal(true)
    }
    
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta orden?")) {
            await deleteRepairOrder(id)
            fetchRepairOrders()
        }
    }
    
    const handleExport = () => {
        if (!repairOrders || !Array.isArray(repairOrders)) return
        
        const data = repairOrders.map((o) => ({
            ID: o.id,
            Cliente: o.Customer?.name || "N/A",
            Dispositivo: o.Device?.DeviceModel?.name || "N/A",
            Estado: o.OrderStatus?.name || "N/A",
            Fecha: new Date(o.created_at).toLocaleDateString(),
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
            <th>Fecha</th>
            <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {repairOrders &&
                Array.isArray(repairOrders) &&
                repairOrders.map((order) => (
                    <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.Customer?.name || "N/A"}</td>
                    <td>{order.Device?.DeviceModel?.name || "N/A"}</td>
                    <td>{order.descripcion_problema?.substring(0, 50) || "Sin descripción"}...</td>
                    <td>
                    <span className="badge badge--info">{order.OrderStatus?.name || "Pendiente"}</span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
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
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                <h2>{editingOrder ? "Editar Orden" : "Nueva Orden"}</h2>
                <button className="btn btn--ghost" onClick={() => setShowModal(false)}>
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
                <label htmlFor="descripcion_problema">Descripción del Problema</label>
                <textarea
                id="descripcion_problema"
                rows={4}
                required
                value={formData.descripcion_problema}
                onChange={(e) => setFormData({ ...formData, descripcion_problema: e.target.value })}
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
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>
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
    