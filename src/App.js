import React from "react";
import { CartProvider } from "./components/user/CartProvider"; // Importez le contexte
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardUser from "./components/user/DashboardUser";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/admin/Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <CartProvider>
          {" "}
          {/* Encapsulez votre application avec le CartProvider */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<DashboardUser />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
