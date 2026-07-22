import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaClock, FaMapPin } from "react-icons/fa";

export default function Contacto() {
  return (
    <section id="contacto" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-creepster text-4xl sm:text-5xl text-bone mb-4 text-glow">
            Encuéntranos
          </h2>
          <p className="text-bone-dark text-lg">Estamos en Plaza del Parque, Apizaco</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-horror rounded-xl p-6 flex items-start gap-4"
            >
              <div className="bg-blood/20 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-fire text-xl" />
              </div>
              <div>
                <h3 className="font-creepster text-xl text-bone mb-1">Dirección</h3>
                <p className="text-bone-dark text-sm">
                  Av. Cuauhtémoc 1501-interior 103, Fátima, Plaza del Parque, 90300 Cdad. de Apizaco, Tlax.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-horror rounded-xl p-6 flex items-start gap-4"
            >
              <div className="bg-blood/20 p-3 rounded-lg">
                <FaPhone className="text-fire text-xl" />
              </div>
              <div>
                <h3 className="font-creepster text-xl text-bone mb-1">Teléfono</h3>
                <p className="text-bone-dark text-sm">241 140 1183</p>
                <a href="tel:2411401183" className="text-fire text-sm hover:underline mt-1 inline-block">
                  Llamar ahora
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-horror rounded-xl p-6 flex items-start gap-4"
            >
              <div className="bg-blood/20 p-3 rounded-lg">
                <FaClock className="text-fire text-xl" />
              </div>
              <div>
                <h3 className="font-creepster text-xl text-bone mb-1">Horario</h3>
                <p className="text-bone-dark text-sm">
                  Lunes a Domingo: 10:00 AM - 11:00 PM
                </p>
                <span className="text-poison text-xs">Abierto ahora</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-horror rounded-xl p-6 flex items-start gap-4"
            >
              <div className="bg-blood/20 p-3 rounded-lg">
                <FaMapPin className="text-fire text-xl" />
              </div>
              <div>
                <h3 className="font-creepster text-xl text-bone mb-1">Plus Code</h3>
                <p className="text-bone-dark text-sm">CV54+RC Cdad. de Apizaco, Tlaxcala</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-horror rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:h-full min-h-[400px] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-dark-light to-dark flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-fire text-6xl mx-auto mb-4 animate-bounce" />
                <p className="font-creepster text-2xl text-bone">Plaza del Parque</p>
                <p className="text-bone-dark text-sm mt-2">Apizaco, Tlaxcala</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Chucky+Barber+Shop+Apizaco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 btn-blood text-bone px-6 py-3 rounded-lg text-sm uppercase tracking-wider"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}