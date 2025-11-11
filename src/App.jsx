// App.jsx — Unificado con Login / Register + Landing + Logout en navbar
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// Providers existentes
import { AuthProvider } from "./contexts/AuthContext";
import { DevicesProvider } from "./contexts/DevicesContext";
import { RepairOrdersProvider } from "./contexts/RepairOrdersContext";
import { RepairsProvider } from "./contexts/RepairsContext";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* =========================
   Helpers de auth
========================= */
async function postJSON(url, data, { withCredentials = false } = {}) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: withCredentials ? "include" : "same-origin",
    body: JSON.stringify(data),
  });

  let payload = null;
  try { payload = await resp.json(); } catch { payload = null; }

  if (!resp.ok) {
    const msg = payload?.message || payload?.error || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return payload;
}

function saveAuth({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function readUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

/* Hook sencillo para reflejar estado de sesión en el navbar */
function useAuthClient() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readUser());

  // Si en otra pestaña cambia el storage, reflejarlo
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setUser(readUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isLogged = useMemo(() => Boolean(token), [token]);

  const login = (data) => {
    saveAuth(data);
    setToken(localStorage.getItem("token"));
    setUser(readUser());
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  return { isLogged, user, login, logout };
}

/* =========================
   Navbar compartido
========================= */
function TopNav({ isLogged, user, onLogout }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="brand">
          <span className="brand__logo" aria-hidden>⚡</span>
          <span className="brand__name">TechFix</span>
        </div>
        <nav className="nav__links">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <a href="#opiniones">Opiniones</a>
          <a href="#contacto" className="btn btn--ghost">Contacto</a>

          {!isLogged ? (
            <>
              <Link to="/login" className="btn btn--ghost">Ingresar</Link>
              <Link to="/register" className="btn btn--ghost">Crear cuenta</Link>
            </>
          ) : (
            <>
              <span style={{ opacity: 0.8, marginRight: 8 }}>
                {user?.name || user?.nombre ? `Hola, ${user.name || user.nombre}` : "Sesión iniciada"}
              </span>
              <button className="btn btn--primary" onClick={onLogout}>Cerra Sesión</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

/* =========================
   Login
========================= */
function LoginPage({ auth }) {
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
      const data = await postJSON(`${API_URL}/api/auth/login`, form, {
        withCredentials: false, // poné true si tu back usa cookie httpOnly
      });
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
      <header className="nav">
        <div className="container nav__inner">
          <div className="brand">
            <span className="brand__logo" aria-hidden>⚡</span>
            <span className="brand__name">TechFix</span>
          </div>
          <nav className="nav__links">
            <Link to="/">Inicio</Link>
            <Link to="/register" className="btn btn--ghost">Crear cuenta</Link>
          </nav>
        </div>
      </header>

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

/* =========================
   Register (SOLO 'name')
========================= */
function RegisterPage({ auth }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    // passwordConfirm: "", // descomentar si tu back lo exige
  });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    const payload = {
      name: form.name?.trim(),
      email: form.email?.trim(),
      password: form.password,
      // password_confirmation: form.passwordConfirm,
    };

    try {
      const data = await postJSON(`${API_URL}/api/auth/register`, payload, {
        withCredentials: false, // true si tu back usa cookie httpOnly
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
      <header className="nav">
        <div className="container nav__inner">
          <div className="brand">
            <span className="brand__logo" aria-hidden>⚡</span>
            <span className="brand__name">TechFix</span>
          </div>
          <nav className="nav__links">
            <Link to="/">Inicio</Link>
            <Link to="/login" className="btn btn--ghost">Iniciar sesión</Link>
          </nav>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <h2 className="section__title">Crear cuenta</h2>

          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required placeholder="John Doe"
                value={form.name} onChange={onChange} />
            </div>

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

            {/* Descomentar si tu back lo exige */}
            {/* <div className="form__field">
              <label htmlFor="passwordConfirm">Confirmar contraseña</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="********"
                value={form.passwordConfirm} onChange={onChange} />
            </div> */}

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

/* =========================
   Landing (completo)
========================= */
function LandingPage({ auth }) {
  const [form, setForm] = useState({ nombre: "", email: "", dispositivo: "", descripcion: "" });
  const [enviado, setEnviado] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await postJSON(`${API_URL}/api/solicitudes`, form);
      setEnviado(true);
      setForm({ nombre: "", email: "", dispositivo: "", descripcion: "" });
      setTimeout(() => setEnviado(false), 4000);
    } catch (err) {
      alert(err.message || "No pudimos enviar tu solicitud.");
    }
  };

  return (
    <div className="site">
      <TopNav isLogged={auth.isLogged} user={auth.user} onLogout={auth.logout} />

      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Mantenimiento y reparación profesional de dispositivos</h1>
            <p>
              Teléfonos, laptops, consolas, tablets y más. Diagnóstico rápido,
              repuestos de calidad y garantía escrita.
            </p>
            <div className="hero__ctas">
              <a href="#contacto" className="btn btn--primary">Solicitar diagnóstico</a>
              <a href="#servicios" className="btn btn--ghost">Ver servicios</a>
            </div>
            <ul className="badges">
              <li>⏱️ 24-48h diagnóstico</li>
              <li>🛡️ 90 días de garantía</li>
              <li>📍 Retiro y entrega (opcional)</li>
            </ul>
          </div>
          <div className="hero__card">
            <div className="device device--phone"/>
            <div className="device device--laptop"/>
            <div className="device device--controller"/>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="section">
        <div className="container">
          <h2 className="section__title">Servicios principales</h2>
          <div className="grid">
            <ServiceCard
              icon="📱"
              title="Smartphones"
              items={["Cambio de pantalla", "Baterías", "Puertos de carga", "Software"]}
            />
            <ServiceCard
              icon="💻"
              title="Laptops/PC"
              items={["Limpieza y pasta térmica", "Formateo y optimización", "Reemplazo SSD/RAM", "Placa madre"]}
            />
            <ServiceCard
              icon="🎮"
              title="Consolas"
              items={["HDMI/puertos", "Ventilación y limpieza", "Fuente de poder", "Joystick"]}
            />
            <ServiceCard
              icon="tablet"
              title="Tablets"
              items={["Pantallas y táctil", "Baterías", "Conectores", "Restauración"]}
            />
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="section section--alt">
        <div className="container">
          <h2 className="section__title">¿Cómo trabajamos?</h2>
          <ol className="steps">
            <li>
              <h3>1. Recepción</h3>
              <p>Coordinamos retiro o traes tu equipo al local.</p>
            </li>
            <li>
              <h3>2. Diagnóstico</h3>
              <p>En 24-48h te enviamos presupuesto detallado sin costo.</p>
            </li>
            <li>
              <h3>3. Reparación</h3>
              <p>Usamos repuestos de calidad y te mantenemos al tanto.</p>
            </li>
            <li>
              <h3>4. Entrega y garantía</h3>
              <p>Probamos juntos y te damos garantía por escrito.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* OPINIONES */}
      <section id="opiniones" className="section">
        <div className="container">
          <h2 className="section__title">Lo que dicen nuestros clientes</h2>
          <div className="testimonials">
            <blockquote>
              <p>“Me cambiaron la batería del iPhone en el día. ¡Excelente atención!”</p>
              <cite>— Sofía P.</cite>
            </blockquote>
            <blockquote>
              <p>“Mi notebook volvió a la vida. Muy prolijos y claros con los tiempos.”</p>
              <cite>— Marcos G.</cite>
            </blockquote>
            <blockquote>
              <p>“Repararon el HDMI de mi PS5 y quedó perfecta. Recomendados.”</p>
              <cite>— Anabella R.</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CONTACTO / FORM */}
      <section id="contacto" className="section section--alt">
        <div className="container">
          <h2 className="section__title">Pedí tu diagnóstico</h2>
        <form className="form" onSubmit={onSubmit}>
            <div className="form__row">
              <div className="form__field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={form.nombre}
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
                  placeholder="tunombre@email.com"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="dispositivo">Dispositivo</label>
                <input
                  id="dispositivo"
                  name="dispositivo"
                  type="text"
                  required
                  placeholder="Ej: iPhone 13, Lenovo IdeaPad, PS5..."
                  value={form.dispositivo}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="form__field">
              <label htmlFor="descripcion">Descripción del problema</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={5}
                required
                placeholder="Contanos qué le pasa al equipo..."
                value={form.descripcion}
                onChange={onChange}
              />
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit">Enviar solicitud</button>
              {enviado && <span className="pill">¡Enviado! Te contactamos a la brevedad.</span>}
            </div>
          </form>

          {/* Tarjetas de contacto */}
          <div className="contact_cards">
            <div className="card">
              <h3>📞 Teléfono</h3>
              <p>+54 9 351 000 000</p>
            </div>
            <div className="card">
              <h3>📧 Email</h3>
              <p>hola@electrofix.com</p>
            </div>
            <div className="card">
              <h3>📍 Ubicación</h3>
              <p>Córdoba, Argentina</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <p>© {new Date().getFullYear()} TechFix — Mantenimiento de dispositivos</p>
          <nav className="footer__links">
            <a href="#">Política de privacidad</a>
            <a href="#">Términos</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* Tarjeta de servicio */
function ServiceCard({ icon, title, items }) {
  return (
    <article className="card service">
      <div className="service__icon" aria-hidden>{icon}</div>
      <h3 className="service__title">{title}</h3>
      <ul className="service__list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </article>
  );
}

/* =========================
   App con Providers + Rutas
========================= */
export default function App() {
  const auth = useAuthClient();

  return (
    <Router>
      <AuthProvider>
        <DevicesProvider>
          <RepairOrdersProvider>
            <RepairsProvider>
              <Routes>
                <Route path="/" element={<LandingPage auth={auth} />} />
                <Route path="/login" element={<LoginPage auth={auth} />} />
                <Route path="/register" element={<RegisterPage auth={auth} />} />
              </Routes>
            </RepairsProvider>
          </RepairOrdersProvider>
        </DevicesProvider>
      </AuthProvider>
    </Router>
  );
}
