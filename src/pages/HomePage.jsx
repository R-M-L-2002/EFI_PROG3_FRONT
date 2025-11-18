import ServiceCard from "../components/ServiceCard"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function HomePage() {
  return (
    <div className="site">
      
      {/* CARRUSEL DE FONDO */}
      <section className="hero">
        
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          showIndicators={false}
          interval={3100}
          transitionTime={1000}
          className="hero-carousel"
        >
          <div>
            <img src="/1.png" alt="Mesa de reparación" />
          </div>
          <div>
            <img src="/2.png" alt="Reparación de dispositivos" />
          </div>
          <div>
            <img src="/3.png" alt="Taller TechFix" />
          </div>
        </Carousel>

        {/* TEXTO SUPERPUESTO */}
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>Mantenimiento y reparación profesional de dispositivos</h1>
            <p>
              Teléfonos, laptops, consolas, tablets y más. Diagnóstico rápido,
              repuestos de calidad y garantía escrita.
            </p>
            <div className="hero__ctas">
              <a href="/contact" className="btn btn--primary">
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
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="section">
        <div className="container">
          <h2 className="section__title">Servicios principales</h2>
          <div className="grid">

            <ServiceCard
              icon={<img 
                src="/smartphone.png" 
                alt="Smartphone" 
                /* ¡Recuerda quitar el style de aquí! */
              />}
              title="Smartphones"
              items={["Cambio de pantalla", "Baterías", "Puertos de carga", "Software"]}
            />
            <ServiceCard
              icon={<img 
                src="/typing.png" 
                alt="Laptop" 
                /* ¡Recuerda quitar el style de aquí! */
              />}
              title="Laptops/PC"
              items={[
                "Limpieza y pasta térmica",
                "Formateo y optimización",
                "Reemplazo SSD/RAM",
                "Placa madre",
              ]}
            />
            <ServiceCard
              icon={<img 
                src="/remote-control.png" 
                alt="Consola" 
                /* ¡Recuerda quitar el style de aquí! */
              />}
              title="Consolas"
              items={["HDMI/puertos", "Ventilación y limpieza", "Fuente de poder", "Joystick"]}
            />
            <ServiceCard
              icon={<img 
                src="/cubes.png" 
                alt="Tablet" 
                /* ¡Recuerda quitar el style de aquí! */
              />}
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
  )
}
