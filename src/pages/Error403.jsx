import { useNavigate } from "react-router-dom"

export default function Error403() {
    const nav = useNavigate()

return (
        <div className="site">
        <section className="section">
            <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
            <div style={{ fontSize: "120px", marginBottom: "20px", opacity: 0.3 }}>🔒</div>
            <h1 style={{ fontSize: "48px", margin: "0 0 16px" }}>403</h1>
            <h2 style={{ margin: "0 0 16px", color: "var(--foreground)" }}>Acceso Denegado</h2>
            <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "1.125rem" }}>
                No tienes permisos para acceder a este recurso. Si crees que esto es un error, contacta al
                administrador.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="btn btn--primary" onClick={() => nav(-1)}>
                Volver Atrás
                </button>
                <button className="btn btn--ghost" onClick={() => nav("/")}>
                Ir al Inicio
                </button>
            </div>
            </div>
        </section>
        </div>
    )
}
