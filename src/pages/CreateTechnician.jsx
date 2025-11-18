"use client"

import { useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { useAuth } from "../contexts/AuthContext"

export default function CreateTechnician() {
  const { register } = useAuth()

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")
    setSuccessMsg("")

    try {
      const payload = {
        name: form.name?.trim(),
        email: form.email?.trim(),
        password: form.password,
        role_id: 2, // 👈 técnico (asegurate que 2 sea el rol técnico en tu DB)
      }

      await register(payload)

      setSuccessMsg("Técnico creado correctamente ✅")
      setForm({ name: "", email: "", password: "" })
    } catch (e2) {
      console.error(e2)
      setErrMsg(e2.message || "Error al crear técnico")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1 style={{ margin: "0 0 8px" }}>Crear Técnico</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Registra un nuevo técnico para asignarle reparaciones y órdenes
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 24 }}>
        <form className="form" onSubmit={onSubmit}>
          <div className="form__field">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Juan Técnico"
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
              placeholder="tecnico@techfix.com"
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

          {successMsg && (
            <div className="pill" role="status" style={{ background: "var(--success-soft)" }}>
              {successMsg}
            </div>
          )}

          <div className="form__actions">
            <button className="btn btn--primary" disabled={isLoading}>
              {isLoading ? "Creando…" : "Crear técnico"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
