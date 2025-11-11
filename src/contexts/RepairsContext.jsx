"use client"

import { createContext, useContext, useState } from "react"

import { repairsService } from "../services/repairs"

const RepairsContext = createContext()

export const RepairsProvider = ({ children }) => {
    const [repairs, setRepairs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const fetchRepairs = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairsService.getAll()
            setRepairs(data)
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar reparaciones")
        } finally {
            setLoading(false)
        }
    }
    
    const getRepair = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairsService.getById(id)
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar reparación")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const createRepair = async (repairData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairsService.create(repairData)
            setRepairs([...repairs, data])
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al crear reparación")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const updateRepair = async (id, repairData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairsService.update(id, repairData)
            setRepairs(repairs.map((repair) => (repair.id === id ? data : repair)))
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar reparación")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const deleteRepair = async (id) => {
        setLoading(true)
        setError(null)
        try {
            await repairsService.delete(id)
            setRepairs(repairs.filter((repair) => repair.id !== id))
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar reparación")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const value = {
        repairs,
        loading,
        error,
        fetchRepairs,
        getRepair,
        createRepair,
        updateRepair,
        deleteRepair,
    }
    
    return <RepairsContext.Provider value={value}>{children}</RepairsContext.Provider>
}

export const useRepairs = () => {
    const context = useContext(RepairsContext)
    if (!context) {
        throw new Error("useRepairs must be used within RepairsProvider")
    }
    return context
}
