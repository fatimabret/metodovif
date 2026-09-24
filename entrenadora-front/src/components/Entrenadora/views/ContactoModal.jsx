import { X } from 'lucide-react';

export default function ContactoModal({ 
  contactoDraft, 
  setContactoDraft, 
  onClose, 
  onGuardar 
}) {
  // Determinamos si es edición detectando cualquiera de los dos IDs
  const isEditing = Boolean(contactoDraft.id_contacto || contactoDraft.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">
            {isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h3>
          <button type="button" onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Plataforma</label>
            <select required value={contactoDraft.plataforma} onChange={(e) => setContactoDraft({...contactoDraft, plataforma: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]">
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Correo">Correo Electrónico</option>
              <option value="Sitio Web">Sitio Web / Otro</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Texto Visible</label>
            <input required type="text" placeholder="Ej: +54 9 379... o @vero..." value={contactoDraft.valor_visible} onChange={(e) => setContactoDraft({...contactoDraft, valor_visible: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">URL de destino (Link)</label>
            <input required type="url" placeholder="https://..." value={contactoDraft.url_destino} onChange={(e) => setContactoDraft({...contactoDraft, url_destino: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" />
          </div>
          <button type="submit" className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors">
            {isEditing ? 'Actualizar contacto' : 'Guardar contacto'}
          </button>
        </form>
      </div>
    </div>
  );
}