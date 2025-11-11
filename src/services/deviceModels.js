import api from "../config/axios"

export const deviceModelsService = {
    getAll: async (brandId = null) => {
        const params = brandId ? { brand_id: brandId } : {}
        const response = await api.get("/api/device-models", { params })
        return response.data
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/device-models/${id}`)
        return response.data
    },
}
