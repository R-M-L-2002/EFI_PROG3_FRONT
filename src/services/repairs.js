import api from "../config/axios"

export const repairsService = {
    getAll: async () => {
        const response = await api.get("/repair-tasks")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/repair-tasks/${id}`)
        return response.data
    },
    
    create: async (repairData) => {
        const response = await api.post("/repair-tasks", repairData)
        return response.data
    },
    
    update: async (id, repairData) => {
        const response = await api.put(`/repair-tasks/${id}`, repairData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/repair-tasks/${id}`)
        return response.data
    },
}
