"use client"

import { createContext, useContext, useState } from "react"

import { devicesService } from "../services/devices"

const DevicesContext = createContext()

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const fetchDevices = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await devicesService.getAll()
            setDevices(data)
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar dispositivos")
        } finally {
            setLoading(false)
        }
    }
    
    const getDevice = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const data = await devicesService.getById(id)
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar dispositivo")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const createDevice = async (deviceData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await devicesService.create(deviceData)
            setDevices([...devices, data])
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al crear dispositivo")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const updateDevice = async (id, deviceData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await devicesService.update(id, deviceData)
            setDevices(devices.map((dev) => (dev.id === id ? data : dev)))
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar dispositivo")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const deleteDevice = async (id) => {
        setLoading(true)
        setError(null)
        try {
            await devicesService.delete(id)
            setDevices(devices.filter((dev) => dev.id !== id))
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar dispositivo")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const value = {
        devices,
        loading,
        error,
        fetchDevices,
        getDevice,
        createDevice,
        updateDevice,
        deleteDevice,
    }
    
    return <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
}

export const useDevices = () => {
    const context = useContext(DevicesContext)
    if (!context) {
        throw new Error("useDevices must be used within DevicesProvider")
    }
    return context
}
