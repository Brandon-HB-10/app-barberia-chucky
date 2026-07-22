import Hero from "../components/Hero";
import Servicios from "../components/Servicios";
import Galeria from "../components/Galeria";
import Reviews from "../components/Reviews";
import Contacto from "../components/Contacto";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Servicios />
      <Galeria />
      <Reviews />
      <Contacto />
      <Footer />
    </div>
  );
}
