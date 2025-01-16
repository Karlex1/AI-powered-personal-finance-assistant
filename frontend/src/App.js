import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ForgotPassword from "./Components/Auth/Forgetpassword";
import Dashboard from "./Components/Dashboard";
import AuthProvider from "./Context/AuthContext"; // Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
