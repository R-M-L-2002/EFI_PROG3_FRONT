import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function CustomerRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role_id !== 3) {
    return <Navigate to="/" replace />
  }

  return children
}
