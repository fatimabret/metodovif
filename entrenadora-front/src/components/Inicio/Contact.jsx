import { MessageCircle, Mail, Globe } from 'lucide-react';
import SectionHeader from '../Global/SectionHeader';

const IconoInstagram = ({ size = 20, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const getIcono = (plataforma = '') => {
  const nombre = (plataforma || '').toLowerCase();
  if (nombre.includes('whatsapp') || nombre.includes('wsp')) return MessageCircle;
  if (nombre.includes('instagram') || nombre.includes('ig')) return IconoInstagram;
  if (nombre.includes('email') || nombre.includes('correo')) return Mail;
  return Globe;
};

export default function Contact({ contactos = [] }) {
  return (
    <section id="contacto" className="w-full pt-16 md:pt-24 pb-32">
      <SectionHeader eyebrow="Cuéntame tus objetivos y diseñamos juntos tu plan ideal" highlight="Mis contactos" />

      <div className="flex flex-col gap-4 w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72">
        {contactos.map((canal) => {
          const plataformaText = canal.plataforma || 'Contacto';
          const usuarioText = canal.valor_visible || '';
          let enlaceDestino = canal.url_destino || canal.url || canal.link || canal.enlace || canal.href || '#';
          
          if (plataformaText.toLowerCase().includes('whatsapp')) {
            const mensaje = "¡Hola Vero! Me encantaría hacerte una consulta para empezar a entrenar. ¿Podrías darme más info? ¡Gracias!";
            const textoCodificado = encodeURIComponent(mensaje);
            
            const separador = enlaceDestino.includes('?') ? '&' : '?';
            enlaceDestino = `${enlaceDestino.trim()}${separador}text=${textoCodificado}`;
          }
          
          const IconoComponente = getIcono(plataformaText);

          return (
            <a 
              key={canal.id_contacto || canal.id} 
              href={enlaceDestino}
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center p-5 md:p-6 bg-transparent border border-[#EAE2D6] rounded-2xl md:rounded-3xl hover:border-[#384230] hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#EAE2D6] flex items-center justify-center text-[#5C524B] group-hover:bg-[#384230] group-hover:border-[#384230] group-hover:text-[#FAF7F2] transition-colors flex-shrink-0 mr-4 md:mr-6">
                <IconoComponente strokeWidth={1.5} size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs text-[#5C524B] uppercase tracking-widest font-medium mb-1">
                  {plataformaText}
                </span>
                <span className="text-base md:text-lg text-[#1A1412] font-medium group-hover:text-[#384230] transition-colors">
                  {usuarioText}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}