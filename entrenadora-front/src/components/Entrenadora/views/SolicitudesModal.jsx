import { X, Clock, Check, AlertCircle } from 'lucide-react';

export default function SolicitudesModal({ 
  solicitudesData, 
  solicitudEnEdicion, 
  setSolicitudEnEdicion, 
  onClose, 
  datosAprobacion, 
  setDatosAprobacion, 
  planesDisponibles,
  onAprobar
}) {
  
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
      setDatosAprobacion({ ...datosAprobacion, fecha_vencimiento: '', dateError: "Selecciona una fecha válida (futura)." });
      return;
    }
    setDatosAprobacion({ ...datosAprobacion, fecha_vencimiento: selectedDate, dateError: '' });
  };

  const isFormValid = datosAprobacion.id_nivel !== '' && datosAprobacion.fecha_vencimiento !== '' && !datosAprobacion.dateError;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#384230]/40 backdrop-blur-sm animate-fadeIn flex justify-center items-end sm:items-center">
      <div className="bg-[#FAF7F2] w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col animate-slideUp relative">
        
        <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center rounded-t-[2rem]">
          <div>
            <h3 className="text-xl font-display text-[#1A1412] font-semibold">
              {solicitudEnEdicion ? 'Configurar Membresía' : 'Solicitudes Pendientes'}
            </h3>
            {!solicitudEnEdicion && <p className="text-xs text-[#87786E] mt-1">Alumnas esperando asignación de plan.</p>}
          </div>
          <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors"><X size={24} strokeWidth={1.5} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!solicitudEnEdicion ? (
            <div className="flex flex-col gap-3">
              {solicitudesData.length === 0 ? (
                <div className="bg-[#EBE5DE]/50 rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-[#EAE2D6]/50">
                  <h4 className="text-[#1A1412] font-display text-lg mb-1">Sin solicitudes</h4>
                  <p className="text-[#87786E] text-xs">No hay alumnas pendientes de aprobación.</p>
                </div>
              ) : (
                solicitudesData.map(solicitud => (
                  <div key={solicitud.id_usuario || solicitud.id} className="bg-white border border-[#EAE2D6] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#1A1412] font-bold text-[15px]">{solicitud.nombre}</span>
                      <span className="text-[#87786E] text-xs">{solicitud.correo}</span>
                      <span className="flex items-center gap-1 text-[#D97777] text-[10px] font-semibold mt-1">
                        <Clock size={10} /> Solicitud pendiente
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setSolicitudEnEdicion(solicitud);
                        const mesQueViene = new Date();
                        mesQueViene.setMonth(mesQueViene.getMonth() + 1);
                        setDatosAprobacion({ 
                          id_nivel: planesDisponibles.length > 0 ? (planesDisponibles[0].id_nivel || planesDisponibles[0].id) : '', 
                          fecha_vencimiento: obtenerFechaLocal(mesQueViene), 
                          dateError: '' 
                        });
                      }} 
                      className="bg-[#FAF7F2] hover:bg-[#EAE2D6] text-[#1A1412] border border-[#EAE2D6] text-xs font-bold px-4 py-2 rounded-full transition-colors"
                    >
                      Evaluar
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="bg-white p-4 rounded-2xl border border-[#EAE2D6] shadow-sm mb-2">
                 <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-1">Datos de la usuaria</span>
                 <p className="text-[#1A1412] font-semibold text-[15px]">{solicitudEnEdicion.nombre}</p>
                 <p className="text-[#87786E] text-xs">{solicitudEnEdicion.correo}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Asignar Membresía</label>
                <select 
                  value={datosAprobacion.id_nivel} 
                  onChange={(e) => setDatosAprobacion({...datosAprobacion, id_nivel: e.target.value})} 
                  className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] shadow-sm cursor-pointer"
                >
                  <option value="" disabled>Seleccionar plan...</option>
                  {planesDisponibles.map(p => (
                    <option key={p.id_nivel || p.id} value={p.id_nivel || p.id}>
                      {p.titulo} - ${p.precio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1.5 block">Fecha de vencimiento</label>
                <input 
                  type="date" 
                  min={minDateStr} 
                  value={datosAprobacion.fecha_vencimiento} 
                  onChange={handleDateChange} 
                  className={`w-full bg-white border ${datosAprobacion.dateError ? 'border-[#D97777]' : 'border-[#EAE2D6]'} text-[#1A1412] text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] shadow-sm cursor-pointer`} 
                />
                {datosAprobacion.dateError && (
                  <div className="text-[#D97777] text-[11px] font-semibold mt-2 flex items-start gap-1.5 animate-fadeIn">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> 
                    <span>{datosAprobacion.dateError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setSolicitudEnEdicion(null)} className="flex-1 bg-transparent border border-[#EAE2D6] hover:bg-white text-[#87786E] text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                  Atrás
                </button>
                <button 
                  type="button" 
                  disabled={!isFormValid} 
                  onClick={onAprobar}
                  className={`flex-1 text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 ${isFormValid ? 'bg-[#384230] hover:bg-[#2A3323] text-[#FAF7F2]' : 'bg-[#EAE2D6] text-[#87786E] cursor-not-allowed opacity-70'}`}
                >
                  <Check size={16} /> Aprobar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}