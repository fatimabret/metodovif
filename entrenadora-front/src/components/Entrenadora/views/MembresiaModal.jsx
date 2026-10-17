import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../../api'; // Verifica que esta ruta sea la correcta para tu estructura

export default function MembresiaModal({ 
  membresiaDraft, 
  setMembresiaDraft, 
  onClose, 
  onGuardar 
}) {
  const [catalogoCategorias, setCatalogoCategorias] = useState([]);
  const [cargandoCat, setCargandoCat] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        let data = res.data;
        if (!Array.isArray(data) && data.data) data = data.data;
        
        // Solo mostramos las activas
        const activas = Array.isArray(data) ? data.filter(c => c.activo) : [];
        setCatalogoCategorias(activas);
      } catch (error) {
        console.error("Error al cargar disciplinas", error);
      } finally {
        setCargandoCat(false);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!membresiaDraft.categorias) {
      setMembresiaDraft(prev => ({ ...prev, categorias: [] }));
    }
  }, [membresiaDraft.categorias, setMembresiaDraft]);

  const handleCheckboxChange = (id_categoria) => {
    setMembresiaDraft(prev => {
      const actuales = prev.categorias || [];
      if (actuales.includes(id_categoria)) {
        return { ...prev, categorias: actuales.filter(id => id !== id_categoria) };
      } else {
        return { ...prev, categorias: [...actuales, id_categoria] };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4">
      <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp max-h-[90vh]">
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-display text-[#1A1412] font-semibold">
            {membresiaDraft.id_nivel ? 'Editar Membresía' : 'Nueva Membresía'}
          </h3>
          <button type="button" onClick={onClose} className="text-[#87786E] hover:text-[#1A1412]">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onGuardar} className="p-6 flex flex-col gap-4 overflow-y-auto">
          
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">
              Nombre del plan
            </label>
            <input 
              required 
              type="text" 
              placeholder="Ej: Esencial, Integral..." 
              value={membresiaDraft.titulo} 
              onChange={(e) => setMembresiaDraft({...membresiaDraft, titulo: e.target.value})} 
              className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">
              ¿Qué incluye? (Descripción)
            </label>
            <textarea 
              required 
              rows="3" 
              placeholder="Acceso a videos, rutinas personalizadas..." 
              value={membresiaDraft.descripcion} 
              onChange={(e) => setMembresiaDraft({...membresiaDraft, descripcion: e.target.value})} 
              className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] resize-none" 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">
              Precio mensual ($)
            </label>
            <input 
              required 
              type="number" 
              min="0" 
              step="0.01" 
              placeholder="Ej: 35" 
              value={membresiaDraft.precio} 
              onChange={(e) => setMembresiaDraft({...membresiaDraft, precio: e.target.value})} 
              className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230]" 
            />
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#EAE2D6] p-4 rounded-xl">
            <input 
              type="checkbox" 
              id="toggleRutinas"
              checked={membresiaDraft.incluye_rutinas || false}
              onChange={(e) => setMembresiaDraft({...membresiaDraft, incluye_rutinas: e.target.checked})}
              className="w-5 h-5 accent-[#384230] cursor-pointer"
            />
            <label htmlFor="toggleRutinas" className="text-[#1A1412] text-sm font-bold cursor-pointer">
              Rutinas personalizadas
            </label>
          </div>

          {/* SECCIÓN NUEVA: Checkboxes de Categorías */}
          <div className="mt-2 border-t border-[#EAE2D6] pt-4">
            <label className="block text-[10px] font-bold text-[#87786E] uppercase tracking-widest mb-3">
              Disciplinas incluidas (Biblioteca de videos)
            </label>
            
            {cargandoCat ? (
              <span className="text-xs text-[#87786E]">Cargando disciplinas...</span>
            ) : catalogoCategorias.length === 0 ? (
              <span className="text-xs text-[#D97777]">No hay disciplinas activas en el sistema.</span>
            ) : (
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#EAE2D6]">
                {catalogoCategorias.map(cat => {
                  const idCat = cat.id_categoria || cat.id;
                  const isChecked = (membresiaDraft.categorias || []).includes(idCat);
                  
                  return (
                    <label key={idCat} className="flex items-center gap-2.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => handleCheckboxChange(idCat)}
                        className="accent-[#384230] w-4 h-4 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-[13px] font-semibold text-[#5C524B] group-hover:text-[#1A1412] transition-colors truncate">
                        {cat.titulo}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <button type="submit" className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#2A3323] transition-colors flex-shrink-0">
            {membresiaDraft.id_nivel ? 'Guardar cambios' : 'Crear membresía'}
          </button>
        </form>
      </div>
    </div>
  );
}