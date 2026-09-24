import { X } from 'lucide-react';

export default function FotoModal({ 
  nuevaFoto, 
  setNuevaFoto, 
  setArchivoFoto, 
  onClose, 
  onGuardar 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">Subir Foto</h3>
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Subir imagen</label>
            <input 
              required 
              type="file" 
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => setArchivoFoto(e.target.files[0])} 
              className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-2.5 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#EAE2D6]/40 file:text-[#1A1412] hover:file:bg-[#EAE2D6] cursor-pointer" 
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Descripción (Opcional)</label>
            <input type="text" placeholder="Ej: Sala principal" value={nuevaFoto.descripcion} onChange={(e) => setNuevaFoto({...nuevaFoto, descripcion: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
          </div>
          <button type="submit" className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors">
            Guardar foto
          </button>
        </form>
      </div>
    </div>
  );
}