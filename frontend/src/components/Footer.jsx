import { FaCut, FaHeart, FaInstagram, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark-light border-t border-blood/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaCut className="text-fire text-2xl" />
              <span className="font-creepster text-2xl text-bone">Chucky</span>
            </div>
            <p className="text-bone-dark text-sm">
              La barbería más terrorífica de Apizaco. Donde cada corte es una experiencia que te dejará sin aliento.
            </p>
          </div>

          <div>
            <h3 className="font-creepster text-xl text-bone mb-4">Enlaces</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-bone-dark hover:text-fire transition-colors text-sm">Inicio</Link>
              <Link to="/citas" className="text-bone-dark hover:text-fire transition-colors text-sm">Agendar Cita</Link>
              <Link to="/admin" className="text-bone-dark hover:text-fire transition-colors text-sm">Administrador</Link>
            </div>
          </div>

          <div>
            <h3 className="font-creepster text-xl text-bone mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-blood/20 p-3 rounded-lg text-bone hover:bg-fire hover:text-dark transition-all">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="bg-blood/20 p-3 rounded-lg text-bone hover:bg-fire hover:text-dark transition-all">
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blood/20 pt-8 text-center">
          <p className="text-bone-dark text-sm flex items-center justify-center gap-1">
            Hecho con <FaHeart className="text-blood" /> en Apizaco, Tlax. | Chucky Barber Shop © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
