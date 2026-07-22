import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Citas from "./pages/Citas";

export default function App() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setLogueado(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  function handleLogin() {
    setLogueado(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLogueado(false);
  }

  return (
    <BrowserRouter>
      <div className="overflow-x-hidden min-h-screen bg-dark">
        <Navbar logueado={logueado} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/admin" element={
            logueado ? <Admin onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}