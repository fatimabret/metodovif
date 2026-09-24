import { useState, useRef } from 'react';
import { X, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import api from '../../../api';

export default function TestimonioModal({ testimonioDraft, setTestimonioDraft, onClose, onGuardar }) {
  const fileInputRef = useRef(null);

  const totalFotos = (testimonioDraft.imagenes?.length || 0) + (testimonioDraft.fotos?.length || 0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const disponibles = 2 - totalFotos;

    if (disponibles <= 0) {
      alert('Solo se permiten hasta 2 fotos por testimonio.');
      return;
    }

    const archivosPermitidos = files.slice(0, disponibles);
    
    if (files.length > disponibles) {
      alert(`Solo se permiten 2 fotos en total. Se han añadido solo ${disponibles}.`);
    }

    setTestimonioDraft(prev => ({ ...prev, fotos: [...(prev.fotos || []), ...archivosPermitidos] }));
  };

  const handleEliminarFotoExistente = async (idImagen) => {
    if (!confirm('¿Estás segura de eliminar esta foto?')) return;
    
    try {
      await api.delete(`/testimonios-imagenes/${idImagen}`);
      setTestimonioDraft(prev => ({
        ...prev,
        imagenes: prev.imagenes.filter(img => img.id_imagen !== idImagen)
      }));
    } catch (err) {
      console.error("Error al eliminar la imagen:", err);
      alert("No se pudo eliminar la foto.");
    }
  };

  const handleEliminarFotoNueva = (index) => {
    setTestimonioDraft(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-[#EAE2D6] rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-display text-[#1A1412]">
            {testimonioDraft.id_testimonio ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#87786E] hover:text-[#1A1412] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onGuardar} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#87786E] font-bold mb-1.5">
              Nombre del Alumno (Opcional)
            </label>
            <input 
              type="text" 
              placeholder="Ej: Sofía Gómez"
              value={testimonioDraft.nombre_alumna || ''}
              onChange={(e) => setTestimonioDraft({ ...testimonioDraft, nombre_alumna: e.target.value })}
              className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-[#87786E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#87786E] font-bold mb-1.5">
              Título del Cambio / Testimonio (Opcional)
            </label>
            <input 
              type="text" 
              placeholder="Ej: Cambio de hábitos y constancia"
              value={testimonioDraft.titulo || ''}
              onChange={(e) => setTestimonioDraft({ ...testimonioDraft, titulo: e.target.value })}
              className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-[#87786E] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#87786E] font-bold mb-1.5">
              Descripción (Historia / Comentarios)
            </label>
            <textarea 
              rows="4"
              placeholder="Escribe la experiencia o detalles de la transformación..."
              value={testimonioDraft.descripcion || ''}
              onChange={(e) => setTestimonioDraft({ ...testimonioDraft, descripcion: e.target.value })}
              className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm rounded-xl p-4 focus:outline-none focus:border-[#87786E] transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold">
                Fotos del Testimonio ({totalFotos} de 2)
              </span>
              
              {totalFotos < 2 && (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#87786E] hover:text-[#1A1412] text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Añadir foto
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {testimonioDraft.imagenes?.map(img => (
                <div key={img.id_imagen} className="relative group bg-white border border-[#EAE2D6] p-1.5 rounded-[1.25rem] shadow-sm">
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-[#FAF7F2] relative">
                    <img src={img.url_foto} alt="Testimonio" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#1A1412]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => handleEliminarFotoExistente(img.id_imagen)} 
                        className="bg-white text-[#D97777] p-2 rounded-full shadow-lg hover:bg-[#D97777] hover:text-white transition-colors"
                        title="Eliminar foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {testimonioDraft.fotos?.map((file, idx) => (
                <div key={`nueva-${idx}`} className="relative group bg-white border border-[#EAE2D6] p-1.5 rounded-[1.25rem] shadow-sm">
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-[#FAF7F2] relative">
                    <img src={URL.createObjectURL(file)} alt="Nueva foto" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#1A1412]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => handleEliminarFotoNueva(idx)} 
                        className="bg-white text-[#D97777] p-2 rounded-full shadow-lg hover:bg-[#D97777] hover:text-white transition-colors"
                        title="Quitar foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {totalFotos < 2 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[124px] border-2 border-dashed border-[#D9D0C5] hover:border-[#87786E] rounded-[1.25rem] flex flex-col items-center justify-center gap-2 text-[#87786E] hover:text-[#5C524B] hover:bg-white transition-all bg-[#FAF7F2]/40"
                >
                  <ImageIcon size={22} strokeWidth={1.5} />
                  <span className="text-xs font-medium">Subir foto</span>
                </button>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              multiple 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#EAE2D6]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold text-[#5C524B] hover:bg-[#FAF7F2] transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#384230] text-[#FAF7F2] rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#2A3323] transition-colors shadow-sm"
            >
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}