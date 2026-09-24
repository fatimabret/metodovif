import { useState } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

export default function StudentRutinas({ rutinas, plan, onSelectVideo }) {
  const [selectedRutina, setSelectedRutina] = useState(null);

  if (selectedRutina) {
    return (
      <div className="animate-slideUp px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 pt-4 pb-10">
        <button 
          onClick={() => setSelectedRutina(null)} 
          className="flex items-center gap-1.5 text-[#87786E] hover:text-[#1A1412] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Mis rutinas
        </button>

        <div className="mb-8">
          <span className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#87786E] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
            {selectedRutina.categoria}
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-[#1A1412] font-semibold mb-3">
            {selectedRutina.titulo}
          </h2>
          <p className="text-[#5C524B] text-sm md:text-base leading-relaxed">
            {selectedRutina.descripcion}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-4">
            {selectedRutina.ejercicios.length} EJERCICIOS
          </span>

          <div className="flex flex-col gap-4">
            {selectedRutina.ejercicios.map((ej, index) => (
              <div 
                key={ej.id} 
                onClick={() => onSelectVideo(ej)}
                className="group bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 shadow-[0_4px_20px_-10px_rgba(135,120,110,0.1)] cursor-pointer hover:border-[#D1BFA5] hover:shadow-md transition-all duration-300"
              >
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#384230] text-[#FAF7F2] flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#1A1412] text-[15px] font-bold leading-tight">{ej.titulo}</span>
                      {ej.nota && <span className="text-[#87786E] text-[11px] italic mt-1">{ej.nota}</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-bold pl-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[#1A1412] leading-none text-xl">{ej.series}</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#87786E] mt-0.5">series</span>
                    </div>
                    <span className="text-sm pb-2 font-normal text-[#87786E]">×</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[#1A1412] leading-none text-xl">{ej.repeticiones}</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#87786E] mt-0.5">reps</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#FAF7F2] mt-2">
                  <span className="flex items-center gap-1.5 text-[#1A1412] group-hover:text-[#384230] text-[10px] font-bold uppercase tracking-widest transition-colors">
                    VER VIDEO <PlayCircle size={16} strokeWidth={2} />
                  </span>
                </div>
                
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <span className="text-[#87786E] text-[10px] font-medium">
              {selectedRutina.fecha} · Vero Integral Fit
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 pt-4 pb-10">
      <h2 className="text-4xl font-display font-semibold text-[#1A1412] mb-1">Mis rutinas</h2>
      <p className="text-sm text-[#5C524B] mb-8">Personalizadas por Vero</p>

      {rutinas.length === 0 ? (
        <div className="bg-white border border-[#EAE2D6] rounded-[2rem] p-8 text-center shadow-sm">
          <p className="text-[#87786E] text-sm">Vero aún no te ha asignado rutinas para este mes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {rutinas.map(rutina => (
            <div 
              key={rutina.id_rutina} 
              onClick={() => setSelectedRutina(rutina)}
              className="bg-white border border-[#EAE2D6] rounded-[2rem] p-6 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#1A1412] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {rutina.categoria}
                </span>
                <span className="text-[#87786E] text-[10px] font-semibold">{rutina.fecha}</span>
              </div>
              
              <h3 className="text-xl font-display text-[#1A1412] font-semibold mb-2">
                {rutina.titulo}
              </h3>
              <p className="text-[#5C524B] text-sm mb-5 leading-relaxed line-clamp-2">
                {rutina.descripcion}
              </p>

              <div className="flex flex-wrap gap-2">
                {rutina.ejercicios.slice(0, 2).map(ej => (
                  <span key={ej.id} className="bg-white border border-[#EAE2D6] text-[#5C524B] text-[11px] font-medium px-3 py-1.5 rounded-full">
                    {ej.titulo} - {ej.series}x{ej.repeticiones}
                  </span>
                ))}
                {rutina.ejercicios.length > 2 && (
                  <span className="text-[#D1BFA5] text-[11px] font-bold px-1 py-1.5 flex items-center">
                    +{rutina.ejercicios.length - 2} más
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}