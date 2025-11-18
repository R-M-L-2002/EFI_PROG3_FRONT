// components/TopNav.jsx
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function getRolePanel(user) {
  const role = Number(user?.role_id);
  if (role === 1) return { path: "/admin/dashboard", label: "Panel Admin", className: "btn--admin" };
  if (role === 2) return { path: "/technician/dashboard", label: "Panel Técnico", className: "btn--tech" };
  if (role === 3) return { path: "/customer/dashboard", label: "Panel Usuario", className: "btn--user" };
  return null;
}

export default function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const panel = getRolePanel(user);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="brand">
        <Link to="/" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            textDecoration: "none"
        }}>
            <img src="/vite.svg" alt="Logo TechFix" style={{ height: "40px" }} />
            <span 
            className="brand__name" 
            style={{ color: "white" }}
            >
            TechFix
            </span>
        </Link>
        </div>

        <nav className="nav__links">
          <NavLink to="/#servicios">Servicios</NavLink>
          <NavLink to="/#proceso">Proceso</NavLink>
          <NavLink to="/#opiniones">Opiniones</NavLink>
          <NavLink to="/contact" className="btn btn--ghost">Contacto</NavLink>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn--ghost">Ingresar</Link>
              <Link to="/register" className="btn btn--ghost">Crear cuenta</Link>
            </>
          ) : (
            <>
              {panel && (
                <NavLink to={panel.path} className={`btn ${panel.className}`}>
                  {panel.label}
                </NavLink>
              )}
              <span style={{ opacity: 0.8, marginRight: 8 }}>
                {user?.name || user?.nombre ? `Hola, ${user.name || user.nombre}` : "Sesión iniciada"}
              </span>
              <button className="btn btn--primary" onClick={logout}>Cerrar sesión</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
