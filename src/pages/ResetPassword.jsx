import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import TopNav from "../components/TopNav"

export default function ResetPassword() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const token = searchParams.get("token")
  const id = searchParams.get("id")

  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (!token || !id) {
      setErrMsg("Token inválido o expirado. El enlace podría no ser válido o ha caducado.")
    }
  }, [token, id])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrMsg("")
    setSuccessMsg("")

    if (form.password !== form.confirmPassword) {
      setErrMsg("Las contraseñas no coinciden")
      return
    }

    if (form.password.length < 6) {
      setErrMsg("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(id),
          token,
          password: form.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al restablecer contraseña")
      }

      setSuccessMsg("Contraseña actualizada exitosamente. Redirigiendo a inicio de sesión...")
      setForm({ password: "", confirmPassword: "" })

      setTimeout(() => {
        nav("/login")
      }, 2000)
    } catch (e2) {
      setErrMsg(e2.message || "Error al restablecer contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !id) {
    return (
      <div className="site">
        <TopNav isLogged={!!user} user={user} onLogout={() => {}} />
        <section className="section">
          <div className="container" style={{ maxWidth: 520 }}>
            <div className="pill" role="alert" style={{ backgroundColor: "#fee", color: "#c33" }}>
              {errMsg || "Token inválido o no proporcionado"}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="site">
      <TopNav isLogged={!!user} user={user} onLogout={() => {}} />
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Restablecer contraseña</h2>
          <p style={{ marginBottom: "1.5rem", color: "#666", textAlign: "center" }}>Ingresa tu nueva contraseña.</p>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
              />
            </div>

            <div className="form__field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={onChange}
              />
            </div>

            {errMsg && (
              <div className="pill" role="alert" style={{ backgroundColor: "#fee", color: "#c33" }}>
                {errMsg}
              </div>
            )}
            {successMsg && (
              <div className="pill" role="alert" style={{ backgroundColor: "#efe", color: "#3c3" }}>
                {successMsg}
              </div>
            )}

            <div className="form__actions">
              <button className="btn btn--primary" disabled={isLoading}>
                {isLoading ? "Actualizando…" : "Actualizar contraseña"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
