import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRepairOrders } from "../contexts/RepairOrdersContext"
import { useRepairs } from "../contexts/RepairsContext"
import TechnicianLayout from "../components/TechnicianLayout"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"
import { exportRepairDetailsToPDF } from "../utils/exportToPDF"

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const { orders, loading: ordersLoading, fetchOrders } = useRepairOrders()
  const { repairs, loading: repairsLoading, fetchRepairs, updateRepair } = useRepairs()
  const [myOrders, setMyOrders] = useState([])
  const [myRepairs, setMyRepairs] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  useEffect(() => {
    fetchOrders()
    fetchRepairs()
  }, [])
  
  useEffect(() => {
    if (orders && user) {
      // Filter orders assigned to this technician
      const filtered = orders.filter((order) => order.tecnico_id === user.id)
      setMyOrders(filtered)
    }
    if (repairs && user) {
      // Filter repairs for orders assigned to this technician
      const filtered = repairs.filter((repair) => {
        const order = orders?.find((o) => o.id === repair.order_id)
        return order?.tecnico_id === user.id
      })
      setMyRepairs(filtered)
    }
  }, [orders, repairs, user])
  
  const pendingRepairs = myRepairs.filter((r) => r.estado === "pendiente")
  const inProgressRepairs = myRepairs.filter((r) => r.estado === "en_progreso")
  const completedRepairs = myRepairs.filter((r) => r.estado === "completado")
  
  const handleUpdateStatus = async (repairId, newStatus) => {
    try {
      await updateRepair(repairId, { estado: newStatus })
      fetchRepairs()
    } catch (error) {
      console.error("Error updating repair status:", error)
    }
  }
  
  const loading = ordersLoading || repairsLoading
  
  return (
    <TechnicianLayout>
    <div className="admin-header">
    <div>
    <h1 style={{ margin: "0 0 8px" }}>Panel del Técnico</h1>
    <p style={{ margin: 0, color: "var(--muted)" }}>
    Bienvenido, {user?.name}
    </p>
    </div>
    </div>
    
    {/* Stats Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
    <div style={{ fontSize: "32px", fontWeight: "600", color: "#3b82f6", marginBottom: "8px" }}>
    {myOrders.length}
    </div>
    <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Órdenes Asignadas</div>
    </div>
    
    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
    <div style={{ fontSize: "32px", fontWeight: "600", color: "#f59e0b", marginBottom: "8px" }}>
    {pendingRepairs.length}
    </div>
    <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Pendientes</div>
    </div>
    
    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
    <div style={{ fontSize: "32px", fontWeight: "600", color: "#8b5cf6", marginBottom: "8px" }}>
    {inProgressRepairs.length}
    </div>
    <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>En Progreso</div>
    </div>
    
    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
    <div style={{ fontSize: "32px", fontWeight: "600", color: "#10b981", marginBottom: "8px" }}>
    {completedRepairs.length}
    </div>
    <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Completadas</div>
    </div>
    </div>
    
    {loading ? (
      <LoadingSpinner message="Cargando tus asignaciones..." />
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      {/* Mis Órdenes */}
      <div>
      <h2 style={{ margin: "0 0 16px", fontSize: "1.25rem" }}>Mis Órdenes Asignadas</h2>
      {myOrders.length === 0 ? (
        <EmptyState
        icon="📋"
        title="No hay órdenes"
        description="No tienes órdenes asignadas en este momento"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {myOrders.map((order) => (
          <div
          key={order.id}
          className="card"
          style={{
            padding: "16px",
            cursor: "pointer",
            border: selectedOrder?.id === order.id ? "2px solid var(--primary)" : undefined,
          }}
          onClick={() => setSelectedOrder(order)}
          >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ fontWeight: "600" }}>Orden #{order.id}</div>
          <span className="badge badge--info">{order.OrderStatus?.name || "Pendiente"}</span>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "8px" }}>
          <strong>Cliente:</strong> {order.Customer?.name || "N/A"}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "8px" }}>
          <strong>Dispositivo:</strong> {order.Device?.DeviceModel?.Brand?.name}{" "}
          {order.Device?.DeviceModel?.name || "N/A"}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
          <strong>Problema:</strong> {order.problema_reportado?.substring(0, 80)}...
          </div>
          </div>
        ))}
        </div>
      )}
      </div>
      
      {/* Mis Reparaciones */}
      <div>
      <h2 style={{ margin: "0 0 16px", fontSize: "1.25rem" }}>Mis Reparaciones</h2>
      {myRepairs.length === 0 ? (
        <EmptyState
        icon="🔧"
        title="No hay reparaciones"
        description="No tienes tareas de reparación asignadas"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {myRepairs.map((repair) => (
          <div key={repair.id} className="card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ fontWeight: "600" }}>{repair.titulo}</div>
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
          </span>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "8px" }}>
          <strong>Orden:</strong> #{repair.order_id}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "12px" }}>
          {repair.descripcion?.substring(0, 100)}...
          </div>
          
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {repair.estado === "pendiente" && (
            <button
            className="btn btn--ghost"
            style={{ padding: "4px 12px", fontSize: "0.875rem" }}
            onClick={() => handleUpdateStatus(repair.id, "en_progreso")}
            >
            Iniciar
            </button>
          )}
          {repair.estado === "en_progreso" && (
            <button
            className="btn btn--ghost"
            style={{ padding: "4px 12px", fontSize: "0.875rem" }}
            onClick={() => handleUpdateStatus(repair.id, "completado")}
            >
            Completar
            </button>
          )}
          <button
          className="btn btn--ghost"
          style={{ padding: "4px 12px", fontSize: "0.875rem" }}
          onClick={() => exportRepairDetailsToPDF(repair)}
          >
          PDF
          </button>
          </div>
          </div>
        ))}
        </div>
      )}
      </div>
      </div>
    )}
    </TechnicianLayout>
  )
}
