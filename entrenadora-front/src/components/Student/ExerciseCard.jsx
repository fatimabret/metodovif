import { Bookmark, PlayCircle } from 'lucide-react';

export default function ExerciseCard({ ejercicio, isFav, onToggleFavorite, onSelectVideo }) {
  return (
    <div 
      onClick={() => onSelectVideo(ejercicio)}
      className="bg-white rounded-[2rem] p-6 border-0 shadow-[0_12px_35px_-5px_rgba(135,120,110,0.12)] relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 flex flex-col group h-full"
    >
      <button 
        onClick={(e) => onToggleFavorite(e, ejercicio.id)}
        className="absolute top-5 left-5 p-2 bg-[#FAF7F2] rounded-full hover:bg-[#EAE2D6] transition-colors z-10"
      >
        <Bookmark 
          size={18} 
          strokeWidth={2} 
          className={isFav ? "fill-[#384230] text-[#384230]" : "text-[#5C524B]"} 
        />
      </button>

      <div className="absolute top-7 right-6 z-10">
        <span className="flex items-center gap-1.5 text-[#1A1412] text-[10px] font-bold uppercase tracking-widest group-hover:text-[#384230] transition-colors">
          Ver video <PlayCircle size={16} strokeWidth={2} />
        </span>
      </div>

      <div className="mt-14 flex-1 flex flex-col">
        <h3 className="text-2xl font-display font-semibold text-[#1A1412] mb-3 leading-tight">
          {ejercicio.titulo}
        </h3>
        
        <p className="text-[#5C524B] text-sm leading-relaxed mb-6">
          {ejercicio.descripcion}
        </p>
      </div>

      <div className="border-t border-[#EAE2D6] pt-5 mt-auto">
        <div className="flex flex-wrap gap-2">
          {ejercicio.disciplina && (
            <span className="bg-[#E5DCD0]/40 text-[#1A1412] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {ejercicio.disciplina}
            </span>
          )}
          {ejercicio.etiqueta && (
            <span className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#5C524B] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {ejercicio.etiqueta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}