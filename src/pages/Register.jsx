import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Register() {
  const nav = useNavigate()
  const { register, login } = useAuth()

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")

    try {
      const payload = {
        name: form.name?.trim(),
        email: form.email?.trim(),
        password: form.password,
      }

      await register(payload)

      const result = await login({
        email: payload.email,
        password: payload.password,
      })

      if (result.user.role_id === 1) {
        nav("/admin/dashboard", { replace: true })
      } else if (result.user.role_id === 2) {
        nav("/technician/dashboard", { replace: true })
      } else if (result.user.role_id === 3) {
        nav("/customer/dashboard", { replace: true })
      } 
    } catch (e2) {
      setErrMsg(e2.message || "Error al crear cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="site">
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Crear cuenta</h2>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={onChange}
              />
            </div>

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
                {isLoading ? "Creando…" : "Crear cuenta"}
              </button>

              <Link to="/login" className="btn btn--ghost">
                Ya tengo cuenta
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
