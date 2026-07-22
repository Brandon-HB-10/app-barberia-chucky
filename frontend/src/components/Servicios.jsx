import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock, FaTag, FaCut } from "react-icons/fa";
import api from "../axios";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/servicios")
      .then((res) => { setServicios(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const iconos = ["✂️", "🪒", "🧔", "🎨", "👑", "👶"];

  if (loading) {
    return (
      <section id="servicios" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse text-fire text-2xl font-creepster">Cargando servicios...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-creepster text-4xl sm:text-5xl text-bone mb-4 text-glow">
            Nuestros Servicios
          </h2>
          <p className="text-bone-dark text-lg max-w-2xl mx-auto">
            Cortes que te harán sentir como un verdadero asesino del estilo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => (
            <motion.div
              key={servicio.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card-horror rounded-xl p-6 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{iconos[index % iconos.length]}</span>
                <div className="flex items-center gap-1 text-fire">
                  <FaClock className="text-sm" />
                  <span className="text-sm font-medium">{servicio.duracion_min} min</span>
                </div>
              </div>

              <h3 className="font-creepster text-2xl text-bone mb-2 group-hover:text-fire transition-colors">
                {servicio.nombre}
              </h3>

              <p className="text-bone-dark text-sm mb-4 leading-relaxed">
                {servicio.descripcion}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-blood/20">
                <div className="flex items-center gap-2 text-fire">
                  <FaTag className="text-sm" />
                  <span className="font-creepster text-2xl">${servicio.precio}</span>
                </div>
                <div className="text-bone-dark text-xs flex items-center gap-1">
                  <FaCut className="text-fire" />
                  Disponible
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
