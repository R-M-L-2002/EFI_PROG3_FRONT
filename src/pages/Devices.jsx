"use client"

import { useEffect, useState } from "react"

import { exportToPDF } from "../utils/exportToPDF"
import { useAuth } from "../contexts/AuthContext"
import { useDevices } from "../contexts/DevicesContext"

export default function Devices() {
    const { user } = useAuth()
    const { devices, loading, error, fetchDevices, createDevice, updateDevice, deleteDevice } = useDevices()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDevice, setEditingDevice] = useState(null)
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        serial_number: "",
        device_type: "",
    })
    
    useEffect(() => {
        fetchDevices()
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingDevice) {
                await updateDevice(editingDevice.id, formData)
            } else {
                await createDevice(formData)
            }
            setIsModalOpen(false)
            resetForm()
            fetchDevices()
        } catch (err) {
            console.error("Error saving device:", err)
        }
    }
    
    const handleEdit = (device) => {
        setEditingDevice(device)
        setFormData({
            brand: device.brand,
            model: device.model,
            serial_number: device.serial_number,
            device_type: device.device_type,
        })
        setIsModalOpen(true)
    }
    
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este dispositivo?")) {
            await deleteDevice(id)
            fetchDevices()
        }
    }
    
    const resetForm = () => {
        setFormData({ brand: "", model: "", serial_number: "", device_type: "" })
        setEditingDevice(null)
    }
    
    const handleExportPDF = () => {
        const data = devices.map((d) => ({
            brand: d.brand,
            model: d.model,
            serial: d.serial_number,
            type: d.device_type,
        }))
        exportToPDF(data, "Dispositivos", ["brand", "model", "serial", "type"])
    }
    
    const isAdmin = user?.role === "admin"
    
    if (loading) return <div className="p-8">Cargando...</div>
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>
    
    return (
        <div className="p-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dispositivos</h1>
        <div className="flex gap-4">
        <button onClick={handleExportPDF} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Exportar PDF
        </button>
        {isAdmin && (
            <button
            onClick={() => {
                resetForm()
                setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Nuevo Dispositivo
            </button>
        )}
        </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
            <div key={device.id} className="border rounded-lg p-4 shadow">
            <h3 className="font-bold text-xl">
            {device.brand} {device.model}
            </h3>
            <p className="text-gray-600">S/N: {device.serial_number}</p>
            <p className="text-gray-600">Tipo: {device.device_type}</p>
            {isAdmin && (
                <div className="flex gap-2 mt-4">
                <button
                onClick={() => handleEdit(device)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                Editar
                </button>
                <button
                onClick={() => handleDelete(device.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                Eliminar
                </button>
                </div>
            )}
            </div>
        ))}
        </div>
        
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingDevice ? "Editar Dispositivo" : "Nuevo Dispositivo"}</h2>
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
            <input
            type="text"
            placeholder="Marca"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            />
            <input
            type="text"
            placeholder="Modelo"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            />
            <input
            type="text"
            placeholder="Número de Serie"
            value={formData.serial_number}
            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
            />
            <input
            type="text"
            placeholder="Tipo de Dispositivo"
            value={formData.device_type}
            onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
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
