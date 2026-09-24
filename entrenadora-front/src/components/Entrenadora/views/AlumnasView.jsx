import { useState, useEffect } from 'react';
import { User, Mail, Bell, Search } from 'lucide-react';
import api from '../../../api';
import SolicitudesModal from './SolicitudesModal';
import AlumnaDetailView from './AlumnaDetailView';

const calcularDiasSeguros = (fechaString) => {
  if (!fechaString) return 0;
  
  const [year, month, day] = fechaString.split('T')[0].split('-');
  const fechaVenc = new Date(year, month - 1, day);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const diff = Math.round((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export default function AlumnasView() {
  const [alumnas, setAlumnas] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [showSolicitudesModal, setShowSolicitudesModal] = useState(false);
  const [solicitudEnEdicion, setSolicitudEnEdicion] = useState(null);
  const [datosAprobacion, setDatosAprobacion] = useState({ id_nivel: '', fecha_vencimiento: '', dateError: '' });
  
  const [selectedAlumna, setSelectedAlumna] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroPlan, setFiltroPlan] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resAlumnas, resMembresias, resEjercicios, resRutinas, resCategorias] = await Promise.all([
          api.get('/usuarios'),
          api.get('/membresias'),
          api.get('/ejercicios').catch(() => ({ data: [] })),
          api.get('/rutinas').catch(() => ({ data: [] })),
          api.get('/categorias').catch(() => ({ data: [] }))
        ]);
        
        const resAlumnasData = resAlumnas.data?.data || resAlumnas.data || [];
        
        const alumnasCorregidas = resAlumnasData.map(alumna => {
          let estadoReal = alumna.estado ? alumna.estado.toLowerCase() : 'pendiente';
          if (alumna.fecha_vencimiento) {
             const dias = calcularDiasSeguros(alumna.fecha_vencimiento);

             if (estadoReal === 'activa' && dias <= 0) estadoReal = 'vencida';
             if (estadoReal === 'vencida' && dias > 0) estadoReal = 'activa';
          }
          return { ...alumna, estado: estadoReal };
        });

        setAlumnas(alumnasCorregidas);
        setMembresias(resMembresias.data?.data || resMembresias.data || []);
        setEjercicios(resEjercicios.data?.data || resEjercicios.data || []);
        setRutinas(resRutinas.data?.data || resRutinas.data || []);
        setCategorias(resCategorias.data?.data || resCategorias.data || []); 

      } catch (err) {
        console.error("Error obteniendo datos:", err);
        setError('Hubo un problema al cargar el listado.');
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  const getEstadoSeguro = (estado) => (estado ? estado.toLowerCase() : 'pendiente');
  const alumnasActivas = alumnas.filter(a => getEstadoSeguro(a.estado) !== 'pendiente');
  const alumnasPendientes = alumnas.filter(a => getEstadoSeguro(a.estado) === 'pendiente');

  const filteredAlumnas = alumnasActivas.filter(alumna => {
    const nombreCompleto = `${alumna.nombre} ${alumna.apellido || ''}`.toLowerCase();
    const correo = (alumna.correo || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchSearch = nombreCompleto.includes(searchLower) || correo.includes(searchLower);
    const matchPlan = filtroPlan === '' || String(alumna.id_nivel) === String(filtroPlan);
    const matchEstado = filtroEstado === '' || getEstadoSeguro(alumna.estado) === filtroEstado;

    return matchSearch && matchPlan && matchEstado;
  });

  const handleAprobarSolicitud = async () => {
    try {
      const idUsuario = solicitudEnEdicion.id_usuario || solicitudEnEdicion.id;
      const payload = {
        id_nivel: datosAprobacion.id_nivel,
        fecha_vencimiento: datosAprobacion.fecha_vencimiento
      };

      const res = await api.patch(`/usuarios/${idUsuario}/aprobar`, payload);
      setAlumnas(alumnas.map(a => (a.id_usuario || a.id) === idUsuario ? res.data.usuario : a));
      setSolicitudEnEdicion(null);
      
      if (alumnasPendientes.length <= 1) {
        setShowSolicitudesModal(false);
      }
    } catch (err) {
      console.error("Error al aprobar alumna:", err);
      alert("Ocurrió un error al procesar la aprobación.");
    }
  };

  const handleVerPerfil = async (alumna) => {
    setSelectedAlumna(alumna); 
    
    try {
      const res = await api.get(`/usuarios/${alumna.id_usuario || alumna.id}`);
      const perfilCompleto = res.data.data || res.data;
      setSelectedAlumna(prev => ({ ...prev, ...perfilCompleto }));
    } catch (e) {
      console.error("Error al obtener el perfil completo", e);
    }
  };

  if (selectedAlumna) {
    const planAsignado = membresias.find(m => String(m.id_nivel || m.id) === String(selectedAlumna.id_nivel));
    
    const alumnaMapeada = {
      ...selectedAlumna,
      id: selectedAlumna.id_usuario || selectedAlumna.id,
      nombre: `${selectedAlumna.nombre} ${selectedAlumna.apellido || ''}`.trim(),
      email: selectedAlumna.correo,
      plan: planAsignado?.titulo || 'Sin plan',
      permiteRutinas: planAsignado?.incluye_rutinas || false,
      estado: getEstadoSeguro(selectedAlumna.estado),
      diasRestantes: calcularDiasSeguros(selectedAlumna.fecha_vencimiento),
      rutinasAsignadas: selectedAlumna.rutinas?.map(r => r.id_rutina) || [],
      ejerciciosFavoritos: selectedAlumna.ejerciciosFavoritos || selectedAlumna.favoritos || [] 
    };

    return (
      <AlumnaDetailView 
        selectedAlumna={alumnaMapeada}
        onBack={() => setSelectedAlumna(null)}
        catalogoEjercicios={ejercicios}
        catalogoRutinas={rutinas}
        catalogoCategorias={categorias} 
        planesDisponibles={membresias}
        
        onGuardarNuevaRutina={(nuevaRutina, nuevosIdsAsignados) => {
          setRutinas(prev => [...prev, nuevaRutina]);
          const nuevasRutinasFormato = nuevosIdsAsignados.map(id => ({ id_rutina: id }));
          setAlumnas(alumnas.map(a => 
            (a.id_usuario || a.id) === alumnaMapeada.id 
              ? { ...a, rutinas: nuevasRutinasFormato } 
              : a
          ));
          setSelectedAlumna({ ...selectedAlumna, rutinas: nuevasRutinasFormato });
        }}
        
        onActualizarRutina={(rutinaActualizada) => {
          setRutinas(rutinas.map(r => r.id_rutina === rutinaActualizada.id_rutina ? rutinaActualizada : r));
        }}

        onDesvincularRutina={(id_rutina_quitada, nuevosIdsAsignados) => {
          const nuevasRutinasFormato = nuevosIdsAsignados.map(id => ({ id_rutina: id }));
          setAlumnas(alumnas.map(a => 
            (a.id_usuario || a.id) === alumnaMapeada.id ? { ...a, rutinas: nuevasRutinasFormato } : a
          ));
          setSelectedAlumna({ ...selectedAlumna, rutinas: nuevasRutinasFormato });
        }}

        onAsignarRutinaExistente={(nuevosIdsAsignados) => {
          const nuevasRutinasFormato = nuevosIdsAsignados.map(id => ({ id_rutina: id }));
          setAlumnas(alumnas.map(a => 
            (a.id_usuario || a.id) === alumnaMapeada.id ? { ...a, rutinas: nuevasRutinasFormato } : a
          ));
          setSelectedAlumna({ ...selectedAlumna, rutinas: nuevasRutinasFormato });
        }}

        onCambiarEstado={async (nuevoEstado) => {
          try {
            if (nuevoEstado === 'Baja') {
              await api.delete(`/usuarios/${alumnaMapeada.id}`);
              setAlumnas(alumnas.map(a => (a.id_usuario || a.id) === alumnaMapeada.id ? { ...a, estado: 'inactiva' } : a));
              setSelectedAlumna({ ...selectedAlumna, estado: 'inactiva' });
            } else {
              await api.put(`/usuarios/${alumnaMapeada.id}`, { estado: 'activa' });
              setAlumnas(alumnas.map(a => (a.id_usuario || a.id) === alumnaMapeada.id ? { ...a, estado: 'activa' } : a));
              setSelectedAlumna({ ...selectedAlumna, estado: 'activa' });
            }
          } catch (error) {
            console.error("Error al cambiar estado", error);
            alert("Hubo un problema al actualizar el estado de la alumna.");
          }
        }}
        onCambiarPlan={async (nuevoIdNivel) => {
          try {
            await api.put(`/usuarios/${alumnaMapeada.id}`, { id_nivel: nuevoIdNivel });
            setAlumnas(alumnas.map(a => (a.id_usuario || a.id) === alumnaMapeada.id ? { ...a, id_nivel: nuevoIdNivel } : a));
            setSelectedAlumna({ ...selectedAlumna, id_nivel: nuevoIdNivel });
          } catch (error) {
            console.error("Error cambiando de membresía", error);
            alert("No se pudo actualizar el plan.");
          }
        }}
        
        onExtenderPlazo={async (nuevaFecha) => {
          try {
            const payload = { fecha_vencimiento: nuevaFecha, estado: 'activa' };
            
            await api.put(`/usuarios/${alumnaMapeada.id}`, payload);

            setAlumnas(alumnas.map(a => 
              (a.id_usuario || a.id) === alumnaMapeada.id 
                ? { ...a, fecha_vencimiento: nuevaFecha, estado: 'activa' } 
                : a
            ));

            setSelectedAlumna({ 
              ...selectedAlumna, 
              fecha_vencimiento: nuevaFecha,
              estado: 'activa',
              diasRestantes: calcularDiasSeguros(nuevaFecha) 
            });
          } catch (error) {
            console.error("Error al extender plazo", error);
            alert("No se pudo actualizar la fecha de la membresía.");
          }
        }}
      />
    );
  }

  return (
    <div className="animate-fadeIn pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-display font-semibold text-[#1A1412] mb-1">Mis Alumnos</h2>
          <p className="text-sm text-[#5C524B]">Gestión y seguimiento</p>
        </div>
        
        <button 
          onClick={() => setShowSolicitudesModal(true)}
          className="relative bg-white border border-[#EAE2D6] p-3 rounded-full hover:border-[#384230] transition-colors shadow-sm"
        >
          <Bell size={20} className="text-[#87786E]" />
          {alumnasPendientes.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D97777] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FAF7F2]">
              {alumnasPendientes.length}
            </span>
          )}
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87786E]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm font-medium rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-[#87786E] shadow-sm transition-colors placeholder:text-[#D9D0C5]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Plan:</span>
            <button onClick={() => setFiltroPlan('')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroPlan === '' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Todos</button>
            {membresias.map(m => (
              <button 
                key={m.id_nivel || m.id} 
                onClick={() => setFiltroPlan(m.id_nivel || m.id)} 
                className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${String(filtroPlan) === String(m.id_nivel || m.id) ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}
              >
                {m.titulo}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Estado:</span>
            <button onClick={() => setFiltroEstado('')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEstado === '' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Todos</button>
            <button onClick={() => setFiltroEstado('activa')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEstado === 'activa' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Activa</button>
            <button onClick={() => setFiltroEstado('vencida')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEstado === 'vencida' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Vencida</button>
            <button onClick={() => setFiltroEstado('inactiva')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEstado === 'inactiva' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>De Baja</button>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-[#D97777] p-4 rounded-2xl text-center text-sm font-medium">
          {error}
        </div>
      ) : alumnasActivas.length === 0 ? (
        <div className="bg-white border border-[#EAE2D6] rounded-[2rem] p-8 text-center shadow-sm mt-4">
          <p className="text-[#87786E] text-sm">Aún no tienes alumnas activas registradas en el sistema.</p>
        </div>
      ) : filteredAlumnas.length === 0 ? (
        <div className="bg-white border border-[#EAE2D6] rounded-[2rem] p-8 text-center shadow-sm mt-4">
          <p className="text-[#87786E] text-sm">No se encontraron alumnas con esos filtros.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {filteredAlumnas.map((alumna) => (
            <div 
              key={alumna.id_usuario || alumna.id} 
              onClick={() => handleVerPerfil(alumna)}
              className="bg-white p-5 rounded-3xl border border-[#EAE2D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-[#87786E] cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#384230] flex-shrink-0 group-hover:bg-[#384230] group-hover:text-[#FAF7F2] transition-colors">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-[#1A1412] leading-tight">
                    {alumna.nombre} {alumna.apellido}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#5C524B] mt-1">
                    <Mail size={12} />
                    <span>{alumna.correo}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-0 border-[#EAE2D6] pt-3 md:pt-0 mt-2 md:mt-0">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                  getEstadoSeguro(alumna.estado) === 'activa' ? 'bg-[#384230] text-[#FAF7F2]' : 
                  getEstadoSeguro(alumna.estado) === 'vencida' ? 'bg-[#D97777] text-white' :
                  'bg-[#EAE2D6] text-[#5C524B]'
                }`}>
                  {getEstadoSeguro(alumna.estado) === 'inactiva' ? 'Baja' : alumna.estado}
                </span>
                
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#87786E] group-hover:text-[#384230] transition-colors">
                  Ver perfil &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSolicitudesModal && (
        <SolicitudesModal 
          solicitudesData={alumnasPendientes}
          solicitudEnEdicion={solicitudEnEdicion}
          setSolicitudEnEdicion={setSolicitudEnEdicion}
          datosAprobacion={datosAprobacion}
          setDatosAprobacion={setDatosAprobacion}
          planesDisponibles={membresias}
          onClose={() => {
            setShowSolicitudesModal(false);
            setSolicitudEnEdicion(null);
          }}
          onAprobar={handleAprobarSolicitud}
        />
      )}
    </div>
  );
}