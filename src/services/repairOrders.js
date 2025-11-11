import api from "../config/axios"

export const repairOrdersService = {
    getAll: async () => {
        const response = await api.get("/repair-orders")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/repair-orders/${id}`)
        return response.data
    },
    
    getByCustomer: async (customerId) => {
        const response = await api.get(`/repair-orders/customer/${customerId}`)
        return response.data
    },
    
    create: async (orderData) => {
        const response = await api.post("/repair-orders", orderData)
        return response.data
    },
    
    update: async (id, orderData) => {
        const response = await api.put(`/repair-orders/${id}`, orderData)
        return response.data
    },
    
    updateStatus: async (id, statusId) => {
        const response = await api.patch(`/repair-orders/${id}/status`, { status_id: statusId })
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/repair-orders/${id}`)
        return response.data
    },
}
