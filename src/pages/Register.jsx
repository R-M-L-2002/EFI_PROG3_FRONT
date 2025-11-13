import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import TopNav from "../components/TopNav"

export default function Register() {
  const nav = useNavigate()
  const { register, user, loading } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")
    try {
      await register({
        name: form.name?.trim(),
        email: form.email?.trim(),
        password: form.password,
      })
      nav("/login", { replace: true })
    } catch (e2) {
      setErrMsg(e2.message || "Error al crear cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>

  return (
    <div className="site">
      <TopNav isLogged={!!user} user={user} onLogout={() => {}} />

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
