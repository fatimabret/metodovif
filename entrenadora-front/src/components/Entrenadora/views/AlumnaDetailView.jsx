import { ArrowLeft, Pencil, X, CalendarPlus, ChevronRight, AlertCircle, Plus, BookOpen, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import RutinaModal from './RutinaModal';
import RutinaDetailView from './RutinaDetailView';
import api from '../../../api'; 

export default function AlumnaDetailView({ 
  selectedAlumna, 
  onBack, 
  catalogoEjercicios, 
  catalogoRutinas,
  catalogoCategorias,
  planesDisponibles, 
  onGuardarNuevaRutina,
  onActualizarRutina,
  onDesvincularRutina,
  onAsignarRutinaExistente,
  onCambiarPlan,
  onCambiarEstado,
  onExtenderPlazo 
}) {
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [showRutinaModal, setShowRutinaModal] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false); 
  const [selectedRutinaDetail, setSelectedRutinaDetail] = useState(null); 
  const [rutinaToEdit, setRutinaToEdit] = useState(null); 
  const [showPlazoModal, setShowPlazoModal] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [dateError, setDateError] = useState(''); 
  const [pendingAlta, setPendingAlta] = useState(false);

  const obtenerFechaLocal = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);
  const minDateStr = obtenerFechaLocal(mañana);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate || selectedDate < minDateStr) {
      setNuevaFecha('');
      setDateError("Selecciona una fecha válida (futura).");
      return;
    }
    setNuevaFecha(selectedDate);
    setDateError(''); 
  };

  const rutinasAsignadas = catalogoRutinas.filter(r => selectedAlumna.rutinasAsignadas?.includes(r.id_rutina));
  const diasMostrados = selectedAlumna.diasRestantes > 0 ? selectedAlumna.diasRestantes : 'Vencido';
  const rutinasParaAsignar = catalogoRutinas.filter(r => !selectedAlumna.rutinasAsignadas?.includes(r.id_rutina));

  const favoritosRaw = selectedAlumna.ejerciciosFavoritos || selectedAlumna.ejercicios_favoritos || selectedAlumna.favoritos || [];
  const favoritosIds = favoritosRaw.map(f => String(typeof f === 'object' ? (f.id_ejercicio || f.id) : f));
  const videosGuardados = catalogoEjercicios.filter(e => favoritosIds.includes(String(e.id_ejercicio || e.id)));

  const necesitaAlta = ['inactiva', 'baja', 'vencida'].includes(String(selectedAlumna.estado).toLowerCase()) || selectedAlumna.diasRestantes <= 0;

  const handleBotonAltaBaja = () => {
    if (necesitaAlta) {
      if (selectedAlumna.diasRestantes <= 0) {
        setPendingAlta(true);
        setShowPlazoModal(true);
      } else {
        onCambiarEstado('Activa');
      }
    } else {
      onCambiarEstado('Baja');
    }
  };

  const handleGuardarRutinaAPI = async (datosRutina) => {
    try {
      if (rutinaToEdit) {
        const res = await api.put(`/rutinas/${rutinaToEdit.id_rutina}`, datosRutina);
        if (onActualizarRutina) onActualizarRutina(res.data);
        setSelectedRutinaDetail(res.data);
      } else {
        const res = await api.post('/rutinas', datosRutina);
        const rutinaCreada = res.data;
        const rutinasPrevias = selectedAlumna.rutinasAsignadas || [];
        const nuevosIdsRutinas = [...rutinasPrevias, rutinaCreada.id_rutina];
        await api.put(`/usuarios/${selectedAlumna.id}/rutinas`, { rutinas: nuevosIdsRutinas });
        if (onGuardarNuevaRutina) onGuardarNuevaRutina(rutinaCreada, nuevosIdsRutinas);
      }
      setShowRutinaModal(false);
      setRutinaToEdit(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar la rutina.");
    }
  };

  const handleAsignarRutinaExistenteAPI = async (rutinaExistente) => {
    try {
      const rutinasPrevias = selectedAlumna.rutinasAsignadas || [];
      const nuevosIdsRutinas = [...rutinasPrevias, rutinaExistente.id_rutina];
      await api.put(`/usuarios/${selectedAlumna.id}/rutinas`, { rutinas: nuevosIdsRutinas });
      if (onAsignarRutinaExistente) onAsignarRutinaExistente(nuevosIdsRutinas);
      setShowAsignarModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al asignar la rutina.");
    }
  };

  const handleDesvincularRutinaAPI = async (id_rutina) => {
    if(!window.confirm("¿Segura que deseas quitar esta rutina? Seguirá existiendo en tu catálogo general.")) return;
    try {
      const rutinasPrevias = selectedAlumna.rutinasAsignadas || [];
      const nuevosIdsRutinas = rutinasPrevias.filter(id => id !== id_rutina);
      await api.put(`/usuarios/${selectedAlumna.id}/rutinas`, { rutinas: nuevosIdsRutinas });
      if (onDesvincularRutina) onDesvincularRutina(id_rutina, nuevosIdsRutinas);
      setSelectedRutinaDetail(null); 
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al quitar la rutina.");
    }
  };

  const handleOcultarRutinaAPI = async (id_rutina, estadoActual) => {
    try {
      await api.patch(`/rutinas/${id_rutina}/activar`, { activo: !estadoActual });
      alert("Estado actualizado.");
    } catch (error) {}
  };

  const handleEliminarRutinaAPI = async (id_rutina) => {
    if(!window.confirm("¿Eliminar esta rutina de la base de datos por completo?")) return;
    try {
      await api.delete(`/rutinas/${id_rutina}`);
      setSelectedRutinaDetail(null);
      alert("Rutina eliminada correctamente.");
    } catch (error) {}
  };

  const handleGuardarPlazoLocal = () => {
    if (!nuevaFecha || dateError) return;
    if (onExtenderPlazo) onExtenderPlazo(nuevaFecha, pendingAlta);
    setShowPlazoModal(false);
    setNuevaFecha('');
    setDateError('');
    setPendingAlta(false);
  };

  if (selectedRutinaDetail) {
    return (
      <>
        <RutinaDetailView 
          rutina={selectedRutinaDetail}
          onBack={() => setSelectedRutinaDetail(null)}
          onEdit={() => { setRutinaToEdit(selectedRutinaDetail); setShowRutinaModal(true); }}
          onDesvincular={() => handleDesvincularRutinaAPI(selectedRutinaDetail.id_rutina)}
          onOcultar={() => handleOcultarRutinaAPI(selectedRutinaDetail.id_rutina, selectedRutinaDetail.activo)}
          onEliminar={() => handleEliminarRutinaAPI(selectedRutinaDetail.id_rutina)}
        />
        {showRutinaModal && (
          <RutinaModal 
            rutinaAEditar={rutinaToEdit} 
            catalogoEjercicios={catalogoEjercicios || []} 
            catalogoCategorias={catalogoCategorias || []} 
            onClose={() => { setShowRutinaModal(false); setRutinaToEdit(null); }} 
            onGuardarRutina={handleGuardarRutinaAPI} 
          />
        )}
      </>
    );
  }

  return (
    <div className="animate-slideUp pb-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#87786E] hover:text-[#1A1412] text-sm font-medium mb-6 transition-colors">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl shadow-md transition-colors ${necesitaAlta ? 'bg-[#FAF7F2] text-[#87786E] border border-[#EAE2D6]' : 'bg-[#384230] text-[#FAF7F2]'}`}>
          {selectedAlumna.nombre.charAt(0)}
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-display text-[#1A1412] font-semibold">{selectedAlumna.nombre}</h2>
          <span className="text-[#87786E] text-sm mt-0.5">{selectedAlumna.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm relative group h-24">
          {!isEditingPlan ? (
            <>
              <button onClick={() => setIsEditingPlan(true)} className="absolute top-3 right-3 text-[#D9D0C5] hover:text-[#87786E] transition-colors"><Pencil size={14} /></button>
              <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mt-1">Plan Actual</span>
              <span className="text-xl font-display text-[#1A1412] font-bold">{selectedAlumna.plan || 'Sin plan'}</span>
            </>
          ) : (
            <div className="flex flex-col items-center w-full px-2 animate-fadeIn">
              <select 
                className="w-full bg-[#FAF7F2] border border-[#EAE2D6] text-[#1A1412] text-sm font-semibold rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:border-[#384230] text-center cursor-pointer" 
                defaultValue={selectedAlumna.id_nivel} 
                onChange={(e) => { onCambiarPlan(e.target.value); setIsEditingPlan(false); }}
              >
                {planesDisponibles?.map(p => (
                  <option key={p.id_nivel || p.id} value={p.id_nivel || p.id}>{p.titulo}</option>
                ))}
              </select>
              <button onClick={() => setIsEditingPlan(false)} className="text-[9px] uppercase tracking-widest text-[#D97777] hover:text-[#E56B6F] font-bold flex items-center gap-1"><X size={10} strokeWidth={3} /> Cancelar</button>
            </div>
          )}
        </div>
        
        <div className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm h-24">
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mt-1">Días a vencer</span>
          <span className={`text-xl font-display font-bold ${diasMostrados === 'Vencido' ? 'text-[#D97777]' : 'text-[#1A1412]'}`}>
            {diasMostrados}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold">Rutinas Personalizadas ({rutinasAsignadas.length})</span>
          {selectedAlumna.permiteRutinas && (
            <button onClick={() => setShowAsignarModal(true)} className="text-[#87786E] hover:text-[#1A1412] text-xs font-bold transition-colors">
              + Nueva rutina
            </button>
          )}
        </div>

        {!selectedAlumna.permiteRutinas ? (
          <div className="bg-[#FAF7F2] border border-[#EAE2D6] border-dashed rounded-2xl p-6 text-center">
            <p className="text-[#87786E] text-sm">Este plan no incluye <span className="font-bold text-[#1A1412]">rutinas personalizadas</span>.</p>
          </div>
        ) : rutinasAsignadas.length === 0 ? (
          <div className="bg-white border border-[#EAE2D6] rounded-2xl p-6 text-center shadow-sm">
            <p className="text-[#87786E] text-sm">No tiene rutinas asignadas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rutinasAsignadas.map(rutina => (
              <div key={rutina.id_rutina} onClick={() => setSelectedRutinaDetail(rutina)} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#87786E] transition-colors">
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[#1A1412] font-bold text-sm">{rutina.titulo}</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#87786E] text-[9px] font-bold px-2 py-0.5 rounded-md">{rutina.categoria}</span>
                    <span className="text-[#87786E] text-[11px] font-medium">{rutina.ejercicios?.length || 0} ejercicios</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#D9D0C5]" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-3">Videos Guardados ({videosGuardados.length})</span>
        {videosGuardados.length === 0 ? (
          <div className="bg-white border border-[#EAE2D6] rounded-2xl p-6 text-center shadow-sm">
            <p className="text-[#87786E] text-sm">No tiene videos guardados.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {videosGuardados.map(video => (
              <div key={video.id_ejercicio || video.id} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex items-center gap-4 shadow-sm group">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#87786E] flex-shrink-0">
                  <PlayCircle size={24} />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <h4 className="text-[#1A1412] font-bold text-sm leading-tight">{video.titulo}</h4>
                  <span className="text-[#87786E] text-[10px] uppercase tracking-widest font-bold">
                    Guardado en favoritos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-3">
        <button onClick={handleBotonAltaBaja} className="w-full bg-transparent border border-[#EAE2D6] hover:bg-[#FAF7F2] text-[#1A1412] text-sm font-semibold py-3.5 rounded-2xl transition-colors shadow-sm">
          {necesitaAlta ? 'Dar de alta' : 'Dar de baja'}
        </button>
        <button onClick={() => { setPendingAlta(false); setShowPlazoModal(true); }} className="w-full bg-[#384230] hover:bg-[#2A3323] text-[#FAF7F2] text-sm font-semibold py-3.5 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2">
          <CalendarPlus size={16} /> Extender plazo
        </button>
      </div>

      {showAsignarModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#384230]/40 backdrop-blur-sm flex justify-center items-end sm:items-center animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col animate-slideUp relative">
            <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center rounded-t-[2rem]">
              <h3 className="text-xl font-display text-[#1A1412] font-semibold">Asignar Rutina</h3>
              <button onClick={() => setShowAsignarModal(false)} className="text-[#87786E] hover:text-[#1A1412]"><X size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <button 
                onClick={() => { setShowAsignarModal(false); setRutinaToEdit(null); setShowRutinaModal(true); }}
                className="w-full mb-6 bg-white border-2 border-dashed border-[#87786E] text-[#384230] text-sm font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-[#FAF7F2] transition-colors"
              >
                <Plus size={18} /> Crear rutina desde cero
              </button>

              <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-3">Tus rutinas guardadas</span>
              
              <div className="flex flex-col gap-3">
                {rutinasParaAsignar.length === 0 ? (
                  <div className="bg-[#EBE5DE]/50 rounded-2xl p-6 text-center border border-[#EAE2D6]/50">
                    <p className="text-[#87786E] text-xs">No hay rutinas disponibles para reciclar.</p>
                  </div>
                ) : (
                  rutinasParaAsignar.map(rutina => (
                    <div key={rutina.id_rutina} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[#1A1412] font-bold text-sm">{rutina.titulo}</h4>
                        <span className="text-[#87786E] text-[10px] uppercase font-bold">{rutina.categoria}</span>
                      </div>
                      <button 
                        onClick={() => handleAsignarRutinaExistenteAPI(rutina)}
                        className="bg-[#384230] text-[#FAF7F2] hover:bg-[#2A3323] text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen size={12} /> Asignar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlazoModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#384230]/40 backdrop-blur-sm flex justify-center items-center animate-fadeIn px-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-xl border border-[#EAE2D6] animate-slideUp">
            <h3 className="font-display font-bold text-lg text-[#1A1412] mb-1">
              {pendingAlta ? 'Asignar días antes del alta' : 'Extender Membresía'}
            </h3>
            <p className="text-[#87786E] text-xs mb-4">
              {pendingAlta ? 'La alumna no tiene días vigentes. Selecciona una nueva fecha primero.' : 'Selecciona la nueva fecha de vencimiento.'}
            </p>
            
            <input 
              type="date" 
              min={minDateStr} 
              value={nuevaFecha} 
              onChange={handleDateChange} 
              className={`w-full bg-[#FAF7F2] border ${dateError ? 'border-[#D97777]' : 'border-[#EAE2D6]'} rounded-xl px-4 py-3 text-sm text-[#1A1412] focus:outline-none focus:border-[#384230] ${dateError ? 'mb-1' : 'mb-5'} font-semibold cursor-pointer`}
            />

            {dateError && (
              <div className="text-[#D97777] text-[11px] font-semibold mb-4 flex items-start gap-1.5 animate-fadeIn">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> 
                <span>{dateError}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                onClick={handleGuardarPlazoLocal}
                disabled={!nuevaFecha || dateError !== ''}
                className="flex-1 bg-[#384230] hover:bg-[#2A3323] text-[#FAF7F2] text-xs font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {pendingAlta ? 'Guardar y Dar Alta' : 'Guardar Fecha'}
              </button>
              <button 
                onClick={() => { setShowPlazoModal(false); setPendingAlta(false); setNuevaFecha(''); setDateError(''); }}
                className="flex-1 bg-[#FAF7F2] hover:bg-[#EAE2D6] text-[#87786E] text-xs font-bold py-3 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}