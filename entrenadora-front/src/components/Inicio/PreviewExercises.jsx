import { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import SectionHeader from '../Global/SectionHeader';
import VideoModal from '../Student/VideoModal';

export default function PreviewExercises({ ejercicios = [] }) {
  const [ejercicioAbierto, setEjercicioAbierto] = useState(null);
  const [videoEnModal, setVideoEnModal] = useState(null); 

  const toggleEjercicio = (id) => {
    setEjercicioAbierto(ejercicioAbierto === id ? null : id);
  };

  const handleAbrirVideo = (e, ej) => {
    e.stopPropagation();
    
    let yId = ej.video_url;
    try {
      const match = ej.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match && match[1]) yId = match[1];
    } catch (error) {}

    setVideoEnModal({
      titulo: ej.titulo,
      descripcion: ej.descripcion || "Ejercicio de muestra.",
      youtubeId: yId,
      nivel: "Prueba",
      duracion: "Muestra"
    });
  };

  return (
    <section id="ejercicios-prueba" className="w-full pt-16 md:pt-24 relative z-10">
      <SectionHeader eyebrow="MUESTRA" title="Ejercicios de prueba" />
      <div className="w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 mb-8 mt-[-1rem]">
        <p className="text-[#5C524B] font-medium text-sm md:text-base">
          Descubre cómo trabajo antes de comprometerte
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72">
        {ejercicios.length === 0 ? (
          <p className="text-center text-[#87786E] py-10">No hay ejercicios de muestra disponibles por el momento.</p>
        ) : (
          ejercicios.map((ej) => {
            const estaAbierto = ejercicioAbierto === ej.id_ejercicio;
            return (
              <div 
                key={ej.id_ejercicio} 
                onClick={() => toggleEjercicio(ej.id_ejercicio)}
                className="flex flex-col p-6 md:p-8 bg-white rounded-3xl border-0 shadow-lg shadow-black/5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/10 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold tracking-wide text-[#1A1412] mb-1">
                      {ej.titulo}
                    </h3>
                    <p className="text-[#5C524B] font-medium text-xs md:text-sm">
                      {ej.categoria?.titulo || "General"}
                    </p>
                  </div>
                  {estaAbierto ? (
                    <ChevronUp className="text-[#384230] transition-transform" strokeWidth={2} size={20} />
                  ) : (
                    <ChevronDown className="text-[#5C524B] transition-transform" strokeWidth={2} size={20} />
                  )}
                </div>

                {estaAbierto && (
                  <div className="mt-4 pt-4 border-t border-[#EAE2D6] flex flex-col">
                    <p className="text-[#5C524B] font-medium text-sm md:text-base leading-relaxed mb-4">
                      {ej.descripcion || "Sin descripción detallada."}
                    </p>
                    {ej.video_url && (
                      <div className="flex justify-start">
                        <span 
                          onClick={(e) => handleAbrirVideo(e, ej)} 
                          className="flex items-center gap-1.5 text-[#1A1412] hover:text-[#384230] text-[10px] font-bold uppercase tracking-widest transition-colors"
                        >
                          VER VIDEO <PlayCircle size={16} strokeWidth={2} />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <VideoModal video={videoEnModal} onClose={() => setVideoEnModal(null)} />
    </section>
  );
}