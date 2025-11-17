import { useNavigate } from "react-router-dom"

export default function Error500() {
    const nav = useNavigate()

    const handleRetry = () => {
        window.location.reload()
    }

return (
        <div className="site">
        <section className="section">
            <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>
            <div style={{ fontSize: "120px", marginBottom: "20px", opacity: 0.3 }}>⚠</div>
            <h1 style={{ fontSize: "48px", margin: "0 0 16px" }}>500</h1>
            <h2 style={{ margin: "0 0 16px", color: "var(--foreground)" }}>Error del Servidor</h2>
            <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "1.125rem" }}>
                Algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo. Por favor, intenta de
                nuevo más tarde.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button className="btn btn--primary" onClick={handleRetry}>
                Reintentar
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
