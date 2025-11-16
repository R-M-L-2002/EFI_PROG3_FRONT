import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function ForgotPassword() {
  const nav = useNavigate()
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")
    setSuccessMsg("")

    try {
      await forgotPassword(email)
      setSuccessMsg(
        "Se ha enviado un email de recuperación a " +
          email +
          ". Revisa tu bandeja de entrada."
      )
      setEmail("")

      setTimeout(() => {
        nav("/login")
      }, 3000)
    } catch (e2) {
      setErrMsg(e2.message || "Error al enviar el email de recuperación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="site">
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Recuperar contraseña</h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: "#666",
              textAlign: "center",
            }}
          >
            Ingresa tu email para recibir un enlace de recuperación de contraseña.
          </p>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {errMsg && (
              <div
                className="pill"
                role="alert"
                style={{ backgroundColor: "#fee", color: "#c33" }}
              >
                {errMsg}
              </div>
            )}
            {successMsg && (
              <div
                className="pill"
                role="alert"
                style={{ backgroundColor: "#efe", color: "#3c3" }}
              >
                {successMsg}
              </div>
            )}

            <div className="form__actions">
              <button className="btn btn--primary" disabled={isLoading}>
                {isLoading ? "Enviando…" : "Enviar enlace"}
              </button>
              <Link to="/login" className="btn btn--ghost">
                Volver a inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
