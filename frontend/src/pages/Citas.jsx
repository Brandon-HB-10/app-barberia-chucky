import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaCut, FaComment, FaCheckCircle, FaExclamationTriangle, FaWhatsapp } from "react-icons/fa";
import api from "../axios";

export default function Citas() {
  const [servicios, setServicios] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/servicios").then((res) => setServicios(res.data));
  }, []);

  // Cargar horas ocupadas cuando cambia la fecha
  useEffect(() => {
    if (form.fecha) {
      api.get(`/citas/disponibles?fecha=${form.fecha}`)
        .then((res) => setHorasOcupadas(res.data.horas_ocupadas))
        .catch(() => setHorasOcupadas([]));
    }
  }, [form.fecha]);

  function handleServicioChange(e) {
    const servicio = servicios.find((s) => s.id === parseInt(e.target.value));
    setForm({
      ...form,
      servicio_id: e.target.value,
      servicio_nombre: servicio ? servicio.nombre : ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await api.post("/citas", form);
      setSuccess(true);
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
    } catch (err) {
      setError(err.response?.data?.detail || "Error al agendar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // Generar horarios disponibles (10 AM - 11 PM, cada 30 min)
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

  if (success) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-horror rounded-2xl p-8 text-center max-w-md"
      >
        <FaCheckCircle className="text-poison text-6xl mx-auto mb-4" />
        <h2 className="font-creepster text-3xl text-bone mb-4">¡Cita Agendada!</h2>
        <p className="text-bone-dark mb-6">
          Te esperamos en Chucky Barber Shop. No olvides llegar 5 minutos antes.
        </p>
        
        {/* NUEVO: Mensaje de contacto para cambios */}
        <div className="bg-blood/10 border border-blood/30 rounded-xl p-4 mb-6">
          <p className="text-bone text-sm mb-2">
            ¿Necesitas cambiar o cancelar tu cita?
          </p>
          <a
            href="https://wa.me/522411401183?text=Hola,%20quiero%20modificar%20mi%20cita"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fire hover:text-bone transition-colors text-sm flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> Escríbenos por WhatsApp
          </a>
          <p className="text-bone-dark text-xs mt-2">
            o llámanos al <span className="text-fire">241 140 1183</span>
          </p>
        </div>

        <button
          onClick={() => setSuccess(false)}
          className="btn-blood px-6 py-3 rounded-lg text-bone uppercase tracking-wider"
        >
          Agendar otra cita
        </button>
      </motion.div>
    </div>
  );
}

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-dark relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood rounded-full blur-[200px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fire rounded-full blur-[200px] opacity-10" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-creepster text-4xl sm:text-5xl text-bone mb-4 text-glow">
            Agendar Cita
          </h1>
          <p className="text-bone-dark">
            Reserva tu lugar en la silla del terror
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blood/20 border border-blood/40 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <FaExclamationTriangle className="text-blood text-xl flex-shrink-0" />
            <p className="text-blood text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-horror rounded-2xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                  <FaUser className="text-fire" /> Nombre
                </label>
                <input
                  type="text"
                  value={form.cliente_nombre}
                  onChange={(e) => setForm({ ...form, cliente_nombre: e.target.value })}
                  className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                  <FaPhone className="text-fire" /> Teléfono
                </label>
                <input
                  type="tel"
                  value={form.cliente_telefono}
                  onChange={(e) => setForm({ ...form, cliente_telefono: e.target.value })}
                  className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                  placeholder="241 123 4567"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                <FaEnvelope className="text-fire" /> Email (opcional)
              </label>
              <input
                type="email"
                value={form.cliente_email}
                onChange={(e) => setForm({ ...form, cliente_email: e.target.value })}
                className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                <FaCut className="text-fire" /> Servicio
              </label>
              <select
                value={form.servicio_id}
                onChange={handleServicioChange}
                className="input-horror w-full px-4 py-3 rounded-lg text-bone"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-fire" /> Fecha
                </label>
                <input
                  type="date"
                  value={form.fecha}
                  min={hoy}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value, hora: "" })}
                  className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                  required
                />
              </div>
              <div>
                <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                  <FaClock className="text-fire" /> Hora
                </label>
                <select
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                  className="input-horror w-full px-4 py-3 rounded-lg text-bone"
                  required
                  disabled={!form.fecha}
                >
                  <option value="" className="bg-dark">
                    {!form.fecha ? "Primero selecciona fecha" : "Selecciona hora"}
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
                  <p className="text-blood text-xs mt-2">
                    {horasOcupadas.length} hora(s) ocupada(s) este día
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-bone text-sm mb-2 flex items-center gap-2">
                <FaComment className="text-fire" /> Notas (opcional)
              </label>
              <textarea
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                className="input-horror w-full px-4 py-3 rounded-lg text-bone h-24 resize-none"
                placeholder="¿Algo especial que debamos saber?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-blood w-full py-4 rounded-lg text-bone font-semibold text-lg uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <FaCalendarAlt />
              {loading ? "Agendando..." : "Confirmar Cita"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}