import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { postJSON } from "../utils/http";

export default function LoginPublic({ auth }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    try {
      const data = await postJSON(`/api/auth/login`, form);
      auth.login(data);
      nav("/");
    } catch (e2) {
      setErrMsg(e2.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">
      <TopNav isLogged={auth.isLogged} user={auth.user} onLogout={auth.logout} />
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Iniciar sesión</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="tu@correo.com"
                     value={form.email} onChange={onChange} />
            </div>
            <div className="form__field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" name="password" type="password" required placeholder="********"
                     value={form.password} onChange={onChange} />
            </div>
            {errMsg && <div className="pill" role="alert">{errMsg}</div>}
            <div className="form__actions">
              <button className="btn btn--primary" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
              </button>
              <Link to="/register" className="btn btn--ghost">Crear cuenta</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
