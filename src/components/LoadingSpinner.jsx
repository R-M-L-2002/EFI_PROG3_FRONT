export default function LoadingSpinner({ message = "Cargando..." }) {
    return (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
            style={{
                width: "48px",
                height: "48px",
                border: "4px solid var(--border)",
                borderTop: "4px solid var(--primary)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
            }}
            />
            <p style={{ color: "var(--muted)", margin: 0 }}>{message}</p>
            <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}</style>
        </div>
    )
}  