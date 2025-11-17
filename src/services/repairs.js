import api from "../config/axios"

export const repairsService = {
    getAll: async () => {
        const response = await api.get("/api/repair-tasks?include=order,order.device,order.device.model,order.device.model.brand,order.customer,order.technician")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/repair-tasks/${id}?include=order,order.device,order.device.model,order.device.model.brand,order.customer,order.technician`)
        return response.data
    },
    
    create: async (repairData) => {
        const response = await api.post("/api/repair-tasks", repairData)
        return response.data
    },
    
    update: async (id, repairData) => {
        const response = await api.put(`/api/repair-tasks/${id}`, repairData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/repair-tasks/${id}`)
        return response.data
    },
}
