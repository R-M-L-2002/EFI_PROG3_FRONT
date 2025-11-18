"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import { exportToPDF } from "../utils/exportToPDF"
import { useRepairOrders } from "../contexts/RepairOrdersContext"
import { customersService } from "../services/customers"
import { devicesService } from "../services/devices"
import { usersService } from "../services/user"

import { FaEdit, FaTrash } from "react-icons/fa"

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
    
    const [customers, setCustomers] = useState([])
    const [devices, setDevices] = useState([])
    const [technicians, setTechnicians] = useState([])
    const [loadingData, setLoadingData] = useState(false)
    
    useEffect(() => {
        console.log("Orders page mounted, fetching orders")
        fetchOrders()
    }, [])
    
    useEffect(() => {
        if (showModal) {
            console.log("Modal opened, fetching dropdown data")
            fetchDropdownData()
        }
    }, [showModal])
    
    const fetchDropdownData = async () => {
        console.log("Starting fetchDropdownData")
        setLoadingData(true)
        try {
            console.log("Fetching customers...")
            const customersData = await customersService.getAll()
            console.log("Customers fetched:", customersData)
            setCustomers(customersData)
            
            console.log("Fetching devices...")
            const devicesData = await devicesService.getAll()
            console.log("Devices fetched:", devicesData)
            setDevices(devicesData)
            
            console.log("Fetching users...")
            const usersData = await usersService.getAll()
            console.log("Users fetched:", usersData)
            // Filtra usando el objeto 'role' anidado
            const techList = usersData.filter(user => user.role && user.role.code === "tecnico")           
            setTechnicians(techList)
            
            console.log("All dropdown data fetched successfully")
        } catch (err) {
            console.error("Error fetching dropdown data:", err)
            console.error("Error details:", err.response?.data)
            alert(`Error cargando datos: ${err.response?.data?.message || err.message}`)
        } finally {
            setLoadingData(false)
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("Submitting order form:", formData)

        // Clonamos para no mutar formData directo
        const payload = { ...formData }

        // Si es una orden NUEVA y no hay fecha, setea el día actual
        if (!editingOrder && !payload.fecha_recibido) {
            const today = new Date().toISOString().split("T")[0] // yyyy-mm-dd
            payload.fecha_recibido = today
        }

        // Validación usando payload (ya con fecha seteada)
        if (!payload.customer_id || !payload.device_id || !payload.tecnico_id) {
            alert("Por favor completa todos los campos obligatorios")
            return
        }

        try {
            if (editingOrder) {
                console.log("Updating order:", editingOrder.id)
                const result = await updateOrder(editingOrder.id, payload)
                console.log("Update result:", result)
            } else {
                console.log("Creating new order")
                const result = await createOrder(payload)
                console.log("Create result:", result)
            }
            handleCloseModal()
            await fetchOrders()
            console.log("Order operation completed successfully")
        } catch (err) {
            console.error("Error submitting order:", err)
            console.error("Error response:", err.response)
            console.error("Error status:", err.response?.status)
            console.error("Error data:", err.response?.data)
            alert(`Error: ${err.response?.data?.message || err.response?.data?.error || err.message}`)
        }
    }
    
    const handleEdit = async (order) => {
        console.log("Edit button clicked for order:", order)
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

    const getStatusLabel = (order) => {
        if (order.OrderStatus?.name) return order.OrderStatus.name

        switch (order.estado_id) {
            case 2:
            return "En Progreso"
            case 3:
            return "Completado"
            default:
            return "Pendiente"
        }
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
                                            <span
                                                className={`
                                                    badge
                                                    ${order.estado_id === 3 ? "badge--success" : ""}
                                                    ${order.estado_id === 2 ? "badge--info" : ""}
                                                    ${order.estado_id === 1 ? "badge--warning" : ""}
                                                `}
                                            >
                                                {getStatusLabel(order)}
                                            </span>
                                        </td>
                                        <td>{order.fecha_recibido ? new Date(order.fecha_recibido).toLocaleDateString() : "N/A"}</td>
                                        <td>
                                            <button
                                                className="btn btn--ghost"
                                                style={{ padding: "6px 12px", marginRight: "8px" }}
                                                onClick={() => handleEdit(order)}
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                className="btn btn--ghost"
                                                style={{ padding: "6px 12px" }}
                                                onClick={() => handleDelete(order.id)}
                                            >
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
                            <h2>{editingOrder ? "Editar Orden" : "Nueva Orden"}</h2>
                            <button className="btn btn--ghost" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>
                        
                        {loadingData ? (
                            <div style={{ padding: "40px", textAlign: "center" }}>
                                Cargando datos...
                            </div>
                        ) : (
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form__field">
                                    <label htmlFor="customer_id">Cliente</label>
                                    <select
                                        id="customer_id"
                                        required
                                        value={formData.customer_id}
                                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar cliente...</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} - {customer.email}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                                        {customers.length} clientes disponibles
                                    </small>
                                </div>
                                <div className="form__field">
                                    <label htmlFor="device_id">Dispositivo</label>
                                    <select
                                        id="device_id"
                                        required
                                        value={formData.device_id}
                                        onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar dispositivo...</option>
                                        {devices.map((device) => (
                                            <option key={device.id} value={device.id}>
                                                {device.DeviceModel?.name || "Sin modelo"} - {device.serial_number}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                                        {devices.length} dispositivos disponibles
                                    </small>
                                </div>
                                <div className="form__field">
                                    <label htmlFor="tecnico_id">Técnico</label>
                                    <select
                                        id="tecnico_id"
                                        required
                                        value={formData.tecnico_id}
                                        onChange={(e) => setFormData({ ...formData, tecnico_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar técnico...</option>
                                        {technicians.map((tech) => (
                                            <option key={tech.id} value={tech.id}>
                                                {tech.name} - {tech.email}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                                        {technicians.length} técnicos disponibles
                                    </small>
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
                                        <option value="2">En Progreso</option>
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
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
