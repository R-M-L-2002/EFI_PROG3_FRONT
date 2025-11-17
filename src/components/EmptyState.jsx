export default function EmptyState({ icon = "📦", title, description, actionLabel, onAction }) {
    return (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>
            {icon}
            </div>
            <h3 style={{ marginBottom: "8px", color: "var(--foreground)" }}>
            {title}
            </h3>
            {description && (
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                {description}
            </p>
            )}
            {actionLabel && onAction && (
            <button className="btn btn--primary" onClick={onAction}>
                {actionLabel}
            </button>
            )}
        </div>
    )
}  