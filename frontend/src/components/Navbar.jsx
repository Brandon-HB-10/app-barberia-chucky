import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCut, FaBars, FaTimes, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ logueado, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/citas", label: "Agendar Cita" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <>
      <div className="bg-blood-dark text-bone text-xs py-2 px-4 text-center flex items-center justify-center gap-6">
        <span className="flex items-center gap-1">
          <FaPhone className="text-fire text-xs" />
          241 140 1183
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <FaMapMarkerAlt className="text-fire text-xs" />
          Av. Cuauhtémoc 1501, Apizaco, Tlax.
        </span>
      </div>

      <nav
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark/95 backdrop-blur-md shadow-lg shadow-blood/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <FaCut className="text-fire text-2xl group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-creepster text-2xl text-bone tracking-wider group-hover:text-fire transition-colors">
                Chucky
              </span>
              <span className="font-inter text-sm text-bone-dark font-light tracking-widest uppercase">
                Barber Shop
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors relative group ${
                    location.pathname === link.to
                      ? "text-fire"
                      : "text-bone hover:text-fire"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-fire transition-all duration-300 ${
                      location.pathname === link.to ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
              {logueado && (
                <button
                  onClick={onLogout}
                  className="text-sm text-blood hover:text-fire transition-colors uppercase tracking-wide"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>

            <button
              className="md:hidden text-bone text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-lg pt-24"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-2xl font-creepster tracking-wider ${
                    location.pathname === link.to ? "text-fire" : "text-bone"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {logueado && (
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="text-2xl font-creepster text-blood"
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
