import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Bookmark, ChevronRight, AlertCircle, X } from 'lucide-react';
import StudentBottomNav from '../../components/Student/StudentBottomNav';
import ExerciseCard from '../../components/Student/ExerciseCard';
import VideoModal from '../../components/Student/VideoModal';
import StudentRutinas from '../../components/Student/StudentRutinas';
import api from '../../api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ actual: '', nueva: '', confirmar: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [cargandoPass, setCargandoPass] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    
    if (passData.nueva !== passData.confirmar) {
      return setPassError('Las contraseñas nuevas no coinciden.');
    }

    setCargandoPass(true);
    try {
      const res = await api.post('/auth/change-password', {
        contrasenia_actual: passData.actual,
        nueva_contrasenia: passData.nueva
      });
      
      setPassSuccess(res.data.mensaje);
      setPassData({ actual: '', nueva: '', confirmar: '' });
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess('');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        const primerosErrores = Object.values(error.response.data.errors).flat();
        setPassError(primerosErrores[0]); 
      } 
      else if (error.response?.data?.mensaje) {
        setPassError(error.response.data.mensaje);
      } 
      else {
        setPassError('Error al actualizar la contraseña.');
      }
    } finally {
      setCargandoPass(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/?auth=login', { replace: true });
    }
  }, [token, navigate]);

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('studentTab') || 'videos');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('studentTab', tab);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeEtiqueta, setActiveEtiqueta] = useState('Todas');
  
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [ejercicios, setEjercicios] = useState([]);
  const [categorias, setCategorias] = useState(["Todas"]);
  const [etiquetas, setEtiquetas] = useState(["Todas"]);
  const [cargando, setCargando] = useState(true);

  const [perfilUsuario, setPerfilUsuario] = useState({ 
    nombre: "Cargando...", 
    plan: "Cargando...", 
    diasRestantes: null,
    permiteRutinas: false,
    estado: 'activa'
  });


  
  const [rutinasAsignadas, setRutinasAsignadas] = useState([]);
  const [favorites, setFavorites] = useState([]); 

  if (!token) return null;

  useEffect(() => {
    const fetchDatos = async () => {
      setCargando(true);

      try {
        const resPerfil = await api.get('/alumna/perfil');
        setPerfilUsuario({
          nombre: resPerfil.data.nombre,
          plan: resPerfil.data.plan,
          diasRestantes: resPerfil.data.diasRestantes,
          permiteRutinas: resPerfil.data.permiteRutinas,
          estado: resPerfil.data.estado // <-- NUEVO
        });

        const [resEjercicios, resCategorias] = await Promise.all([
          api.get('/ejercicios'),
          api.get('/categorias')
        ]);

        const cats = resCategorias.data.filter(c => c.activo !== false).map(c => c.titulo);
        setCategorias(["Todas", ...cats]);

        const tagsSet = new Set();
        resEjercicios.data.filter(ej => ej.activo).forEach(ej => {
          if (ej.etiquetas) ej.etiquetas.forEach(et => tagsSet.add(et.titulo));
        });
        setEtiquetas(["Todas", ...Array.from(tagsSet)]);

        const ejerciciosMapeados = resEjercicios.data
          .filter(ej => ej.activo)
          .map(ej => {
            let yId = ej.video_url;
            try {
              const match = ej.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              if (match && match[1]) yId = match[1];
            } catch (e) {}

            return {
              id: ej.id_ejercicio,
              titulo: ej.titulo,
              descripcion: ej.descripcion || "Sin descripción",
              duracion: "15 min", 
              disciplina: ej.categoria?.titulo || "Sin categoría",
              etiqueta: ej.etiquetas?.length > 0 ? ej.etiquetas[0].titulo : null,
              etiquetas_completas: ej.etiquetas || [],
              nivel: "Todos", 
              youtubeId: yId
            };
          });
          
        setEjercicios(ejerciciosMapeados);
      } catch (error) {
        console.error("Error al cargar los videos:", error);
      }

      try {
        const resPerfil = await api.get('/alumna/perfil');
        
        setPerfilUsuario({
          nombre: resPerfil.data.nombre,
          plan: resPerfil.data.plan,
          diasRestantes: resPerfil.data.diasRestantes,
          permiteRutinas: resPerfil.data.permiteRutinas
        });
        setFavorites(resPerfil.data.favoritos || []);

        const rutinasFormateadas = (resPerfil.data.rutinas || []).map(r => ({
          id_rutina: r.id_rutina,
          titulo: r.titulo,
          categoria: r.categoria,
          fecha: "Asignada recientemente",
          descripcion: r.descripcion,
          ejercicios: (r.ejercicios || []).map(ej => {
            let yId = ej.video_url;
            try {
              const match = ej.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              if (match && match[1]) yId = match[1];
            } catch (e) {}

            return {
              id: ej.id_ejercicio,
              titulo: ej.titulo,
              series: ej.pivot?.series || 4,
              repeticiones: ej.pivot?.repeticiones || "12",
              nota: ej.pivot?.nota || "",
              youtubeId: yId,
              descripcion: ej.descripcion,
              nivel: "Todos",
              duracion: "Ejecución libre"
            };
          })
        }));
        setRutinasAsignadas(rutinasFormateadas);
      } catch (error) {
        console.warn("Error de acceso al perfil:", error);
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/?auth=login', { replace: true });
        }
      }

      setCargando(false);
    };

    fetchDatos();
  }, [navigate]); 

  const filteredEjercicios = ejercicios.filter(ej => {
    const matchSearch = ej.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        ej.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'Todas' || ej.disciplina === activeCategory;
    const matchTag = activeEtiqueta === 'Todas' || ej.etiquetas_completas.some(et => et.titulo === activeEtiqueta);
    
    return matchSearch && matchCat && matchTag;
  });

  const savedExercises = ejercicios.filter(ej => favorites.includes(ej.id));

  const toggleFavorite = async (e, id) => {
    e.stopPropagation(); 
    
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }

    try {
      await api.post(`/alumna/favoritos/${id}`);
    } catch (error) {
      console.error("Error al guardar en favoritos", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      localStorage.removeItem('token'); 
      localStorage.removeItem('studentTab'); 
      window.location.href = '/'; 
    }
  };

  if (!cargando && (perfilUsuario.estado === 'vencida' || (perfilUsuario.diasRestantes !== null && perfilUsuario.diasRestantes <= 0))) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pb-32 font-sans text-[#1A1412]">
        <header className="pt-8 px-6 md:px-12 lg:px-32 xl:px-48 flex justify-between items-center mb-6">
          <h1 onClick={() => window.location.href = '/'} className="text-2xl font-display leading-none text-[#1A1412] cursor-pointer" >
            Metodo <span className="italic text-[#5C524B]">VIF</span>
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#5C524B] hover:text-[#D97777] bg-transparent px-4 py-1.5 rounded-full border border-[#D9D0C5] transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </header>

        <div className="flex flex-col items-center justify-center mt-24 md:mt-32 px-6 text-center animate-slideUp">
          <div className="w-20 h-20 bg-[#D97777]/10 text-[#D97777] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <AlertCircle size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-[#1A1412] mb-3">Tu membresía ha vencido</h2>
          <p className="text-[#5C524B] max-w-md text-sm md:text-base leading-relaxed">
            Tus días de acceso han finalizado. Por favor, ponte en contacto con Vero para renovar tu plan y continuar con tus entrenamientos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF7F2] pb-32 font-sans ext-foreground">
      
      <header className="pt-8 px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 flex justify-between items-center mb-6">
        <h1 onClick={() => handleTabChange('videos')} className="text-2xl font-display leading-none text-[#1A1412] cursor-pointer" >
          Metodo <span className="italic text-[#5C524B]">VIF</span>
        </h1>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[#5C524B] hover:text-[#D97777] hover:bg-[#FFF5F5] hover:border-[#D97777] transition-all bg-transparent px-4 py-1.5 rounded-full border border-[#D9D0C5]"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span className="text-sm font-medium">Salir</span>
        </button>
      </header>

      {activeTab === 'videos' && (
        <div className="animate-fadeIn">
          <section className="px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 mb-6">
            <h2 className="text-4xl md:text-5xl font-display text-[#1A1412] mb-1">
              Elegí tu entrenamiento
            </h2>
            <p className="text-sm md:text-base text-[#5C524B] mb-6">Tu espacio</p>
            
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C524B]" size={20} />
              <input type="text" placeholder="Buscar un ejercicio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-[#EAE2D6] shadow-sm text-sm md:text-base text-[#1A1412] focus:outline-none focus:border-[#87786E] transition-all" />
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 mb-8 flex flex-col gap-3">
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Disciplina:</span>
              {categorias.map(cat => (
                <button key={`cat-${cat}`} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeCategory === cat ? 'bg-[#384230] text-[#FAF7F2] border-[#384230] shadow-sm' : 'bg-transparent text-[#5C524B] border-[#EAE2D6] hover:border-[#87786E]'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {etiquetas.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Etiqueta:</span>
                {etiquetas.map(tag => (
                  <button key={`tag-${tag}`} onClick={() => setActiveEtiqueta(tag)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeEtiqueta === tag ? 'bg-[#384230] text-[#FAF7F2] border-[#384230] shadow-sm' : 'bg-transparent text-[#5C524B] border-[#EAE2D6] hover:border-[#87786E]'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 pb-10">
            {cargando ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
              </div>
            ) : filteredEjercicios.length === 0 ? (
              <div className="bg-white border border-[#EAE2D6] rounded-[2rem] p-8 text-center shadow-sm">
                <p className="text-[#87786E] text-sm">No se encontraron videos con esos filtros.</p>
              </div>
            ) : (
              <>
                <p className="text-xs md:text-sm text-[#5C524B] font-medium mb-4">{filteredEjercicios.length} entrenamientos disponibles</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {filteredEjercicios.map((ej) => (
                    <ExerciseCard key={ej.id} ejercicio={ej} isFav={favorites.includes(ej.id)} onToggleFavorite={toggleFavorite} onSelectVideo={setSelectedVideo} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {activeTab === 'favoritos' && (
        <div className="animate-fadeIn">
          <section className="px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 mb-8">
            <h2 className="text-4xl md:text-5xl font-display text-[#1A1412] mb-1">Guardados</h2>
            <p className="text-sm md:text-base text-[#5C524B]">Tus videos favoritos</p>
          </section>

          <section className="px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 h-full pb-10">
            {cargando ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
              </div>
            ) : savedExercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center animate-slideUp">
                <div className="bg-white p-5 rounded-full shadow-sm mb-5 border border-[#EAE2D6]">
                  <Bookmark size={36} strokeWidth={1.5} className="text-[#D9D0C5]" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-[#5C524B] mb-2 font-semibold">Aún no guardaste videos</h3>
                <p className="text-[#87786E] text-sm md:text-base">Tocá el ícono de guardado en cualquier video</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {savedExercises.map((ej) => (
                  <ExerciseCard key={ej.id} ejercicio={ej} isFav={favorites.includes(ej.id)} onToggleFavorite={toggleFavorite} onSelectVideo={setSelectedVideo} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'rutina' && (
        <StudentRutinas rutinas={rutinasAsignadas} plan={perfilUsuario.plan} onSelectVideo={setSelectedVideo} />
      )}

      {activeTab === 'perfil' && (
        <div className="animate-fadeIn pb-4 flex flex-col items-center mt-6 md:mt-12 px-6">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-4xl md:text-5xl font-display text-[#1A1412] mb-1">{perfilUsuario.nombre}</h2>
              <p className="text-[#87786E] text-sm md:text-base font-medium">Plan: {perfilUsuario.plan}</p>
            </div>
            
            <div className="w-full bg-white border border-[#EAE2D6] rounded-[1.25rem] py-6 flex flex-col items-center justify-center shadow-sm mb-6">
              <span className="text-[10px] md:text-xs text-[#5C524B] font-bold uppercase tracking-widest text-center">Días de cuota<br/>restantes</span>
              <span className="text-5xl md:text-6xl font-display text-[#1A1412] font-semibold leading-none mb-2">{perfilUsuario.diasRestantes}</span>
            </div>
            
            <div 
              onClick={() => setShowPasswordModal(true)} 
              className="w-full flex items-center justify-between bg-white border border-[#EAE2D6] p-5 rounded-[1.25rem] shadow-sm cursor-pointer hover:bg-[#FAF7F2] transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-base font-semibold text-[#1A1412]">Configuración</span>
                <span className="text-xs text-[#87786E] mt-0.5">Modificar contraseña</span>
              </div>
              <ChevronRight size={20} className="text-[#87786E]" />
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
            <div className="bg-white px-6 py-4 border-b border-[#EAE2D6] flex justify-between items-center">
              <h3 className="text-lg font-display text-[#1A1412] font-semibold">Modificar Contraseña</h3>
              <button onClick={() => { setShowPasswordModal(false); setPassError(''); setPassSuccess(''); }} className="text-[#87786E] hover:text-[#1A1412] transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 flex flex-col gap-4">
              <div>
                <input 
                  type="password" placeholder="Contraseña actual" required
                  value={passData.actual} onChange={e => setPassData({...passData, actual: e.target.value})}
                  className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#384230]"
                />
              </div>
              <div>
                <input 
                  type="password" placeholder="Nueva contraseña" required minLength={6}
                  value={passData.nueva} onChange={e => setPassData({...passData, nueva: e.target.value})}
                  className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#384230]"
                />
              </div>
              <div>
                <input 
                  type="password" placeholder="Confirmar nueva contraseña" required
                  value={passData.confirmar} onChange={e => setPassData({...passData, confirmar: e.target.value})}
                  className="w-full bg-white border border-[#EAE2D6] text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#384230]"
                />
              </div>

              {passError && <div className="bg-[#D97777]/10 text-[#D97777] p-2.5 rounded-xl text-sm font-medium text-center">{passError}</div>}
              {passSuccess && <div className="bg-[#4A7C59]/10 text-[#4A7C59] p-2.5 rounded-xl text-sm font-medium text-center">{passSuccess}</div>}

              <button 
                type="submit" 
                disabled={cargandoPass || passSuccess !== ''} 
                className="mt-2 w-full bg-[#384230] text-white text-sm font-bold py-4 rounded-[2rem] hover:bg-[#2A3323] transition-colors disabled:opacity-50"
              >
                {cargandoPass ? 'Guardando...' : passSuccess !== '' ? '¡Actualizada!' : 'Guardar nueva contraseña'}
              </button>
            </form>
          </div>
        </div>
      )}

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <StudentBottomNav activeTab={activeTab} setActiveTab={handleTabChange} permiteRutinas={perfilUsuario.permiteRutinas} />
    </div>
  );
}