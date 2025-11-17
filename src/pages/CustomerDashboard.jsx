import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { repairOrdersService } from "../services/repairOrders"
import CustomerLayout from "../components/CustomerLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import ErrorState from "../components/ErrorState"
import { exportToPDF } from "../utils/exportToPDF"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  useEffect(() => {
    fetchMyOrders()
  }, [user])
  
  const fetchMyOrders = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)
      // Fetch orders for this customer
      const response = await repairOrdersService.getAll()
      const orders = response?.data || response || []
      
      // Filter orders that belong to this customer
      const filtered = orders.filter((order) => order.customer_id === user.id)
      setMyOrders(filtered)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err.message || "Error al cargar las órdenes")
    } finally {
      setLoading(false)
    }
  }
  
  const handleExportAll = () => {
    if (!myOrders || myOrders.length === 0) return
    
    const data = myOrders.map((order) => ({
      "ID": `#${order.id}`,
      "Dispositivo": `${order.Device?.DeviceModel?.Brand?.name || "N/A"} ${order.Device?.DeviceModel?.name || ""}`,
      "Problema": order.problema_reportado?.substring(0, 50) || "N/A",
      "Estado": order.OrderStatus?.name || "Pendiente",
      "Fecha": order.fecha_recibido ? new Date(order.fecha_recibido).toLocaleDateString() : "N/A",
    }))
    
    exportToPDF(data, "Mis_Ordenes_de_Reparacion", ["ID", "Dispositivo", "Problema", "Estado", "Fecha"])
  }
  
  const getStatusColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case "pendiente":
      return "badge--warning"
      case "en proceso":
      case "en_proceso":
      return "badge--info"
      case "completado":
      case "completada":
      return "badge--success"
      case "cancelado":
      case "cancelada":
      return "badge--error"
      default:
      return "badge--info"
    }
  }
  
  return (
    <CustomerLayout>
    <div className="admin-header">
    <div>
    <h1 style={{ margin: "0 0 8px" }}>Mis Órdenes de Reparación</h1>
    <p style={{ margin: 0, color: "var(--muted)" }}>
    Bienvenido, {user?.name}
    </p>
    </div>
    {myOrders.length > 0 && (
      <button className="btn btn--ghost" onClick={handleExportAll}>
      Exportar Todas
      </button>
    )}
    </div>
    
    {/* Stats Card */}
    <div className="card" style={{ padding: "20px", marginBottom: "24px", textAlign: "center" }}>
    <div style={{ fontSize: "48px", fontWeight: "600", color: "#3b82f6", marginBottom: "8px" }}>
    {myOrders.length}
    </div>
    <div style={{ color: "var(--muted)", fontSize: "1rem" }}>Total de Órdenes de Reparación</div>
    </div>
    
    {loading ? (
      <LoadingSpinner message="Cargando tus órdenes..." />
    ) : error ? (
      <ErrorState message={error} onRetry={fetchMyOrders} />
    ) : myOrders.length === 0 ? (
      <EmptyState
      icon="📋"
      title="No tienes órdenes"
      description="Aún no has registrado ninguna orden de reparación"
      />
    ) : (
      <div className="table-wrapper">
      <table>
      <thead>
      <tr>
      <th>ID</th>
      <th>Dispositivo</th>
      <th>Problema Reportado</th>
      <th>Fecha Recibido</th>
      <th>Estado</th>
      <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      {myOrders.map((order) => (
        <tr key={order.id}>
        <td>#{order.id}</td>
        <td>
        <div style={{ fontWeight: "500" }}>
        {order.Device?.DeviceModel?.Brand?.name || "N/A"}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        {order.Device?.DeviceModel?.name || "N/A"}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
        S/N: {order.Device?.serial_number || "N/A"}
        </div>
        </td>
        <td>
        <div style={{ maxWidth: "300px" }}>
        {order.problema_reportado?.substring(0, 100) || "Sin descripción"}
        {order.problema_reportado?.length > 100 && "..."}
        </div>
        </td>
        <td>
        {order.fecha_recibido
          ? new Date(order.fecha_recibido).toLocaleDateString("es-AR")
          : "N/A"}
          </td>
          <td>
          <span className={`badge ${getStatusColor(order.OrderStatus?.name)}`}>
          {order.OrderStatus?.name || "Pendiente"}
          </span>
          </td>
          <td>
          <button
          className="btn btn--ghost"
          style={{ padding: "6px 12px", fontSize: "0.875rem" }}
          onClick={() => setSelectedOrder(order)}
          >
          Ver Detalles
          </button>
          </td>
          </tr>
        ))}
        </tbody>
        </table>
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <div className="modal-header">
        <h2>Detalles de la Orden #{selectedOrder.id}</h2>
        <button className="btn btn--ghost" onClick={() => setSelectedOrder(null)}>
        ✕
        </button>
        </div>
        <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Información del Dispositivo</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div>
        <strong>Marca:</strong> {selectedOrder.Device?.DeviceModel?.Brand?.name || "N/A"}
        </div>
        <div>
        <strong>Modelo:</strong> {selectedOrder.Device?.DeviceModel?.name || "N/A"}
        </div>
        <div>
        <strong>Número de Serie:</strong> {selectedOrder.Device?.serial_number || "N/A"}
        </div>
        </div>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Problema Reportado</h3>
        <p style={{ margin: 0, color: "var(--muted)" }}>
        {selectedOrder.problema_reportado || "Sin descripción"}
        </p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Estado</h3>
        <span className={`badge ${getStatusColor(selectedOrder.OrderStatus?.name)}`}>
        {selectedOrder.OrderStatus?.name || "Pendiente"}
        </span>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Fechas</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div>
        <strong>Fecha de Recepción:</strong>{" "}
        {selectedOrder.fecha_recibido
          ? new Date(selectedOrder.fecha_recibido).toLocaleDateString("es-AR")
          : "N/A"}
          </div>
          </div>
          </div>
          
          {selectedOrder.Tecnico && (
            <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "1.125rem" }}>Técnico Asignado</h3>
            <div>
            <strong>{selectedOrder.Tecnico.name}</strong>
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
            {selectedOrder.Tecnico.email}
            </div>
            </div>
          )}
          
          <button
          className="btn btn--primary"
          onClick={() => setSelectedOrder(null)}
          style={{ width: "100%" }}
          >
          Cerrar
          </button>
          </div>
          </div>
          </div>
        )}
        </CustomerLayout>
      )
    }
    