import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaSignOutAlt, FaUser, FaBell, FaWhatsapp, FaCalendarAlt, FaPlus, FaCut, FaPhone, FaEnvelope, FaComment } from "react-icons/fa";
import api from "../axios";

export default function Admin({ onLogout }) {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimaCitaId, setUltimaCitaId] = useState(() => {
    return parseInt(localStorage.getItem("ultimaCitaId") || "0");
  });
  const [nuevasCitas, setNuevasCitas] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const [form, setForm] = useState({
    cliente_nombre: "",
    cliente_telefono: "",
    cliente_email: "",
    servicio_id: "",
    servicio_nombre: "",
    fecha: "",
    hora: "",
    notas: ""
  });

  useEffect(() => {
    cargarCitas();
    cargarServicios();
    const interval = setInterval(cargarCitas, 30000);
    return () => clearInterval(interval);
  }, []);

  async function cargarCitas() {
    try {
      const res = await api.get("/citas");
      setCitas(res.data);
      
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

  async function cargarServicios() {
    try {
      const res = await api.get("/servicios");
      setServicios(res.data);
    } catch (err) {
      console.error("Error cargando servicios");
    }
  }

  // Cargar horas ocupadas cuando cambia la fecha en el modal
  useEffect(() => {
    if (form.fecha && modalOpen) {
      api.get(`/citas/disponibles?fecha=${form.fecha}`)
        .then((res) => setHorasOcupadas(res.data.horas_ocupadas))
        .catch(() => setHorasOcupadas([]));
    }
  }, [form.fecha, modalOpen]);

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

  function handleServicioChange(e) {
    const servicio = servicios.find((s) => s.id === parseInt(e.target.value));
    setForm({
      ...form,
      servicio_id: e.target.value,
      servicio_nombre: servicio ? servicio.nombre : ""
    });
  }

  async function handleSubmitModal(e) {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    
    try {
      await api.post("/citas", { ...form, agendado_por: "admin" });
      setModalSuccess(true);
      cargarCitas();
      setTimeout(() => {
        setModalSuccess(false);
        setModalOpen(false);
        setForm({
          cliente_nombre: "",
          cliente_telefono: "",
          cliente_email: "",
          servicio_id: "",
          servicio_nombre: "",
          fecha: "",
          hora: "",
          notas: ""
        });
        setHorasOcupadas([]);
      }, 2000);
    } catch (err) {
      setModalError(err.response?.data?.detail || "Error al agendar. Intenta de nuevo.");
    } finally {
      setModalLoading(false);
    }
  }

  const generarHorarios = () => {
    const horarios = [];
    for (let h = 10; h < 23; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
    horarios.push("23:00");
    return horarios;
  };

  const horarios = generarHorarios();
  const hoy = new Date().toISOString().split('T')[0];

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
            {/* Botón Agendar Cita Manual */}
            <button
              onClick={() => setModalOpen(true)}
              className="bg-fire/20 border border-fire/40 text-fire px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-fire/30 transition-colors"
            >
              <FaPlus /> Agendar Cita
            </button>

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
              const esAdmin = cita.agendado_por === "admin";
              
              return (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-horror rounded-xl p-6 relative ${esNueva ? 'border-fire/50 shadow-fire/20' : ''} ${esAdmin ? 'border-l-4 border-l-fire' : ''}`}
                >
                  {/* Badge de nueva */}
                  {esNueva && (
                    <div className="absolute -top-2 -right-2 bg-fire text-bone text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      NUEVA
                    </div>
                  )}
                  
                  {/* Badge de agendado por admin */}
                  {esAdmin && (
                    <div className="absolute -top-2 left-4 bg-fire/80 text-bone text-xs px-2 py-1 rounded-full font-bold">
                      <FaUser className="inline mr-1" /> AGENDADO EN TIENDA
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
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

      {/* MODAL: Agendar Cita Manual */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-horror rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-creepster text-2xl text-bone flex items-center gap-2">
                  <FaCalendarAlt className="text-fire" /> Agendar Cita Manual
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-bone-dark hover:text-bone transition-colors text-xl"
                >
                  <FaTimesCircle />
                </button>
              </div>

              {modalSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <FaCheckCircle className="text-poison text-5xl mx-auto mb-4" />
                  <h3 className="font-creepster text-2xl text-bone mb-2">¡Cita Agendada!</h3>
                  <p className="text-bone-dark">La cita se guardó correctamente.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitModal} className="space-y-4">
                  {modalError && (
                    <div className="bg-blood/20 border border-blood/40 rounded-lg p-3 flex items-center gap-2">
                      <FaExclamationTriangle className="text-blood flex-shrink-0" />
                      <p className="text-blood text-sm">{modalError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                        <FaUser className="text-fire" /> Nombre del cliente
                      </label>
                      <input
                        type="text"
                        value={form.cliente_nombre}
                        onChange={(e) => setForm({ ...form, cliente_nombre: e.target.value })}
                        className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                        placeholder="Nombre completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                        <FaPhone className="text-fire" /> Teléfono
                      </label>
                      <input
                        type="tel"
                        value={form.cliente_telefono}
                        onChange={(e) => setForm({ ...form, cliente_telefono: e.target.value })}
                        className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                        placeholder="241 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                      <FaEnvelope className="text-fire" /> Email (opcional)
                    </label>
                    <input
                      type="email"
                      value={form.cliente_email}
                      onChange={(e) => setForm({ ...form, cliente_email: e.target.value })}
                      className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                      placeholder="cliente@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                      <FaCut className="text-fire" /> Servicio
                    </label>
                    <select
                      value={form.servicio_id}
                      onChange={handleServicioChange}
                      className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                      required
                    >
                      <option value="" className="bg-dark">Selecciona un servicio</option>
                      {servicios.map((s) => (
                        <option key={s.id} value={s.id} className="bg-dark">
                          {s.nombre} - ${s.precio} ({s.duracion_min} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-fire" /> Fecha
                      </label>
                      <input
                        type="date"
                        value={form.fecha}
                        min={hoy}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value, hora: "" })}
                        className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                        <FaClock className="text-fire" /> Hora
                      </label>
                      <select
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                        className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm"
                        required
                        disabled={!form.fecha}
                      >
                        <option value="" className="bg-dark">
                          {!form.fecha ? "Primero fecha" : "Selecciona hora"}
                        </option>
                        {horarios.map((hora) => {
                          const ocupada = horasOcupadas.includes(hora);
                          return (
                            <option 
                              key={hora} 
                              value={hora} 
                              className="bg-dark"
                              disabled={ocupada}
                            >
                              {hora} {ocupada ? "— OCUPADO" : "— Disponible"}
                            </option>
                          );
                        })}
                      </select>
                      {form.fecha && horasOcupadas.length > 0 && (
                        <p className="text-blood text-xs mt-1">
                          {horasOcupadas.length} hora(s) ocupada(s)
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-bone text-sm mb-1 flex items-center gap-2">
                      <FaComment className="text-fire" /> Notas (opcional)
                    </label>
                    <textarea
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                      className="input-horror w-full px-3 py-2 rounded-lg text-bone text-sm h-20 resize-none"
                      placeholder="Detalles especiales..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="btn-blood w-full py-3 rounded-lg text-bone font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <FaCalendarAlt />
                    {modalLoading ? "Agendando..." : "Confirmar Cita"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}