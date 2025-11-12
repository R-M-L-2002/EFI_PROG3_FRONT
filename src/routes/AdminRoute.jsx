import { Navigate } from "react-router-dom";

export default function AdminRoute({ auth, children }) {
  const user = auth?.user;
  const isLogged = auth?.isLogged;
  const isAdmin = user?.role_id === 1 || user?.role_id === "1";

  // Si no está logueado → enviar al login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado pero no es admin → enviar a inicio
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin → mostrar la ruta protegida
  return children;
}
