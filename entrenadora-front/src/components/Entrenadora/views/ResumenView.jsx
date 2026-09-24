import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../../../api';

export default function ResumenView() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const respuesta = await api.get('/entrenadora/dashboard/resumen');
        setResumen(respuesta.data);
      } catch (err) {
        console.error("Error obteniendo el resumen:", err);
        setError('Hubo un problema al cargar las métricas del panel.');
      } finally {
        setCargando(false);
      }
    };

    fetchResumen();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-[#D97777] p-4 rounded-2xl text-center text-sm font-medium mt-6">
        {error}
      </div>
    );
  }

  const stats = resumen?.metricas || { 
    alumnasActivas: 0, alumnasInactivas: 0, 
    videosActivos: 0, videosOcultos: 0, 
    planesVisibles: 0, guardadosTotales: 0 
  };
  const videoPopular = resumen?.videoDestacado || null;
  const distribucionPlanes = resumen?.distribucion || [];

  const totalAlumnasPlanes = distribucionPlanes.reduce((total, plan) => total + plan.cantidadAlumnas, 0);

  return (
    <div className="animate-fadeIn pb-10">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1 block">Panel de gestión</span>
        <h2 className="text-3xl md:text-4xl font-display text-[#1A1412] mt-1">Bienvenida, Vero</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-[#384230] p-5 rounded-[1.25rem] shadow-sm flex flex-col justify-center">
          <span className="text-4xl font-display text-[#E5DCD0] leading-none mb-2">{stats.alumnasActivas}</span>
          <span className="text-sm font-semibold text-[#FAF7F2]">Alumnos activos</span>
          <span className="text-[10px] text-[#86917C] font-medium mt-1">{stats.alumnasInactivas} inactivo</span>
        </div>
        <div className="bg-white border border-[#EAE2D6] p-5 rounded-[1.25rem] shadow-sm flex flex-col justify-center">
          <span className="text-4xl font-display text-[#1A1412] leading-none mb-2">{stats.videosActivos}</span>
          <span className="text-sm font-semibold text-[#1A1412]">Videos activos</span>
          <span className="text-[10px] text-[#87786E] font-medium mt-1">{stats.videosOcultos} oculto</span>
        </div>
        <div className="bg-white border border-[#EAE2D6] p-5 rounded-[1.25rem] shadow-sm flex flex-col justify-center">
          <span className="text-4xl font-display text-[#1A1412] leading-none mb-2">{stats.planesVisibles}</span>
          <span className="text-sm font-semibold text-[#1A1412]">Planes visibles</span>
          <span className="text-[10px] text-[#87786E] font-medium mt-1">en el Inicio</span>
        </div>
        <div className="bg-white border border-[#EAE2D6] p-5 rounded-[1.25rem] shadow-sm flex flex-col justify-center">
          <span className="text-4xl font-display text-[#1A1412] leading-none mb-2">{stats.guardadosTotales}</span>
          <span className="text-sm font-semibold text-[#1A1412]">Guardados totales</span>
          <span className="text-[10px] text-[#87786E] font-medium mt-1">por alumnos</span>
        </div>
      </div>

      {videoPopular && videoPopular.videoTitulo && (
        <div className="bg-white border border-[#EAE2D6] p-6 rounded-[1.25rem] shadow-sm mb-6">
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-3">Video más guardado</span>
          <h3 className="text-2xl font-display font-semibold text-[#1A1412] mb-4">{videoPopular.videoTitulo}</h3>
          <div className="flex items-center gap-3">
            <span className="bg-transparent border border-[#EAE2D6] text-[#5C524B] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              {videoPopular.disciplina || 'Sin categoría'}
            </span>
            <span className="flex items-center gap-1.5 text-[#87786E] text-xs font-semibold px-2 py-1">
              <Bookmark size={14} className="fill-[#87786E]" /> {videoPopular.cantidadGuardados} alumnos
            </span>
          </div>
        </div>
      )}

      {distribucionPlanes.length > 0 && (
        <div className="bg-white border border-[#EAE2D6] p-6 rounded-[1.25rem] shadow-sm mb-8">
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-5">Distribución por plan</span>
          
          <div className="flex flex-col gap-6">
            {distribucionPlanes.map((plan, index) => {
              const porcentaje = totalAlumnasPlanes > 0 
                ? (plan.cantidadAlumnas / totalAlumnasPlanes) * 100 
                : 0;

              return (
                <div key={index} className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-end gap-4">
                    <span className="text-[#1A1412] text-[15px] font-bold leading-tight">
                      {plan.planTitulo} 
                    </span>
                    <span className="text-[#87786E] text-sm font-bold flex-shrink-0">
                      {plan.cantidadAlumnas}
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-[#EAE2D6]/60 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-[#384230] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}