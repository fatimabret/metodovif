import { useState } from 'react';
import { X, Search, Plus, Edit3, ArrowRight } from 'lucide-react';

export default function RutinaModal({ onClose, catalogoEjercicios, catalogoCategorias, onGuardarRutina, rutinaAEditar }) {
  const [activeTab, setActiveTab] = useState('info'); 
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [rutinaDraft, setRutinaDraft] = useState(() => {
    if (rutinaAEditar) {
      return {
        ...rutinaAEditar,
        ejercicios: rutinaAEditar.ejercicios.map(ej => ({ 
          ...ej, 
          series: ej.pivot?.series || ej.series || 4,
          repeticiones: ej.pivot?.repeticiones || ej.repeticiones || '12',
          nota: ej.pivot?.nota || ej.nota || '',
          isEditing: false 
        }))
      };
    }
    return { 
      titulo: '', 
      descripcion: '', 
      categoria: catalogoCategorias && catalogoCategorias.length > 0 ? catalogoCategorias[0].titulo : '', 
      ejercicios: [] 
    };
  });

  const handleAddEjercicio = (ejercicio) => {
    setRutinaDraft(prev => ({
      ...prev,
      ejercicios: [...prev.ejercicios, { ...ejercicio, series: 4, repeticiones: '12', nota: '', isEditing: true }]
    }));
    setShowSelector(false);
    setSearchTerm('');
  };

  const updateEjercicio = (id_ejercicio, field, value) => {
    setRutinaDraft(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.map(ej => ej.id_ejercicio === id_ejercicio ? { ...ej, [field]: value } : ej)
    }));
  };

  const toggleEdit = (id_ejercicio, editingState) => {
    setRutinaDraft(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.map(ej => ej.id_ejercicio === id_ejercicio ? { ...ej, isEditing: editingState } : ej)
    }));
  };

  const removeEjercicio = (id_ejercicio) => {
    setRutinaDraft(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.filter(ej => ej.id_ejercicio !== id_ejercicio)
    }));
  };

  const handleGuardar = () => {
    const rutinaLimpia = {
      ...rutinaDraft,
      ejercicios: rutinaDraft.ejercicios.map(ej => ({
        id_ejercicio: ej.id_ejercicio,
        series: parseInt(ej.series, 10) || 1, 
        repeticiones: String(ej.repeticiones), 
        nota: ej.nota || ''
      }))
    };
    onGuardarRutina(rutinaLimpia);
  };

  const ejerciciosFiltrados = catalogoEjercicios.filter(ej => 
    ej.titulo.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !rutinaDraft.ejercicios.some(draft => draft.id_ejercicio === ej.id_ejercicio)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#384230]/40 backdrop-blur-sm flex justify-center items-end sm:items-center animate-fadeIn">
      <div className="bg-[#FAF7F2] w-full h-[90vh] sm:h-[650px] sm:max-h-[85vh] sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col animate-slideUp relative overflow-hidden">
        
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center rounded-t-[2rem] z-10 relative">
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412]"><X size={24} strokeWidth={1.5} /></button>
          <h3 className="text-lg font-display text-[#1A1412] font-semibold truncate px-4">
            {rutinaAEditar ? rutinaAEditar.titulo : 'Nueva rutina'}
          </h3>
          <button onClick={handleGuardar} className="bg-[#D1BFA5] hover:bg-[#C2AE92] text-[#1A1412] text-xs font-bold px-4 py-2 rounded-full transition-colors">Guardar</button>
        </div>

        <div className="bg-white px-6 py-3 flex gap-2 border-b border-[#EAE2D6] z-10 relative">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-colors ${activeTab === 'info' ? 'bg-[#FAF7F2] text-[#1A1412] shadow-sm' : 'text-[#87786E] hover:bg-[#FAF7F2]/50'}`}>① Información</button>
          <button onClick={() => setActiveTab('ejercicios')} className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-colors ${activeTab === 'ejercicios' ? 'bg-[#FAF7F2] text-[#1A1412] shadow-sm' : 'text-[#87786E] hover:bg-[#FAF7F2]/50'}`}>② Ejercicios ({rutinaDraft.ejercicios.length})</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 z-0 relative">
          {activeTab === 'info' ? (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Título</label>
                <input type="text" placeholder="Ej: Fuerza de piernas semana 1" value={rutinaDraft.titulo} onChange={(e) => setRutinaDraft({...rutinaDraft, titulo: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Descripción</label>
                <textarea rows="3" placeholder="Instrucciones generales..." value={rutinaDraft.descripcion} onChange={(e) => setRutinaDraft({...rutinaDraft, descripcion: e.target.value})} className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] shadow-sm resize-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-2 block">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {catalogoCategorias?.map(cat => (
                    <button 
                      key={cat.id_categoria || cat.id} 
                      type="button" 
                      onClick={() => setRutinaDraft({...rutinaDraft, categoria: cat.titulo})} 
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${rutinaDraft.categoria === cat.titulo ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-white text-[#5C524B] border-[#EAE2D6] hover:border-[#87786E]'}`}
                    >
                      {cat.titulo}
                    </button>
                  ))}
                  {(!catalogoCategorias || catalogoCategorias.length === 0) && (
                    <span className="text-xs text-[#87786E] italic">No hay categorías cargadas en el sistema.</span>
                  )}
                </div>
              </div>
              <button onClick={() => setActiveTab('ejercicios')} className="mt-4 w-full bg-[#384230] text-[#FAF7F2] text-sm font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-[#2A3323] transition-colors">
                Continuar <ArrowRight size={16} /> Añadir ejercicios
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-[#87786E] font-bold">{rutinaDraft.ejercicios.length} EJERCICIOS</span>
                <button onClick={() => setShowSelector(true)} className="text-[#D1BFA5] hover:text-[#C2AE92] text-xs font-bold flex items-center gap-1"><Plus size={14} /> Añadir ejercicio</button>
              </div>

              {rutinaDraft.ejercicios.length === 0 ? (
                <div className="bg-[#EBE5DE]/50 rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-[#EAE2D6]/50">
                  <h4 className="text-[#1A1412] font-display text-lg mb-1">Sin ejercicios aún</h4>
                  <p className="text-[#87786E] text-xs">Toca "Añadir ejercicio" para comenzar</p>
                </div>
              ) : (
                rutinaDraft.ejercicios.map((ej, index) => (
                  <div key={ej.id_ejercicio} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 shadow-sm">
                    {ej.isEditing ? (
                      <div className="flex flex-col gap-3 animate-fadeIn">
                        <h4 className="text-[#1A1412] font-bold text-sm mb-1">{ej.titulo}</h4>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-[#87786E] block mb-1">Series</label>
                            <input 
                              type="number" 
                              min="1"
                              value={ej.series} 
                              onChange={(e) => updateEjercicio(ej.id_ejercicio, 'series', e.target.value)} 
                              onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',') {
                                  e.preventDefault();
                                }
                              }}
                              onBlur={(e) => {
                                if (!e.target.value || parseInt(e.target.value) < 1) {
                                  updateEjercicio(ej.id_ejercicio, 'series', 1);
                                }
                              }}
                              className="w-full bg-white border border-[#EAE2D6] rounded-lg px-3 py-2 text-sm text-[#1A1412] font-semibold focus:outline-none focus:border-[#384230]" 
                            />
                          </div>

                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-[#87786E] block mb-1">Reps/Tiempo</label>
                            <input type="text" value={ej.repeticiones} onChange={(e) => updateEjercicio(ej.id_ejercicio, 'repeticiones', e.target.value)} className="w-full bg-white border border-[#EAE2D6] rounded-lg px-3 py-2 text-sm text-[#1A1412] font-semibold focus:outline-none focus:border-[#384230]" />
                          </div>
                        </div>
                        <div>
                          <input type="text" placeholder="Nota (opcional)" value={ej.nota} onChange={(e) => updateEjercicio(ej.id_ejercicio, 'nota', e.target.value)} className="w-full bg-white border border-[#EAE2D6] rounded-lg px-3 py-2 text-sm text-[#87786E] focus:outline-none focus:border-[#384230]" />
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => toggleEdit(ej.id_ejercicio, false)} className="flex-1 bg-[#384230] hover:bg-[#2A3323] text-[#FAF7F2] text-xs font-bold py-2.5 rounded-xl transition-colors">Confirmar</button>
                          <button onClick={() => removeEjercicio(ej.id_ejercicio)} className="flex-1 bg-[#FFF5F5] text-[#D97777] text-xs font-bold py-2.5 rounded-xl border border-[#FFEAEA]">Eliminar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#384230] text-[#FAF7F2] flex items-center justify-center text-[10px] font-bold">{index + 1}</div>
                          <span className="text-[#1A1412] text-sm font-bold">{ej.titulo}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[#D1BFA5] text-sm font-bold">
                            <span className="flex flex-col items-center"><span className="text-[#1A1412] leading-none">{ej.series}</span><span className="text-[8px] uppercase tracking-wider text-[#87786E]">series</span></span>
                            <span>×</span>
                            <span className="flex flex-col items-center"><span className="text-[#1A1412] leading-none">{ej.repeticiones}</span><span className="text-[8px] uppercase tracking-wider text-[#87786E]">reps</span></span>
                          </div>
                          <button onClick={() => toggleEdit(ej.id_ejercicio, true)} className="text-[#87786E] hover:text-[#1A1412] p-1"><Edit3 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {showSelector && <div className="absolute inset-0 bg-[#384230]/30 z-20 animate-fadeIn" onClick={() => setShowSelector(false)}></div>}

        {showSelector && (
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[2rem] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] flex flex-col h-[85%] sm:h-[550px] z-30 animate-slideUp">
            <div className="w-12 h-1 bg-[#EAE2D6] rounded-full mx-auto mt-3 mb-2 flex-shrink-0"></div>
            <div className="px-6 py-2 border-b border-[#EAE2D6] flex justify-between items-center flex-shrink-0">
              <h4 className="font-display text-lg text-[#1A1412] font-semibold">Seleccionar ejercicio</h4>
              <button onClick={() => setShowSelector(false)} className="text-[#87786E] hover:text-[#1A1412] transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4 border-b border-[#EAE2D6] relative flex-shrink-0">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[#87786E]" size={16} />
              <input type="text" placeholder="Buscar ejercicio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-[#EAE2D6] rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#384230] shadow-sm" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {ejerciciosFiltrados.map(ej => (
                <div key={ej.id_ejercicio} onClick={() => handleAddEjercicio(ej)} className="border border-[#EAE2D6] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[#384230] hover:bg-[#FAF7F2] transition-colors">
                  <span className="text-sm font-semibold text-[#1A1412]">{ej.titulo}</span>
                  <Plus size={18} className="text-[#87786E]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}