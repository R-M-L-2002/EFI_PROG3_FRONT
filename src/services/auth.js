import api from "../config/axios"

export const authService = {
    register: async (userData) => {
        const response = await api.post("/api/auth/register", userData)
        return response.data
    },
    
    login: async (credentials) => {
        const response = await api.post("/api/auth/login", credentials)
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        return response.data
    },
    
    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    },
    
    forgotPassword: async (email) => {
        const response = await api.post("/api/auth/forgot-password", { email })
        return response.data
    },
    
    resetPassword: async (token, newPassword) => {
        const response = await api.post("/api/auth/reset-password", { token, password: newPassword })
        return response.data
    },
    
    getCurrentUser: () => {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    },
    
    getToken: () => {
        return localStorage.getItem("token")
    },
}
