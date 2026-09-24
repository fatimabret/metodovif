import { X } from 'lucide-react';

export default function PerfilModal({ 
  perfilDraft, 
  setPerfilDraft, 
  setArchivoPerfil, 
  onClose, 
  onGuardar 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp max-h-[90vh]">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center z-10">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">Editar Perfil</h3>
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto">
          <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Actualizar Foto (Opcional)</label>
              <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => setArchivoPerfil(e.target.files[0])} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-2.5 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#EAE2D6]/40 file:text-[#1A1412] hover:file:bg-[#EAE2D6] cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Título Principal</label>
              <input required type="text" value={perfilDraft.titulo_principal || ''} onChange={(e) => setPerfilDraft({...perfilDraft, titulo_principal: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Biografía</label>
              <textarea required rows="4" value={perfilDraft.biografia || ''} onChange={(e) => setPerfilDraft({...perfilDraft, biografia: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Años exp.</label>
                <input required type="text" value={perfilDraft.anos_experiencia || ''} onChange={(e) => setPerfilDraft({...perfilDraft, anos_experiencia: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#384230] text-center" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Alumnas</label>
                <input required type="text" value={perfilDraft.cantidad_alumnas || ''} onChange={(e) => setPerfilDraft({...perfilDraft, cantidad_alumnas: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#384230] text-center" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Disciplinas</label>
                <input required type="text" value={perfilDraft.cantidad_disciplinas || ''} onChange={(e) => setPerfilDraft({...perfilDraft, cantidad_disciplinas: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#384230] text-center" />
              </div>
            </div>
            <button type="submit" className="mt-4 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors">
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}