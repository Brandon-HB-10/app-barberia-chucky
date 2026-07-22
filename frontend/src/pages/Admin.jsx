import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaSignOutAlt, FaUser, FaBell, FaWhatsapp } from "react-icons/fa";
import api from "../axios";

export default function Admin({ onLogout }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimaCitaId, setUltimaCitaId] = useState(() => {
    return parseInt(localStorage.getItem("ultimaCitaId") || "0");
  });
  const [nuevasCitas, setNuevasCitas] = useState(0);

  useEffect(() => {
    cargarCitas();
    // Refrescar cada 30 segundos
    const interval = setInterval(cargarCitas, 30000);
    return () => clearInterval(interval);
  }, []);

  async function cargarCitas() {
    try {
      const res = await api.get("/citas");
      setCitas(res.data);
      
      // Detectar citas nuevas
      if (res.data.length > 0) {
        const maxId = Math.max(...res.data.map(c => c.id));
        const guardado = parseInt(localStorage.getItem("ultimaCitaId") || "0");
        
        if (maxId > guardado && guardado !== 0) {
          setNuevasCitas(maxId - guardado);
        }
        
        if (guardado === 0) {
          localStorage.setItem("ultimaCitaId", maxId.toString());
          setUltimaCitaId(maxId);
        }
      }
    } catch (err) {
      console.error("Error cargando citas");
    } finally {
      setLoading(false);
    }
  }

  function marcarComoVisto() {
    if (citas.length > 0) {
      const maxId = Math.max(...citas.map(c => c.id));
      localStorage.setItem("ultimaCitaId", maxId.toString());
      setUltimaCitaId(maxId);
      setNuevasCitas(0);
    }
  }

  async function actualizarEstado(id, estado) {
    try {
      await api.put(`/citas/${id}/estado`, { estado });
      cargarCitas();
    } catch (err) {
      alert("Error actualizando estado");
    }
  }

  async function eliminarCita(id) {
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      await api.delete(`/citas/${id}`);
      cargarCitas();
    } catch (err) {
      alert("Error eliminando cita");
    }
  }

  function enviarWhatsApp(telefono, nombre, fecha, hora, estado) {
    const mensaje = estado === "confirmada" 
      ? `¡Hola ${nombre}! Tu cita en Chucky Barber Shop para el ${fecha} a las ${hora} ha sido CONFIRMADA. ¡Te esperamos! 🪒`
      : `Hola ${nombre}, lamentamos informarte que tu cita para el ${fecha} a las ${hora} ha sido CANCELADA. Contáctanos para reagendar.`;
    
    const url = `https://wa.me/52${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  const estados = {
    pendiente: { color: "text-yellow-500", bg: "bg-yellow-500/20", icon: FaClock, label: "Pendiente" },
    confirmada: { color: "text-green-400", bg: "bg-green-400/20", icon: FaCheckCircle, label: "Confirmada" },
    cancelada: { color: "text-red-500", bg: "bg-red-500/20", icon: FaTimesCircle, label: "Cancelada" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-dark">
        <div className="animate-pulse text-fire text-2xl font-creepster">Cargando citas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-creepster text-4xl text-bone text-glow">Panel de Control</h1>
            <p className="text-bone-dark">Gestiona las citas de Chucky Barber Shop</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Badge de notificaciones */}
            <AnimatePresence>
              {nuevasCitas > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={marcarComoVisto}
                  className="relative bg-fire/20 border border-fire/40 text-fire px-4 py-2 rounded-full flex items-center gap-2 hover:bg-fire/30 transition-colors"
                >
                  <FaBell className="animate-bounce" />
                  <span className="font-semibold">{nuevasCitas} nueva{nuevasCitas > 1 ? 's' : ''}</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-fire rounded-full animate-ping" />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-blood hover:text-fire transition-colors"
            >
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {["pendiente", "confirmada", "cancelada"].map((estado) => {
            const count = citas.filter((c) => c.estado === estado).length;
            const config = estados[estado];
            const Icon = config.icon;
            return (
              <motion.div
                key={estado}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-horror rounded-xl p-4 flex items-center gap-4"
              >
                <div className={`${config.bg} p-3 rounded-lg`}>
                  <Icon className={`${config.color} text-xl`} />
                </div>
                <div>
                  <p className="text-2xl font-creepster text-bone">{count}</p>
                  <p className="text-bone-dark text-sm">{config.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Citas list */}
        <div className="space-y-4">
          {citas.length === 0 ? (
            <div className="text-center py-12 text-bone-dark">
              <FaClock className="text-4xl mx-auto mb-4 opacity-30" />
              <p>No hay citas registradas</p>
            </div>
          ) : (
            citas.map((cita, index) => {
              const config = estados[cita.estado] || estados.pendiente;
              const Icon = config.icon;
              const esNueva = cita.id > ultimaCitaId;
              
              return (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-horror rounded-xl p-6 relative ${esNueva ? 'border-fire/50 shadow-fire/20' : ''}`}
                >
                  {/* Badge de nueva */}
                  {esNueva && (
                    <div className="absolute -top-2 -right-2 bg-fire text-bone text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      NUEVA
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUser className="text-fire" />
                        <span className="font-semibold text-bone">{cita.cliente_nombre}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
                          <Icon className="inline mr-1" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-bone-dark text-sm">
                        {cita.servicio_nombre} | {cita.fecha} {cita.hora}
                      </p>
                      <p className="text-bone-dark/60 text-xs mt-1">
                        📱 {cita.cliente_telefono}
                        {cita.cliente_email && ` | ✉️ ${cita.cliente_email}`}
                      </p>
                      {cita.notas && (
                        <p className="text-bone-dark/60 text-xs mt-1 italic">"{cita.notas}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* WhatsApp */}
                      <button
                        onClick={() => enviarWhatsApp(cita.cliente_telefono, cita.cliente_nombre, cita.fecha, cita.hora, "confirmada")}
                        className="bg-green-500/20 text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center gap-1"
                        title="Confirmar por WhatsApp"
                      >
                        <FaWhatsapp /> Confirmar
                      </button>
                      
                      {cita.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => actualizarEstado(cita.id, "confirmada")}
                            className="bg-green-400/20 text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-400/30 transition-colors"
                          >
                            <FaCheckCircle className="inline mr-1" /> Confirmar
                          </button>
                          <button
                            onClick={() => actualizarEstado(cita.id, "cancelada")}
                            className="bg-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                          >
                            <FaTimesCircle className="inline mr-1" /> Cancelar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => eliminarCita(cita.id)}
                        className="text-bone-dark hover:text-red-500 transition-colors p-2"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}