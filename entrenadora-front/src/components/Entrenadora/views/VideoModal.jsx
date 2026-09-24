import { X } from 'lucide-react';

export default function VideoModal({ 
  videoDraft, 
  setVideoDraft, 
  categoriasData, 
  etiquetasData, 
  onClose, 
  onGuardar 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp max-h-[90vh]">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center z-10">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">
            {videoDraft.id_ejercicio ? 'Editar Video' : 'Nuevo Video'}
          </h3>
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412]"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto">
          <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Título</label>
              <input required type="text" value={videoDraft.titulo} onChange={(e) => setVideoDraft({...videoDraft, titulo: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Disciplina</label>
                <select required value={videoDraft.id_categoria} onChange={(e) => setVideoDraft({...videoDraft, id_categoria: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]">
                    <option value="">Seleccionar...</option>
                    {categoriasData.map(cat => (
                        <option key={cat.id_categoria || cat.id} value={cat.id_categoria || cat.id}>
                        {cat.titulo}
                        </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center justify-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={videoDraft.es_de_prueba} onChange={(e) => setVideoDraft({...videoDraft, es_de_prueba: e.target.checked})} className="w-4 h-4 accent-[#384230]" />
                  <span className="text-xs text-[#1A1412] font-semibold">Video de prueba</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-2 block">Etiquetas transversales</label>
              <div className="flex flex-wrap gap-2">
                {etiquetasData.map(tag => (
                  <button 
                    key={tag.id_etiqueta} type="button"
                    onClick={() => {
                      const isSelected = videoDraft.id_etiquetas.includes(tag.id_etiqueta);
                      setVideoDraft({
                        ...videoDraft,
                        id_etiquetas: isSelected 
                          ? videoDraft.id_etiquetas.filter(id => id !== tag.id_etiqueta)
                          : [...videoDraft.id_etiquetas, tag.id_etiqueta]
                      });
                    }}
                    className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${
                      videoDraft.id_etiquetas.includes(tag.id_etiqueta)
                        ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]'
                        : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'
                    }`}
                  >
                    {tag.titulo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Enlace de YouTube</label>
              <input required type="url" value={videoDraft.video_url} onChange={(e) => setVideoDraft({...videoDraft, video_url: e.target.value})} placeholder="https://youtu.be/..." className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Descripción</label>
              <textarea rows="3" value={videoDraft.descripcion} onChange={(e) => setVideoDraft({...videoDraft, descripcion: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] resize-none" />
            </div>
            <button type="submit" className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors">
              Guardar ejercicio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}