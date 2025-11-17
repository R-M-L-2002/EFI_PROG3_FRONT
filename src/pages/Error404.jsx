import { useNavigate } from "react-router-dom"

export default function Error404() {
    const nav = useNavigate()

return (
        <div className="site">
        <section className="section">
            <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
            <div style={{ fontSize: "120px", marginBottom: "20px", opacity: 0.3 }}>🔍</div>
            <h1 style={{ fontSize: "48px", margin: "0 0 16px" }}>404</h1>
            <h2 style={{ margin: "0 0 16px", color: "var(--foreground)" }}>Página No Encontrada</h2>
            <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "1.125rem" }}>
                La página que estás buscando no existe o ha sido movida.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="btn btn--primary" onClick={() => nav("/")}>
                Ir al Inicio
                </button>
                <button className="btn btn--ghost" onClick={() => nav(-1)}>
                Volver Atrás
                </button>
            </div>
            </div>
        </section>
        </div>
    )
}
