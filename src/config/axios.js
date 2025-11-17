import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
})

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        
        console.log("[v0] API Error - Status:", status)
        console.log("[v0] API Error - Data:", error.response?.data)
        console.log("[v0] API Error - URL:", error.config?.url)
        
        switch (status) {
            case 401:
            // Unauthorized - clear auth and redirect to login
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
            break
            
            case 403:
            // Forbidden - redirect to access denied page
            window.location.href = "/403"
            break
            
            case 404:
            // Not Found - could redirect to 404 page or just show error in component
            console.error("Resource not found:", error.response?.data)
            break
            
            case 500:
            case 502:
            case 503:
            // Server Error - redirect to error page
            console.error("Server error:", error.response?.data)
            // window.location.href = "/500"
            break
            
            default:
            // Other errors - let component handle them
            console.error("API Error:", error.response?.data || error.message)
        }
        
        return Promise.reject(error)
    },
)

export default api
