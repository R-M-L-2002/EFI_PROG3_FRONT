"use client"

import "./App.css"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"
import Dashboard from "./pages/Dashboard"
import Devices from "./pages/Devices"
import { DevicesProvider } from "./contexts/DevicesContext"
import Login from "./pages/Login"
import Orders from "./pages/Orders"
import { RepairOrdersProvider } from "./contexts/RepairOrdersContext"
import Repairs from "./pages/Repairs"
import { RepairsProvider } from "./contexts/RepairsContext"
import { useState } from "react"

function LandingPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    dispositivo: "",
    descripcion: "",
  })
  const [enviado, setEnviado] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await fetch(`${API_URL}/api/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!resp.ok) throw new Error("Error enviando solicitud")
      setEnviado(true)
      setForm({ nombre: "", email: "", dispositivo: "", descripcion: "" })
      setTimeout(() => setEnviado(false), 4000)
    } catch (err) {
      console.error(err)
      alert("No pudimos enviar tu solicitud. Intentá de nuevo.")
    }
  }

  return (
    <div className="site">
      {/* NAV */}
      <header className="nav">
        <div className="container nav__inner">
          <div className="brand">
            <span className="brand__logo" aria-hidden>
              ⚡
            </span>
            <span className="brand__name">TechFix</span>
          </div>
          <nav className="nav__links">
            <a href="#servicios">Servicios</a>
            <a href="#proceso">Proceso</a>
            <a href="#opiniones">Opiniones</a>
            <a href="#contacto" className="btn btn--ghost">
              Contacto
            </a>
            <a href="/admin/login" className="btn btn--primary">
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Mantenimiento y reparación profesional de dispositivos</h1>
            <p>
              Teléfonos, laptops, consolas, tablets y más. Diagnóstico rápido, repuestos de calidad y garantía escrita.
            </p>
            <div className="hero__ctas">
              <a href="#contacto" className="btn btn--primary">
                Solicitar diagnóstico
              </a>
              <a href="#servicios" className="btn btn--ghost">
                Ver servicios
              </a>
            </div>
            <ul className="badges">
              <li>⏱️ 24-48h diagnóstico</li>
              <li>🛡️ 90 días de garantía</li>
              <li>📍 Retiro y entrega (opcional)</li>
            </ul>
          </div>
          <div className="hero__card">
            <div className="device device--phone" />
            <div className="device device--laptop" />
            <div className="device device--controller" />
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
              icon="📱"
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
              <p>Coordinamos retiro o traes tu equipo al local/taller.</p>
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
              <p>"Me cambiaron la batería del iPhone en el día. ¡Excelente atención!"</p>
              <cite>— Sofía P.</cite>
            </blockquote>
            <blockquote>
              <p>"Mi notebook volvió a la vida. Muy prolijos y claros con los tiempos."</p>
              <cite>— Marcos G.</cite>
            </blockquote>
            <blockquote>
              <p>"Repararon el HDMI de mi PS5 y quedó perfecta. Recomendados."</p>
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
              <button className="btn btn--primary" type="submit">
                Enviar solicitud
              </button>
              {enviado && <span className="pill">¡Enviado! Te contactamos a la brevedad.</span>}
            </div>
          </form>

          <div className="contact_cards">
            <div className="card">
              <h3>📞 Teléfono</h3>
              <p>+54 9 351 000 000</p>
            </div>
            <div className="card">
              <h3>📧 Email</h3>
              <p>hola@techfix.com</p>
            </div>
            <div className="card">
              <h3>📍 Ubicación</h3>
              <p>Córdoba, Argentina</p>
            </div>
          </div>
        </div>
      </section>

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
  )
}

function ServiceCard({ icon, title, items }) {
  return (
    <article className="card service">
      <div className="service__icon" aria-hidden>
        {icon}
      </div>
      <h3 className="service__title">{title}</h3>
      <ul className="service__list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </article>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DevicesProvider>
          <RepairOrdersProvider>
            <RepairsProvider>
              <Routes>
                {/* Landing pública */}
                <Route path="/" element={<LandingPage />} />
                {/* Admin routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/orders" element={<Orders />} />
                <Route path="/admin/devices" element={<Devices />} />
                <Route path="/admin/repairs" element={<Repairs />} />
              </Routes>
            </RepairsProvider>
          </RepairOrdersProvider>
        </DevicesProvider>
      </AuthProvider>
    </Router>
  )
}
