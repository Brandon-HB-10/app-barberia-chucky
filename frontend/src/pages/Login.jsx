import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUser, FaCut } from "react-icons/fa";
import api from "../axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      onLogin();
      navigate("/admin");
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 relative bg-dark">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blood rounded-full blur-[150px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-horror rounded-2xl p-8">
          <div className="text-center mb-8">
            <FaCut className="text-fire text-4xl mx-auto mb-4" />
            <h1 className="font-creepster text-3xl text-bone mb-2">Acceso Admin</h1>
            <p className="text-bone-dark text-sm">Solo para personal autorizado</p>
          </div>

          {error && (
            <div className="bg-blood/20 border border-blood/30 text-blood rounded-lg p-3 mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                <FaUser className="text-fire" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                placeholder="admin@chuckybarbershop.com"
                required
              />
            </div>

            <div>
              <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                <FaLock className="text-fire" /> Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-blood w-full py-3 rounded-lg text-bone font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
