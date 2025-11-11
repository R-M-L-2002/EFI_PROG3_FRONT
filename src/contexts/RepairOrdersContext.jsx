"use client"

import { createContext, useContext, useState } from "react"

import { repairOrdersService } from "../services/repairOrders"

const RepairOrdersContext = createContext()

export const RepairOrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.getAll()
            setOrders(data)
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar órdenes")
        } finally {
            setLoading(false)
        }
    }
    
    const getOrder = async (id) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.getById(id)
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar orden")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const getOrdersByCustomer = async (customerId) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.getByCustomer(customerId)
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar órdenes del cliente")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const createOrder = async (orderData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.create(orderData)
            setOrders([...orders, data])
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al crear orden")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const updateOrder = async (id, orderData) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.update(id, orderData)
            await fetchOrders()
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar orden")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const updateOrderStatus = async (id, statusId) => {
        setLoading(true)
        setError(null)
        try {
            const data = await repairOrdersService.updateStatus(id, statusId)
            setOrders(orders.map((order) => (order.id === id ? data : order)))
            return data
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar estado")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const deleteOrder = async (id) => {
        setLoading(true)
        setError(null)
        try {
            await repairOrdersService.delete(id)
            setOrders(orders.filter((order) => order.id !== id))
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar orden")
            throw err
        } finally {
            setLoading(false)
        }
    }
    
    const value = {
        orders,
        loading,
        error,
        fetchOrders,
        getOrder,
        getOrdersByCustomer,
        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
    }
    
    return <RepairOrdersContext.Provider value={value}>{children}</RepairOrdersContext.Provider>
}

export const useRepairOrders = () => {
    const context = useContext(RepairOrdersContext)
    if (!context) {
        throw new Error("useRepairOrders must be used within RepairOrdersProvider")
    }
    return context
}
