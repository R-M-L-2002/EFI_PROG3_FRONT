import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../config/axios"

export default function ChangePassword() {
    const nav = useNavigate()
    const { user } = useAuth()
    
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [errors, setErrors] = useState({})
    
    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.currentPassword) {
            newErrors.currentPassword = "La contraseña actual es requerida"
        }
        
        if (!formData.newPassword) {
            newErrors.newPassword = "La nueva contraseña es requerida"
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres"
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden"
        }
        
        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setLoading(true)
        setErrorMsg("")
        setSuccessMsg("")
        
        try {
            await api.put(`/api/users/${user.id}/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            })
            
            setSuccessMsg("Contraseña actualizada correctamente")
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            
            setTimeout(() => nav("/profile"), 2000)
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Error al cambiar la contraseña")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="site">
        <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 className="section__title" style={{ margin: 0 }}>Cambiar Contraseña</h2>
        <button className="btn btn--ghost" onClick={() => nav("/profile")}>
        Volver
        </button>
        </div>
        
        <form className="form" onSubmit={handleSubmit}>
        <div className="form__field">
        <label htmlFor="currentPassword">Contraseña Actual *</label>
        <input
        id="currentPassword"
        type="password"
        required
        placeholder="********"
        value={formData.currentPassword}
        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        style={{ borderColor: errors.currentPassword ? "#ef4444" : undefined }}
        />
        {errors.currentPassword && (
            <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
            {errors.currentPassword}
            </span>
        )}
        </div>
        
        <div className="form__field">
        <label htmlFor="newPassword">Nueva Contraseña *</label>
        <input
        id="newPassword"
        type="password"
        required
        placeholder="********"
        value={formData.newPassword}
        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        style={{ borderColor: errors.newPassword ? "#ef4444" : undefined }}
        />
        {errors.newPassword && (
            <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
            {errors.newPassword}
            </span>
        )}
        <small style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
        Mínimo 6 caracteres
        </small>
        </div>
        
        <div className="form__field">
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</label>
        <input
        id="confirmPassword"
        type="password"
        required
        placeholder="********"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        style={{ borderColor: errors.confirmPassword ? "#ef4444" : undefined }}
        />
        {errors.confirmPassword && (
            <span style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "4px" }}>
            {errors.confirmPassword}
            </span>
        )}
        </div>
        
        {successMsg && (
            <div className="pill" style={{ backgroundColor: "#10b981", color: "white" }}>
            {successMsg}
            </div>
        )}
        
        {errorMsg && (
            <div className="pill" role="alert">
            {errorMsg}
            </div>
        )}
        
        <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Actualizando..." : "Cambiar Contraseña"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => nav("/profile")}>
        Cancelar
        </button>
        </div>
        </form>
        </div>
        </section>
        </div>
    )
}
