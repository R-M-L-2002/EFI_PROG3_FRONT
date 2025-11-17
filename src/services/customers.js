import api from "../config/axios"

export const customersService = {
    getAll: async () => {
        const response = await api.get("/api/customers")
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/customers/${id}`)
        return response.data
    },
    
    create: async (customerData) => {
        const response = await api.post("/api/customers", customerData)
        return response.data
    },
    
    update: async (id, customerData) => {
        const response = await api.put(`/api/customers/${id}`, customerData)
        return response.data
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/customers/${id}`)
        return response.data
    },
}
