import { useState } from "react";
import { postJSON } from "../utils/http";

export default function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    dispositivo: "",
    descripcion: ""
  });
  const [enviado, setEnviado] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await postJSON("/api/solicitudes", form);
      setEnviado(true);
      setForm({ nombre: "", email: "", dispositivo: "", descripcion: "" });
      setTimeout(() => setEnviado(false), 4000);
    } catch (err) {
      alert(err.message || "No pudimos enviar tu solicitud.");
    }
  };

  return (
    <div className="site">
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
              {enviado && (
                <span className="pill">¡Enviado! Te contactamos a la brevedad.</span>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
