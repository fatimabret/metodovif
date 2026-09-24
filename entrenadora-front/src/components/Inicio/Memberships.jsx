import SectionHeader from '../Global/SectionHeader';

export default function Memberships({ membresias = [], contactos = [] }) {

  const enviarWhatsApp = (tituloPlan) => {
    let listaContactos = [];
    if (Array.isArray(contactos)) {
      listaContactos = contactos;
    } else if (contactos?.data) {
      listaContactos = Array.isArray(contactos.data) ? contactos.data : (contactos.data.data || []);
    }

    if (listaContactos.length === 0) {
      alert("Error: No se encontraron contactos disponibles para enviar el mensaje de WhatsApp.");
      return;
    }

    const contactoWa = listaContactos.find(c => {
      const plat = (c.plataforma || '').toLowerCase();
      return plat.includes('whatsapp') || plat.includes('wsp');
    });

    if (!contactoWa) {
      alert("Error: No se encontró ningún contacto que se llame 'WhatsApp'.");
      return;
    }

    let enlaceDestino = contactoWa.url_destino || contactoWa.url || contactoWa.link || contactoWa.enlace || '';

    if (!enlaceDestino) {
      alert("Error: El contacto de WhatsApp existe pero la URL de destino está vacía.");
      return;
    }

    const mensaje = `¡Hola Vero! Me encantaría arrancar a entrenar. Estoy interesado en el *${tituloPlan}*. ¿Me darías más info y me contás cómo coordinamos el pago? ¡Gracias!`;
    const textoCodificado = encodeURIComponent(mensaje);

    const separador = enlaceDestino.includes('?') ? '&' : '?';
    const urlFinal = `${enlaceDestino.trim()}${separador}text=${textoCodificado}`;
    
    window.open(urlFinal, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="planes" className="w-full pt-16 md:pt-24 pb-32 relative z-10">
      <SectionHeader eyebrow="Membresias" title="Elige tu plan" />
      <div className="w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 mb-8 mt-[-1rem]">
        <p className="text-[#5C524B] text-sm md:text-base">La mejor planificacion para alcanzar tus objetivos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 w-full">
        {membresias.map((plan, index) => {
          const esPopular = Boolean(plan.es_popular);
          const esOscura = index % 2 !== 0;
          const caracteristicas = plan.descripcion ? plan.descripcion.split('\n').filter(línea => línea.trim() !== '') : [];

          return (
            <div key={plan.id_nivel} className={`relative flex flex-col transition-transform duration-300 hover:-translate-y-1 ${esOscura ? 'bg-[#384230] shadow-xl shadow-black/10' : 'bg-white shadow-lg shadow-black/5'} rounded-3xl p-6 md:p-8`}>
              
              {esPopular && (
                <span className="absolute top-6 right-6 bg-[#EAE2D6] text-[#1A1412] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Popular
                </span>
              )}

              <span className={`text-xs uppercase tracking-widest font-semibold mb-4 ${esOscura ? 'text-white/70' : 'text-[#5C524B]'}`}>
                {plan.titulo}
              </span>
              
              <div className="flex items-baseline gap-1 mb-2">
                <h3 className={`text-4xl md:text-5xl font-display ${esOscura ? 'text-white' : 'text-[#1A1412]'}`}>
                  ${plan.precio}
                </h3>
                <span className={`text-sm font-medium ${esOscura ? 'text-white/70' : 'text-[#5C524B]'}`}>
                  / mes
                </span>
              </div>

              <ul className="flex flex-col gap-4 mt-6 mb-10 flex-grow">
                {caracteristicas.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm md:text-base font-medium ${esOscura ? 'text-white' : 'text-[#1A1412]'}`}>
                    <div className={`w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0 ${esOscura ? 'bg-white/60' : 'bg-[#1A1412]/40'}`}></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => enviarWhatsApp(plan.titulo)}
                className={`w-full py-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-colors ${esOscura ? 'bg-[#EAE2D6] text-[#1A1412] hover:bg-white' : 'bg-[#384230] text-[#FAF7F2] hover:bg-[#2A3323]'}`}
              >
                Comenzar
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}