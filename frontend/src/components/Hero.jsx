import { motion } from "framer-motion";
import { FaCut, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24">
      <div className="absolute inset-0 bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blood rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-fire rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-poison rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(139, 0, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 0, 0, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-blood/20 border border-blood/30 rounded-full px-4 py-2 mb-8"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-fire text-sm" />
            ))}
          </div>
          <span className="text-bone text-sm font-medium">4.9 (103 opiniones)</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-creepster text-6xl sm:text-8xl lg:text-9xl text-bone mb-4 text-glow"
        >
          Chucky
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-inter text-2xl sm:text-3xl lg:text-4xl text-fire font-light tracking-[0.3em] uppercase mb-6"
        >
          Barber Shop
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-bone-dark text-lg sm:text-xl max-w-2xl mx-auto mb-4"
        >
          Donde el estilo se encuentra con el terror
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-bone-dark/60 text-sm max-w-xl mx-auto mb-12"
        >
          Av. Cuauhtémoc 1501, Plaza del Parque, Apizaco, Tlax. | Abierto hasta las 11 PM
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/citas"
            className="btn-blood text-bone font-semibold px-8 py-4 rounded-lg flex items-center gap-3 text-lg uppercase tracking-wider"
          >
            <FaCalendarAlt />
            Agendar Cita
          </Link>
          <a
            href="tel:2411401183"
            className="border border-bone/30 text-bone hover:border-fire hover:text-fire px-8 py-4 rounded-lg flex items-center gap-3 text-lg uppercase tracking-wider transition-all duration-300"
          >
            <FaCut />
            Llamar Ahora
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 inline-flex items-center rounded-full p-[2px]"
          style={{
            background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)'
          }}
        >
          <div className="bg-dark rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-sm font-medium text-bone">Amigable con LGBTQ+</span>
            <span className="text-lg">🏳️‍🌈</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-bone/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-fire rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}