"use client"

import { useEffect, useState } from "react"

import { exportToPDF } from "../utils/exportToPDF"
import { useAuth } from "../context/AuthContext"
import { useRepairs } from "../context/RepairsContext"

export default function Repairs() {
    const { user } = useAuth()
    const { repairs, loading, error, fetchRepairs, createRepair, updateRepair } = useRepairs()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRepair, setEditingRepair] = useState(null)
    const [formData, setFormData] = useState({
        repair_order_id: "",
        task_description: "",
        status: "pending",
        cost: "",
    })
    
    useEffect(() => {
        fetchRepairs()
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingRepair) {
                await updateRepair(editingRepair.id, formData)
            } else {
                await createRepair(formData)
            }
            setIsModalOpen(false)
            resetForm()
            fetchRepairs()
        } catch (err) {
            console.error("Error saving repair:", err)
        }
    }
    
    const handleEdit = (repair) => {
        setEditingRepair(repair)
        setFormData({
            repair_order_id: repair.repair_order_id,
            task_description: repair.task_description,
            status: repair.status,
            cost: repair.cost,
        })
        setIsModalOpen(true)
    }
    
    const resetForm = () => {
        setFormData({ repair_order_id: "", task_description: "", status: "pending", cost: "" })
        setEditingRepair(null)
    }
    
    const handleExportPDF = () => {
        const data = repairs.map((r) => ({
            id: r.id,
            order: r.repair_order_id,
            task: r.task_description,
            status: r.status,
            cost: r.cost,
        }))
        exportToPDF(data, "Reparaciones", ["id", "order", "task", "status", "cost"])
    }
    
    const isTecnico = user?.role === "tecnico" || user?.role === "admin"
    
    if (loading) return <div className="p-8">Cargando...</div>
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>
    
    return (
        <div className="p-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reparaciones</h1>
        <div className="flex gap-4">
        <button onClick={handleExportPDF} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Exportar PDF
        </button>
        {isTecnico && (
            <button
            onClick={() => {
                resetForm()
                setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Nueva Reparación
            </button>
        )}
        </div>
        </div>
        
        <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
        <thead>
        <tr className="bg-gray-100">
        <th className="border p-2">ID</th>
        <th className="border p-2">Orden</th>
        <th className="border p-2">Tarea</th>
        <th className="border p-2">Estado</th>
        <th className="border p-2">Costo</th>
        <th className="border p-2">Acciones</th>
        </tr>
        </thead>
        <tbody>
        {repairs.map((repair) => (
            <tr key={repair.id}>
            <td className="border p-2">{repair.id}</td>
            <td className="border p-2">{repair.repair_order_id}</td>
            <td className="border p-2">{repair.task_description}</td>
            <td className="border p-2">
            <span
            className={`px-2 py-1 rounded text-sm ${
                repair.status === "completed"
                ? "bg-green-200 text-green-800"
                : repair.status === "in_progress"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-gray-200 text-gray-800"
            }`}
            >
            {repair.status}
            </span>
            </td>
            <td className="border p-2">${repair.cost}</td>
            <td className="border p-2">
            {isTecnico && (
                <button
                onClick={() => handleEdit(repair)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                Editar
                </button>
            )}
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingRepair ? "Editar Reparación" : "Nueva Reparación"}</h2>
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
            <input
            type="number"
            placeholder="ID de la Orden"
            value={formData.repair_order_id}
            onChange={(e) => setFormData({ ...formData, repair_order_id: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            />
            <textarea
            placeholder="Descripción de la Tarea"
            value={formData.task_description}
            onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
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
            </select>
            <input
            type="number"
            step="0.01"
            placeholder="Costo"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            />
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
