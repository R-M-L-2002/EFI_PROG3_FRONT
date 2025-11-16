import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRepairOrders } from "../contexts/RepairOrdersContext"
import AdminLayout from "../components/AdminLayout"
import { exportToPDF } from "../utils/exportToPDF"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { orders, getOrders } = useRepairOrders()
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await getOrders()
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orders && user) {
      const filtered = orders.filter(order => order.id_cliente === user.id)
      setMyOrders(filtered)
    }
  }, [orders, user])

  const statusColors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    "En proceso": "bg-blue-100 text-blue-800",
    Completada: "bg-green-100 text-green-800",
    Cancelada: "bg-red-100 text-red-800",
  }

  const handleDownloadPDF = (order) => {
    exportToPDF(order, "orden-reparacion")
  }

  return (
    <AdminLayout>
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mis Órdenes de Reparación</h1>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <p className="text-sm text-gray-600">Total de Órdenes</p>
          <p className="text-3xl font-bold text-blue-600">{myOrders.length}</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando órdenes...</p>
        ) : myOrders.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border">
            <p className="text-gray-500">No tienes órdenes de reparación</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Dispositivo</th>
                  <th className="border p-3 text-left">Problema</th>
                  <th className="border p-3 text-left">Fecha</th>
                  <th className="border p-3 text-left">Estado</th>
                  <th className="border p-3 text-left">Costo</th>
                  <th className="border p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border p-3">#{order.id}</td>
                    <td className="border p-3">{order.Device?.marca || "N/A"}</td>
                    <td className="border p-3 text-sm">{order.problema_reportado}</td>
                    <td className="border p-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.estado] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </td>
                    <td className="border p-3">${order.costo_estimado}</td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDownloadPDF(order)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}
