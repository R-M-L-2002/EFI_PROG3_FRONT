"use client"

import { useEffect, useState } from "react"

import { exportToPDF } from "../utils/exportToPDF"
import { useAuth } from "../contexts/AuthContext"
import { useRepairOrders } from "../contexts/RepairOrdersContext"

export default function RepairOrders() {
  const { user } = useAuth()
  const { orders, loading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useRepairOrders()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    device_id: "",
    customer_id: "",
    problem_description: "",
    status: "pending",
  })

  useEffect(() => {
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
      setIsModalOpen(false)
      resetForm()
      fetchOrders()
    } catch (err) {
      console.error("Error saving order:", err)
    }
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setFormData({
      device_id: order.device_id,
      customer_id: order.customer_id,
      problem_description: order.problem_description,
      status: order.status,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta orden?")) {
      await deleteOrder(id)
      fetchOrders()
    }
  }

  const resetForm = () => {
    setFormData({ device_id: "", customer_id: "", problem_description: "", status: "pending" })
    setEditingOrder(null)
  }

  const handleExportPDF = () => {
    const data = orders.map((o) => ({
      id: o.id,
      customer: o.customer_name || "N/A",
      device: o.device_info || "N/A",
      status: o.status,
    }))
    exportToPDF(data, "Órdenes de Reparación", ["id", "customer", "device", "status"])
  }

  const isAdmin = user?.role === "admin"
  const canCreate = isAdmin || user?.role === "tecnico" || user?.role === "recepcionista"

  if (loading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Órdenes de Reparación</h1>
        <div className="flex gap-4">
          <button onClick={handleExportPDF} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Exportar PDF
          </button>
          {canCreate && (
            <button
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Nueva Orden
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Dispositivo</th>
              <th className="border p-2">Problema</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.customer_name || "N/A"}</td>
                <td className="border p-2">{order.device_info || "N/A"}</td>
                <td className="border p-2">{order.problem_description}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : order.status === "in_progress"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Editar
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingOrder ? "Editar Orden" : "Nueva Orden"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="ID del Dispositivo"
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="ID del Cliente"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Descripción del Problema"
                  value={formData.problem_description}
                  onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
