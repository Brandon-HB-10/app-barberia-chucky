import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const reviews = [
  { nombre: "Carlos M.", estrellas: 5, texto: "Excelente servicio, muy profesional y buen trato 🤙🏼", fecha: "hace 2 días" },
  { nombre: "Luis R.", estrellas: 5, texto: "Gran atención, es muy bueno y te atienden rapido y chido", fecha: "hace 1 semana" },
  { nombre: "Ana G.", estrellas: 5, texto: "El mejor corte que me han hecho en Apizaco. 100% recomendado", fecha: "hace 2 semanas" },
  { nombre: "Miguel T.", estrellas: 5, texto: "Ambiente chido, música buena y el corte quedó perfecto", fecha: "hace 3 semanas" },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-creepster text-4xl sm:text-5xl text-bone mb-4 text-glow">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-creepster text-5xl text-fire">4.9</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-fire text-xl" />
              ))}
            </div>
          </div>
          <p className="text-bone-dark">103 opiniones en Google Maps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-horror rounded-xl p-6 relative"
            >
              <FaQuoteLeft className="text-blood/20 text-4xl absolute top-4 left-4" />
              <div className="flex items-center gap-1 mb-3 mt-2">
                {[...Array(review.estrellas)].map((_, i) => (
                  <FaStar key={i} className="text-fire text-sm" />
                ))}
              </div>
              <p className="text-bone mb-4 relative z-10">{review.texto}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-fire font-medium">{review.nombre}</span>
                <span className="text-bone-dark">{review.fecha}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
