import api from "../config/axios"

export const devicesService = {
    getAll: async () => {
        const response = await api.get("/devices")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/devices/${id}`)
        return response.data
    },
    
    getWithHistory: async (id) => {
        const response = await api.get(`/devices/${id}/history`)
        return response.data
    },
    
    create: async (deviceData) => {
        const response = await api.post("/devices", deviceData)
        return response.data
    },
    
    update: async (id, deviceData) => {
        const response = await api.put(`/devices/${id}`, deviceData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/devices/${id}`)
        return response.data
    },
}
