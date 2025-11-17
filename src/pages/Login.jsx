import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {
  const nav = useNavigate()
  const location = useLocation()
  const { login, user, loading } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")

    try {
      const result = await login(form)
      
      if (result.user.role_id === 1) {
        // Admin
        nav("/admin/dashboard", { replace: true })
      } else if (result.user.role_id === 2) {
        // Technician
        nav("/technician/dashboard", { replace: true })
      } else if (result.user.role_id === 3) {
        // Receptionist
        nav("/admin/dashboard", { replace: true })
      } else {
        // Customer
        nav("/customer/dashboard", { replace: true })
      }
    } catch (e2) {
      setErrMsg(e2.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    )

  return (
    <div className="site">
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Iniciar sesión</h2>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@correo.com"
                value={form.email}
                onChange={onChange}
              />
            </div>

            <div className="form__field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                value={form.password}
                onChange={onChange}
              />
            </div>

            {errMsg && (
              <div className="pill" role="alert">
                {errMsg}
              </div>
            )}

            <div className="form__actions">
              <button className="btn btn--primary" disabled={isLoading}>
                {isLoading ? "Entrando…" : "Entrar"}
              </button>

              <Link to="/register" className="btn btn--ghost">
                Crear cuenta
              </Link>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.9rem",
                  color: "#0066cc",
                  textDecoration: "none",
                }}
              >
                Olvidé mi contraseña
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
