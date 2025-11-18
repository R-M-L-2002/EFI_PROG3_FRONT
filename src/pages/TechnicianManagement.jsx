"use client"

import { useEffect, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { useAuth } from "../contexts/AuthContext"
import { usersService } from "../services/user"

import { FaEdit, FaTrash, FaPlay, FaCheck, FaFilePdf } from "react-icons/fa"

export default function CreateTechnician() {
  const { register } = useAuth()

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [technicians, setTechnicians] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [editingTech, setEditingTech] = useState(null) // técnico que estamos editando

  // ----------------------
  // CARGAR TÉCNICOS
  // ----------------------
  const fetchTechnicians = async () => {
    setLoadingList(true)
    try {
      const res = await usersService.getAll()
      const data = res.data || res
      // Filtrar solo técnicos
      const techs = data.filter(
        (u) => (u.role && u.role.code === "tecnico") || u.role_id === 2
      )
      setTechnicians(techs)
    } catch (err) {
      console.error("Error cargando técnicos:", err)
      setErrMsg("Error al cargar la lista de técnicos")
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  // ----------------------
  // HANDLERS FORM
  // ----------------------
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" })
    setEditingTech(null)
    setErrMsg("")
    setSuccessMsg("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")
    setSuccessMsg("")

    try {
      if (editingTech) {
        // Modo EDITAR técnico
        const payload = {
          name: form.name?.trim(),
          email: form.email?.trim(),
          // normalmente no cambiás password desde acá,
          // si querés podrías mandarla si no está vacía
        }

        await usersService.update(editingTech.id, payload)
        setSuccessMsg("Técnico actualizado correctamente")
      } else {
        // 👇 Modo CREAR técnico (usamos el register de Auth)
        const payload = {
          name: form.name?.trim(),
          email: form.email?.trim(),
          password: form.password,
          role_id: 2, // técnico
        }

        await register(payload)
        setSuccessMsg("Técnico creado correctamente")
      }

      await fetchTechnicians()
      // si estabas editando, dejamos el nombre/email en el form, si estabas creando, lo limpiamos
      if (!editingTech) {
        setForm({ name: "", email: "", password: "" })
      } else {
        setForm((f) => ({ ...f, password: "" }))
      }
    } catch (e2) {
      console.error(e2)
      setErrMsg(e2.message || "Error al guardar técnico")
    } finally {
      setIsLoading(false)
    }
  }

  // ----------------------
  // EDITAR / BORRAR
  // ----------------------
  const handleEdit = (tech) => {
    setEditingTech(tech)
    setForm({
      name: tech.name || "",
      email: tech.email || "",
      password: "", // no mostramos password actual
    })
    setErrMsg("")
    setSuccessMsg("")
  }

  const handleDelete = async (tech) => {
    if (!window.confirm(`¿Eliminar al técnico ${tech.email}?`)) return
    try {
      await usersService.remove(tech.id) // o delete / destroy según tu API
      await fetchTechnicians()
    } catch (err) {
      console.error("Error eliminando técnico:", err)
      setErrMsg("Error al eliminar técnico")
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1 style={{ margin: "0 0 8px" }}>Técnicos</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Crea, edita y administra los técnicos del sistema
          </p>
        </div>
      </div>

      {/* Layout 2 columnas: form a la izquierda, lista a la derecha */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 2fr)",
          gap: "24px",
          alignItems: "flex-start",
          marginTop: 24,
        }}
      >
        {/* CARD FORM */}
        <div className="card" style={{ width: "100%" }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>
            {editingTech ? "Editar Técnico" : "Registrar Técnico"}
          </h2>

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

            {!editingTech && (
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
            )}

            {errMsg && (
              <div className="pill" role="alert">
                {errMsg}
              </div>
            )}

            {successMsg && (
              <div
                className="pill"
                role="status"
                style={{ background: "var(--success-soft)" }}
              >
                {successMsg}
              </div>
            )}

            <div className="form__actions">
              <button className="btn btn--primary" disabled={isLoading}>
                {isLoading
                  ? editingTech
                    ? "Actualizando…"
                    : "Creando…"
                  : editingTech
                  ? "Actualizar técnico"
                  : "Crear técnico"}
              </button>

              {editingTech && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={resetForm}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CARD LISTA */}
        <div className="card" style={{ width: "100%" }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Lista de técnicos</h2>

          {loadingList ? (
            <p style={{ margin: 0 }}>Cargando técnicos…</p>
          ) : technicians.length === 0 ? (
            <p style={{ margin: 0 }}>Todavía no hay técnicos registrados.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th style={{ width: 160 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((t) => (
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td>{t.name || "Sin nombre"}</td>
                      <td>{t.email}</td>
                      <td>
                        <button className="btn btn--ghost" onClick={() => handleEdit(tech)} title="Editar">
                          <FaEdit size={18} />
                        </button>
                        <button className="btn btn--ghost" onClick={() => handleDelete(tech.id)} title="Eliminar">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
