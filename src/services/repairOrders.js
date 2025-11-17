import api from "../config/axios"

export const repairOrdersService = {
    getAll: async () => {
        const response = await api.get("/api/repair-orders?include=customer,device,device.model,device.model.brand,technician,status")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/repair-orders/${id}?include=customer,device,device.model,device.model.brand,technician,status`)
        return response.data
    },
    
    getByCustomer: async (customerId) => {
        const response = await api.get(`/api/repair-orders/customer/${customerId}?include=customer,device,device.model,device.model.brand,technician,status`)
        return response.data
    },
    
    create: async (orderData) => {
        const response = await api.post("/api/repair-orders", orderData)
        return response.data
    },
    
    update: async (id, orderData) => {
        const response = await api.put(`/api/repair-orders/${id}`, orderData)
        return response.data
    },
    
    updateStatus: async (id, statusId) => {
        const response = await api.patch(`/api/repair-orders/${id}/status`, { status_id: statusId })
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/repair-orders/${id}`)
        return response.data
    },
}
