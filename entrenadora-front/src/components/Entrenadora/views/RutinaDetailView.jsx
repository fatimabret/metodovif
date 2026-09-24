import { ArrowLeft, Pencil } from 'lucide-react';

export default function RutinaDetailView({ rutina, onBack, onEdit, onDesvincular }) {
  if (!rutina) return null;

  return (
    <div className="animate-slideUp pb-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#87786E] hover:text-[#1A1412] text-sm font-medium mb-6 transition-colors">
        <ArrowLeft size={16} /> Volver a la alumna
      </button>

      <div className="mb-6 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#87786E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {rutina.categoria}
          </span>
          <button onClick={onEdit} className="w-8 h-8 rounded-full border border-[#EAE2D6] flex items-center justify-center text-[#87786E] hover:text-[#1A1412] hover:bg-[#FAF7F2] transition-colors shadow-sm">
            <Pencil size={14} />
          </button>
        </div>
        
        <h2 className="text-3xl font-display text-[#1A1412] font-semibold mb-2">{rutina.titulo}</h2>
        <p className="text-[#87786E] text-sm leading-relaxed">{rutina.descripcion}</p>
      </div>

      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-3">
          {rutina.ejercicios?.length || 0} EJERCICIOS
        </span>

        <div className="flex flex-col gap-3">
          {rutina.ejercicios?.map((ej, index) => {
            const series = ej.pivot?.series || ej.series || 4;
            const repeticiones = ej.pivot?.repeticiones || ej.repeticiones || '12';
            const nota = ej.pivot?.nota || ej.nota || '';

            return (
              <div key={ej.id_ejercicio} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#384230] text-[#FAF7F2] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-[#1A1412] text-[15px] font-bold">{ej.titulo}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#D1BFA5] font-bold">
                    <div className="flex flex-col items-center">
                      <span className="text-[#1A1412] leading-none text-base">{series}</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#87786E] mt-0.5">series</span>
                    </div>
                    <span className="text-sm pb-2">×</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[#D1BFA5] leading-none text-base">{repeticiones}</span>
                      <span className="text-[8px] uppercase tracking-wider text-[#87786E] mt-0.5">reps</span>
                    </div>
                  </div>
                </div>

                {nota && (
                  <div className="ml-[42px] bg-[#FAF7F2] border border-[#EAE2D6] rounded-lg p-2.5 text-xs text-[#5C524B]">
                    <span className="font-bold text-[#87786E] uppercase tracking-wider text-[9px] block mb-0.5">
                      Nota: {nota}
                    </span>
                  </div>
                )}
                
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onDesvincular} 
          className="w-full bg-[#FFF5F5] hover:bg-[#FFEAEA] text-[#D97777] text-sm font-semibold py-3.5 rounded-2xl transition-colors shadow-sm"
        >
          Quitar rutina a esta alumna
        </button>
      </div>
    </div>
  );
}