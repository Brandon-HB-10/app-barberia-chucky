import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const telefono = "522411401183"; // Número con código de país (52 = México)
  const mensaje = "¡Hola! Quiero agendar una cita en Chucky Barber Shop 🪒";
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 animate-bounce"
      style={{ animationDuration: "3s" }}
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}