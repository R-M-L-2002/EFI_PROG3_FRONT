import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRepairOrders } from "../contexts/RepairOrdersContext"
import { useRepairs } from "../contexts/RepairsContext"
import TopNav from "../components/TopNav"
import AdminLayout from "../components/AdminLayout"

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const { orders, getOrders } = useRepairOrders()
  const { repairs, getRepairs } = useRepairs()
  const [myOrders, setMyOrders] = useState([])
  const [myRepairs, setMyRepairs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await getOrders()
      await getRepairs()
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orders && user) {
      const filtered = orders.filter(order => order.tecnico_id === user.id)
      setMyOrders(filtered)
    }
    if (repairs && user) {
      const filtered = repairs.filter(repair => repair.tecnico_id === user.id)
      setMyRepairs(filtered)
    }
  }, [orders, repairs, user])

  const pendingRepairs = myRepairs.filter(r => r.estado !== "Completada")
  const completedRepairs = myRepairs.filter(r => r.estado === "Completada")

  return (
    <AdminLayout>
      <TopNav title="Panel Técnico" user={user} />
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, {user?.nombre}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Órdenes Asignadas</p>
            <p className="text-3xl font-bold text-blue-600">{myOrders.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600">Reparaciones Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingRepairs.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Reparaciones Completadas</p>
            <p className="text-3xl font-bold text-green-600">{completedRepairs.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Órdenes Asignadas */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Órdenes Asignadas</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : myOrders.length === 0 ? (
              <p className="text-gray-500">No hay órdenes asignadas</p>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div
                    key={order.id}
                    className="border p-3 rounded-lg hover:shadow-md transition"
                  >
                    <p className="font-semibold">Orden #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.problema_reportado}</p>
                    <p className="text-xs text-gray-500">
                      Estado: <span className="font-semibold">{order.estado}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reparaciones Pendientes */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Reparaciones Pendientes</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : pendingRepairs.length === 0 ? (
              <p className="text-gray-500">No hay reparaciones pendientes</p>
            ) : (
              <div className="space-y-3">
                {pendingRepairs.map(repair => (
                  <div
                    key={repair.id}
                    className="border p-3 rounded-lg hover:shadow-md transition"
                  >
                    <p className="font-semibold">Reparación #{repair.id}</p>
                    <p className="text-sm text-gray-600">Orden #{repair.id_orden}</p>
                    <p className="text-xs text-gray-500">
                      Iniciada: {new Date(repair.fecha_inicio).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AdminLayout>
  )
}
