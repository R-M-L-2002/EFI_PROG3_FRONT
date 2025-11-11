import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"
import { DevicesProvider } from "./contexts/DevicesContext"
import { RepairOrdersProvider } from "./contexts/RepairOrdersContext"
import { RepairsProvider } from "./contexts/RepairsContext"
import { BrowserRouter as Router } from "react-router-dom"

function App() {
  return (
    <Router>
      <AuthProvider>
        <DevicesProvider>
          <RepairOrdersProvider>
            <RepairsProvider>
              <AppRoutes />
            </RepairsProvider>
          </RepairOrdersProvider>
        </DevicesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
