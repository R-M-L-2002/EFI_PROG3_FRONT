import api from "../config/axios"

export const brandsService = {
  getAll: async () => {
    const response = await api.get("/api/brands")
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/brands/${id}`)
    return response.data
  },
}
