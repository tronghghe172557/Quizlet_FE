import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/routes.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DarkModeProvider>
  );
}

export default App;
