import { motion } from "framer-motion";
import { FaCamera, FaInstagram } from "react-icons/fa";

const imagenes = [
  { tipo: "corte", desc: "Fade perfecto con diseño", emoji: "✂️" },
  { tipo: "barba", desc: "Barba delineada al ras", emoji: "🪒" },
  { tipo: "diseño", desc: "Diseño tribal en fade", emoji: "🎨" },
  { tipo: "premium", desc: "Corte premium completo", emoji: "👑" },
  { tipo: "infantil", desc: "Corte para pequeños", emoji: "👶" },
  { tipo: "combo", desc: "Corte + Barba combo", emoji: "🧔" },
];

export default function Galeria() {
  return (
    <section id="galeria" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-creepster text-4xl sm:text-5xl text-bone mb-4 text-glow">
            Galería de Trabajos
          </h2>
          <p className="text-bone-dark text-lg max-w-2xl mx-auto">
            Cada corte es una obra maestra del terror estilístico
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagenes.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-xl overflow-hidden card-horror group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dark-light to-dark flex items-center justify-center">
                <span className="text-6xl opacity-30 group-hover:opacity-60 transition-opacity group-hover:scale-110 transform duration-300">
                  {img.emoji}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blood/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-bone font-medium text-sm">{img.desc}</p>
                  <p className="text-fire text-xs uppercase tracking-wider">{img.tipo}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 text-bone/30 group-hover:text-fire transition-colors">
                <FaCamera className="text-lg" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a href="#" className="inline-flex items-center gap-2 text-bone-dark hover:text-fire transition-colors">
            <FaInstagram className="text-xl" />
            <span className="text-sm">Síguenos en Instagram para más trabajos</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
