"use client"

import { useEffect, useState } from "react"

import AdminLayout from "../components/AdminLayout"
import { brandsService } from "../services/brands"
import { deviceModelsService } from "../services/deviceModels"
import { exportToPDF } from "../utils/exportToPDF"
import { useDevices } from "../contexts/DevicesContext"

export default function Devices() {
    const { devices, loading, error, fetchDevices, createDevice, updateDevice, deleteDevice } = useDevices()
    const [showModal, setShowModal] = useState(false)
    const [editingDevice, setEditingDevice] = useState(null)
    const [formData, setFormData] = useState({
        brand_id: "",
        device_model_id: "",
        serial_number: "",
        physical_state: "pendiente",
    })
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    
    useEffect(() => {
        console.log("[v0] Devices page mounted, fetching devices")
        fetchDevices()
        loadBrands()
    }, [])
    
    const loadBrands = async () => {
        try {
            const brandsData = await brandsService.getAll()
            setBrands(brandsData)
        } catch (err) {
            console.error("Error loading brands:", err)
        }
    }
    
    const loadModels = async (brandId) => {
        try {
            const modelsData = await deviceModelsService.getAll(brandId)
            setModels(modelsData)
        } catch (err) {
            console.error("Error loading models:", err)
        }
    }
    
    const handleBrandChange = (e) => {
        const brandId = e.target.value
        setFormData({ ...formData, brand_id: brandId, device_model_id: "" })
        if (brandId) {
            loadModels(brandId)
        } else {
            setModels([])
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log("[v0] Submitting device data:", formData)
            if (editingDevice) {
                await updateDevice(editingDevice.id, formData)
            } else {
                await createDevice(formData)
            }
            handleCloseModal()
            fetchDevices()
        } catch (err) {
            console.error("[v0] Error submitting device:", err)
        }
    }
    
    const handleEdit = async (device) => {
        setEditingDevice(device)
        
        const brandId = device.brand_id || device.DeviceModel?.brand_id || ""
        
        console.log("[v0] Editing device:", device)
        console.log("[v0] Brand ID:", brandId)
        
        setFormData({
            brand_id: brandId,
            device_model_id: device.device_model_id || "",
            serial_number: device.serial_number || "",
            physical_state: device.physical_state || "pendiente",
        })
        
        if (brandId) {
            await loadModels(brandId)
        }
        
        setShowModal(true)
    }
    
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este dispositivo?")) {
            await deleteDevice(id)
            fetchDevices()
        }
    }
    
    const handleExport = () => {
        if (!devices || !Array.isArray(devices)) return
        
        const data = devices.map((d) => ({
            ID: d.id,
            Marca: d.DeviceModel?.Brand?.name || "N/A",
            Modelo: d.DeviceModel?.name || "N/A",
            Serial: d.serial_number || "N/A",
            Estado: d.status || "Activo",
        }))
        exportToPDF(data, "Dispositivos", ["ID", "Marca", "Modelo", "Serial", "Estado"])
    }
    
    const handleCloseModal = () => {
        setShowModal(false)
        setEditingDevice(null)
        setFormData({
            brand_id: "",
            device_model_id: "",
            serial_number: "",
            physical_state: "pendiente",
        })
        setModels([])
    }
    
    return (
        <AdminLayout>
        <div className="admin-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
        <h1 style={{ margin: "0 0 8px" }}>Dispositivos</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>Gestiona los dispositivos del taller</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
        <button className="btn btn--ghost" onClick={handleExport}>
        Exportar PDF
        </button>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
        Nuevo Dispositivo
        </button>
        </div>
        </div>
        </div>
        
        {loading ? (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            Cargando dispositivos...
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
            <th>Marca</th>
            <th>Modelo</th>
            <th>Número de Serie</th>
            <th>Estado</th>
            <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {devices &&
                Array.isArray(devices) &&
                devices.map((device) => (
                    <tr key={device.id}>
                    <td>#{device.id}</td>
                    <td>{device.DeviceModel?.Brand?.name || "N/A"}</td>
                    <td>{device.DeviceModel?.name || "N/A"}</td>
                    <td>{device.serial_number || "N/A"}</td>
                    <td>
                    <span className="badge badge--success">{device.status || "Activo"}</span>
                    </td>
                    <td>
                    <button
                    className="btn btn--ghost"
                    style={{ padding: "6px 12px", marginRight: "8px" }}
                    onClick={() => handleEdit(device)}
                    >
                    Editar
                    </button>
                    <button
                    className="btn btn--ghost"
                    style={{ padding: "6px 12px" }}
                    onClick={() => handleDelete(device.id)}
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
                <h2>{editingDevice ? "Editar Dispositivo" : "Nuevo Dispositivo"}</h2>
                <button className="btn btn--ghost" onClick={handleCloseModal}>
                ✕
                </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                <div className="form__field">
                <label htmlFor="brand_id">Marca</label>
                <select id="brand_id" value={formData.brand_id} onChange={handleBrandChange} required>
                <option value="">Selecciona una marca</option>
                {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                    {brand.name}
                    </option>
                ))}
                </select>
                </div>
                <div className="form__field">
                <label htmlFor="device_model_id">Modelo</label>
                <select
                id="device_model_id"
                value={formData.device_model_id}
                onChange={(e) => setFormData({ ...formData, device_model_id: e.target.value })}
                required
                disabled={!formData.brand_id}
                >
                <option value="">Selecciona un modelo</option>
                {models.map((model) => (
                    <option key={model.id} value={model.id}>
                    {model.name}
                    </option>
                ))}
                </select>
                </div>
                <div className="form__field">
                <label htmlFor="serial_number">Número de Serie</label>
                <input
                id="serial_number"
                type="text"
                required
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                />
                </div>
                <div className="form__actions">
                <button type="submit" className="btn btn--primary">
                {editingDevice ? "Actualizar" : "Crear"}
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
    