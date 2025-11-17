export default function ErrorState({ message, onRetry }) {
    return (
        <div
        className="card"
        style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#fef2f2",
            borderColor: "#fca5a5",
        }}
        >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠</div>
        <h3 style={{ marginBottom: "8px", color: "#dc2626" }}>Error</h3>
        <p style={{ color: "#991b1b", marginBottom: "24px" }}>
            {message || "Ocurrió un error al cargar los datos"}
        </p>
        {onRetry && (
            <button className="btn btn--ghost" onClick={onRetry} style={{ borderColor: "#dc2626", color: "#dc2626" }}>
                Reintentar
            </button>
        )}
        </div>
    )
}
