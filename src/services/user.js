import api from "../config/axios"

export const usersService = {
    getAll: async () => {
        const response = await api.get("/api/users")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/users/${id}`)
        return response.data
    },
    
    create: async (userData) => {
        const response = await api.post("/api/users", userData)
        return response.data
    },
    
    update: async (id, userData) => {
        const response = await api.put(`/api/users/${id}`, userData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/users/${id}`)
        return response.data
    },
}
