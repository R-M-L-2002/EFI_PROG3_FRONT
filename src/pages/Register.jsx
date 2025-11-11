import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { postJSON } from "../utils/http";

export default function Register({ auth }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    try {
      const data = await postJSON("/api/auth/register", {
        name: form.name?.trim(),
        email: form.email?.trim(),
        password: form.password,
      });
      auth.login(data);
      nav("/");
    } catch (e2) {
      setErrMsg(e2.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">
      <TopNav isLogged={auth.isLogged} user={auth.user} onLogout={auth.logout} />

      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Crear cuenta</h2>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required placeholder="John Doe"
                     value={form.name} onChange={onChange}/>
            </div>

            <div className="form__field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="tu@correo.com"
                     value={form.email} onChange={onChange}/>
            </div>

            <div className="form__field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" name="password" type="password" required placeholder="********"
                     value={form.password} onChange={onChange}/>
            </div>

            {errMsg && <div className="pill" role="alert">{errMsg}</div>}

            <div className="form__actions">
              <button className="btn btn--primary" disabled={loading}>
                {loading ? "Creando…" : "Crear cuenta"}
              </button>
              <Link to="/login" className="btn btn--ghost">Ya tengo cuenta</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
