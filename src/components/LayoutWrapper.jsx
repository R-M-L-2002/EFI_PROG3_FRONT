import { useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import { useAuth } from "../contexts/AuthContext";

function LayoutWrapper({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  // Rutas donde NO debe verse el TopNav
  const hideNav =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/technician") ||
    pathname.startsWith("/customer");

  return (
    <div className="site">
      {!hideNav && <TopNav isLogged={!!user} user={user} onLogout={logout} />}
      {children}
    </div>
  );
}

export default LayoutWrapper;