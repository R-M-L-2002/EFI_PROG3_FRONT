import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { usersService } from "../services/user"
import { useNavigate } from "react-router-dom"

export default function Profile() {
    const { user, logout } = useAuth()
    const nav = useNavigate()
    
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    useEffect(() => {
        if (user) {
        setFormData({
            name: user.name || "",
            email: user.email || "",
        })
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")
        setSuccessMsg("")

        try {
        await usersService.update(user.id, formData)
        
        // Update user in localStorage
        const updatedUser = { ...user, ...formData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        
        setSuccessMsg("Perfil actualizado correctamente")
        setIsEditing(false)
        
        // Reload page to update user context
        setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
        setErrorMsg(err.message || "Error al actualizar el perfil")
        } finally {
        setLoading(false)
        }
    }

    const getRoleName = (roleId) => {
        switch (roleId) {
        case 1:
            return "Administrador"
        case 2:
            return "Técnico"
        default:
            return "Cliente"
        }
    }

    if (!user) {
        return (
        <div className="site">
            <section className="section">
            <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
                <p>No hay usuario autenticado</p>
            </div>
            </section>
        </div>
        )
    }

    return (
        <div className="site">
        <section className="section">
            <div className="container" style={{ maxWidth: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 className="section__title" style={{ margin: 0 }}>Mi Perfil</h2>
                <button className="btn btn--ghost" onClick={() => nav(-1)}>
                Volver
                </button>
            </div>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div
                    style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: "600",
                    }}
                >
                    {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1.5rem" }}>{user.name}</h3>
                    <span
                    className="badge badge--info"
                    style={{ display: "inline-block" }}
                    >
                    {getRoleName(user.role_id)}
                    </span>
                </div>
                </div>

                {!isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "0.875rem", color: "var(--muted)" }}>
                        Correo Electrónico
                    </label>
                    <p style={{ margin: 0, fontSize: "1rem" }}>{user.email}</p>
                    </div>
                    
                    <div style={{ display: "flex", gap: "12px", marginTop: "1rem" }}>
                    <button className="btn btn--primary" onClick={() => setIsEditing(true)}>
                        Editar Perfil
                    </button>
                    <button className="btn btn--ghost" onClick={() => nav("/change-password")}>
                        Cambiar Contraseña
                    </button>
                    </div>
                </div>
                ) : (
                <form onSubmit={handleSubmit} className="form">
                    <div className="form__field">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    </div>

                    <div className="form__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
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
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => {
                        setIsEditing(false)
                        setFormData({ name: user.name, email: user.email })
                        setErrorMsg("")
                        }}
                    >
                        Cancelar
                    </button>
                    </div>
                </form>
                )}
            </div>

            <div className="card" style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5" }}>
                <h4 style={{ margin: "0 0 12px", color: "#dc2626" }}>Zona de Peligro</h4>
                <p style={{ margin: "0 0 16px", fontSize: "0.875rem", color: "#991b1b" }}>
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
                </p>
                <button
                className="btn btn--ghost"
                style={{ color: "#dc2626", borderColor: "#dc2626" }}
                onClick={() => {
                    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    logout()
                    nav("/")
                    }
                }}
                >
                Cerrar Cuenta
                </button>
            </div>
            </div>
        </section>
        </div>
    )
}
