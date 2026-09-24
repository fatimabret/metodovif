import { X } from 'lucide-react';

export default function CategoriaModal({ 
  categoriaDraft, 
  setCategoriaDraft, 
  onClose, 
  onGuardar 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">
            {categoriaDraft.id_categoria ? 'Editar Disciplina' : 'Nueva Disciplina'}
          </h3>
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412]"><X size={20} /></button>
        </div>
        <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Título de la disciplina</label>
            <input required type="text" placeholder="Ej: Pilates, Funcional, etc." value={categoriaDraft.titulo} onChange={(e) => setCategoriaDraft({...categoriaDraft, titulo: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Descripción breve</label>
            <textarea required rows="3" placeholder="De qué trata esta disciplina..." value={categoriaDraft.descripcion} onChange={(e) => setCategoriaDraft({...categoriaDraft, descripcion: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] resize-none" />
          </div>
          <button type="submit" className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors">
            {categoriaDraft.id_categoria ? 'Guardar cambios' : 'Crear disciplina'}
          </button>
        </form>
      </div>
    </div>
  );
}