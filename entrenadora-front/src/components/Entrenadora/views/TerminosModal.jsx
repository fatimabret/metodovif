import { X, Plus, Trash2 } from 'lucide-react';

export default function TerminosModal({ 
  terminosDraft, 
  setTerminosDraft, 
  onClose, 
  onGuardar 
}) {

  const handleAddTermino = () => {
    setTerminosDraft([...terminosDraft, { titulo: '', descripcion: '' }]);
  };

  const handleTerminoChange = (index, field, value) => {
    const nuevos = [...terminosDraft];
    nuevos[index][field] = value;
    setTerminosDraft(nuevos);
  };

  const handleRemoveTermino = (index) => {
    setTerminosDraft(terminosDraft.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp max-h-[90vh]">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center z-10 flex-shrink-0">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">Términos y Condiciones</h3>
          <button type="button" onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#5C524B]">Configura las secciones que tus alumnas verán al registrarse.</p>
            <button type="button" onClick={handleAddTermino} className="bg-[#EAE2D6]/40 hover:bg-[#EAE2D6] text-[#1A1412] text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 border border-[#EAE2D6]">
              <Plus size={14} /> Añadir sección
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {terminosDraft.length === 0 ? (
              <div className="bg-white border border-[#EAE2D6] p-8 rounded-2xl text-center shadow-sm">
                <p className="text-sm text-[#87786E]">Aún no has configurado tus términos.</p>
              </div>
            ) : (
              terminosDraft.map((seccion, index) => (
                <div key={index} className="bg-white border border-[#EAE2D6] p-5 rounded-2xl flex flex-col gap-3 relative shadow-sm group">
                  <button type="button" onClick={() => handleRemoveTermino(index)} className="absolute top-4 right-4 text-[#D9D0C5] hover:text-[#D97777] transition-colors">
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="pr-8">
                    <input 
                      type="text" 
                      placeholder="Ej: 1. Aceptación de los Términos" 
                      value={seccion.titulo} 
                      onChange={(e) => handleTerminoChange(index, 'titulo', e.target.value)} 
                      className="w-full bg-transparent text-[#1A1412] text-sm font-bold placeholder:font-normal focus:outline-none mb-3 border-b border-[#EAE2D6] pb-2" 
                      required
                    />
                    <textarea 
                      rows="4" 
                      placeholder="Escribe el detalle aquí..." 
                      value={seccion.descripcion} 
                      onChange={(e) => handleTerminoChange(index, 'descripcion', e.target.value)} 
                      className="w-full bg-[#FAF7F2] border border-[#EAE2D6] rounded-xl p-3 text-sm text-[#5C524B] focus:outline-none focus:border-[#384230] resize-y"
                      required
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <button type="button" onClick={onGuardar} className="mt-6 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors shadow-md">
            Guardar documento
          </button>
        </div>
      </div>
    </div>
  );
}