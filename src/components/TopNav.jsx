import { Link, NavLink } from "react-router-dom";

function isAdmin(user) {
  const rid = user?.role_id;
  return rid === 1 || rid === "1";
}

export default function TopNav({ isLogged, user, onLogout }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="brand">
          <span className="brand__logo" aria-hidden>⚡</span>
          <span className="brand__name">TechFix</span>
        </div>

        <nav className="nav__links">
          {/* Tabs públicas */}
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/#servicios">Servicios</NavLink>
          <NavLink to="/#proceso">Proceso</NavLink>
          <NavLink to="/#opiniones">Opiniones</NavLink>
          <NavLink to="/contact" className="btn btn--ghost">Contacto</NavLink>

          {!isLogged ? (
            <>
              <Link to="/login" className="btn btn--ghost">Ingresar</Link>
              <Link to="/register" className="btn btn--ghost">Crear cuenta</Link>
            </>
          ) : (
            <>
              {/* Botón visible solo para admins */}
              {isAdmin(user) && (
                <NavLink to="/admin/dashboard" className="btn btn--admin">
                  Panel Admin
                </NavLink>
              )}

              <span style={{ opacity: 0.8, marginRight: 8 }}>
                {user?.name || user?.nombre ? `Hola, ${user.name || user.nombre}` : "Sesión iniciada"}
              </span>
              <button className="btn btn--primary" onClick={onLogout}>Cerrar sesión</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
