import api from "../config/axios"

export const devicesService = {
    getAll: async () => {
        const response = await api.get("/api/devices")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/devices/${id}`)
        return response.data
    },
    
    getWithHistory: async (id) => {
        const response = await api.get(`/api/devices/${id}/history`)
        return response.data
    },
    
    create: async (deviceData) => {
        const response = await api.post("/api/devices", deviceData)
        return response.data
    },
    
    update: async (id, deviceData) => {
        const response = await api.put(`/api/devices/${id}`, deviceData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/devices/${id}`)
        return response.data
    },
}
