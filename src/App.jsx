import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/routes.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
