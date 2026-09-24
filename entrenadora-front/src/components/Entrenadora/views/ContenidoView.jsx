import { useState, useEffect } from 'react';
import { Bookmark, Plus, Pencil, Search, Star, BarChart3, Info } from 'lucide-react';
import api from '../../../api';
import VideoModal from './VideoModal';
import CategoriaModal from './CategoriaModal';
import MembresiaModal from './MembresiaModal';
import EtiquetaModal from './EtiquetaModal';
import TestimonioModal from './TestimonioModal';

const CustomToggle = ({ isVisible, onToggle }) => (
  <button onClick={onToggle} className={`min-w-[48px] h-7 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ${isVisible ? 'bg-[#384230]' : 'bg-[#EAE2D6]'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function ContenidoView() {
  const [contentTab, setContentTab] = useState('videos');

  const [perfilGeneral, setPerfilGeneral] = useState({});

  // Testimonios
  const [testimoniosData, setTestimonioData] = useState([]);
  const [showTestimonioModal, setShowTestimonioModal] = useState(false);
  const [testimonioDraft, setTestimonioDraft] = useState({ titulo: '', descripcion: '', nombre_alumna: '', fotos: [] });

  // Filtros
  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  
  const [videosData, setVideosData] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);
  const [etiquetasData, setEtiquetasData] = useState([]);
  const [membresiasData, setMembresiasData] = useState([]);
  const [showMembresiaModal, setShowMembresiaModal] = useState(false);
  const [membresiaDraft, setMembresiaDraft] = useState({ titulo: '', descripcion: '', precio: '' });
  
  const [cargando, setCargando] = useState(true);
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoDraft, setVideoDraft] = useState({ 
    titulo: '', descripcion: '', video_url: '', id_categoria: '', id_etiquetas: [], es_de_prueba: false 
  });

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [categoriaDraft, setCategoriaDraft] = useState({ titulo: '', descripcion: '' });

  const [showEtiquetaModal, setShowEtiquetaModal] = useState(false);
  const [etiquetaDraft, setEtiquetaDraft] = useState({ titulo: '' });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resEjercicios, resCategorias, resEtiquetas, resMembresias, resTestimonios, resPerfil] = await Promise.all([
          api.get('/ejercicios'),
          api.get('/categorias'),
          api.get('/etiquetas').catch(() => ({ data: [] })),
          api.get('/membresias').catch(() => ({ data: [] })),
          api.get('/testimonios').catch(() => ({ data: [] })),
          api.get('/perfil-entrenadora').catch(() => ({ data: [] })) // <-- AÑADIDO
        ]);

        // Procesamos el perfil para asegurarnos de que sea un objeto limpio
        let datosPerfil = resPerfil.data;
        if (Array.isArray(datosPerfil)) datosPerfil = datosPerfil.length > 0 ? datosPerfil[0] : {};
        else if (datosPerfil?.data) datosPerfil = Array.isArray(datosPerfil.data) ? datosPerfil.data[0] : datosPerfil.data;
        
        setPerfilGeneral(datosPerfil || {});
        setVideosData(resEjercicios.data);
        setCategoriasData(resCategorias.data);
        setEtiquetasData(resEtiquetas.data);
        setMembresiasData(resMembresias.data);
        setTestimonioData(resTestimonios.data);
      } catch (err) {
        console.error("Error al cargar contenido:", err);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  const handleAbrirEdicionVideo = (video = null) => {
    if (video) {
      setVideoDraft({
        id_ejercicio: video.id_ejercicio,
        titulo: video.titulo,
        descripcion: video.descripcion || '',
        video_url: video.video_url,
        id_categoria: video.id_categoria || '',
        id_etiquetas: video.etiquetas ? video.etiquetas.map(e => e.id_etiqueta) : [],
        es_de_prueba: video.es_de_prueba
      });
    } else {
      setVideoDraft({ titulo: '', descripcion: '', video_url: '', id_categoria: '', id_etiquetas: [], es_de_prueba: false });
    }
    setShowVideoModal(true);
  };

  const handleToggleActivoVideo = async (id_ejercicio, estadoActual) => {
    try {
      if (estadoActual) {
        await api.delete(`/ejercicios/${id_ejercicio}`);
      } else {
        await api.patch(`/ejercicios/${id_ejercicio}/activar`);
      }
      setVideosData(prev => prev.map(v => v.id_ejercicio === id_ejercicio ? { ...v, activo: !estadoActual } : v));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleTogglePrueba = async (id_ejercicio, estadoActual) => {
    try {
      await api.put(`/ejercicios/${id_ejercicio}`, { es_de_prueba: !estadoActual });
      setVideosData(prev => prev.map(v => v.id_ejercicio === id_ejercicio ? { ...v, es_de_prueba: !estadoActual } : v));
    } catch (err) {
      console.error("Error al cambiar versión de prueba:", err);
    }
  };

  const handleGuardarVideo = async (e) => {
    e.preventDefault();
    try {
      if (videoDraft.id_ejercicio) {
        const res = await api.put(`/ejercicios/${videoDraft.id_ejercicio}`, videoDraft);
        setVideosData(videosData.map(v => v.id_ejercicio === videoDraft.id_ejercicio ? res.data : v));
      } else {
        const res = await api.post('/ejercicios', videoDraft);
        setVideosData([res.data, ...videosData]);
      }
      setShowVideoModal(false);
      setVideoDraft({ titulo: '', descripcion: '', video_url: '', id_categoria: '', id_etiquetas: [], es_de_prueba: false });
    } catch (err) {
      console.error("Error al guardar video:", err);
      alert("Hubo un problema al guardar el ejercicio.");
    }
  };

  const handleAbrirEdicionCategoria = (categoria = null) => {
    if (categoria) {
      setCategoriaDraft({
        id_categoria: categoria.id_categoria || categoria.id,
        titulo: categoria.titulo,
        descripcion: categoria.descripcion
      });
    } else {
      setCategoriaDraft({ titulo: '', descripcion: '' });
    }
    setShowCategoriaModal(true);
  };

  const handleToggleActivoCategoria = async (id_categoria, estadoActual) => {
    try {
      if (estadoActual) {
        await api.delete(`/categorias/${id_categoria}`);
      } else {
        await api.patch(`/categorias/${id_categoria}/activar`);
      }
      setCategoriasData(prev => prev.map(c => (c.id_categoria || c.id) === id_categoria ? { ...c, activo: !estadoActual } : c));
    } catch (err) {
      console.error("Error al cambiar estado de categoría:", err);
    }
  };

  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    try {
      const idCat = categoriaDraft.id_categoria || categoriaDraft.id;
      if (idCat) {
        const res = await api.put(`/categorias/${idCat}`, categoriaDraft);
        setCategoriasData(categoriasData.map(c => (c.id_categoria || c.id) === idCat ? res.data : c));
      } else {
        const res = await api.post('/categorias', categoriaDraft);
        setCategoriasData([...categoriasData, res.data]);
      }
      setShowCategoriaModal(false);
      setCategoriaDraft({ titulo: '', descripcion: '' });
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      alert("Hubo un problema al guardar la disciplina.");
    }
  };

  const handleAbrirEdicionMembresia = (plan = null) => {
    if (plan) {
      setMembresiaDraft({ 
        id_nivel: plan.id_nivel || plan.id, 
        titulo: plan.titulo, 
        descripcion: plan.descripcion, 
        precio: plan.precio,
        incluye_rutinas: Boolean(plan.incluye_rutinas)
      });
    } else {
      setMembresiaDraft({ titulo: '', descripcion: '', precio: '', incluye_rutinas: false });
    }
    setShowMembresiaModal(true);
  };

  const handleToggleActivoMembresia = async (id_nivel, estadoActual) => {
    try {
      if (estadoActual) {
        await api.delete(`/membresias/${id_nivel}`);
      } else {
        await api.patch(`/membresias/${id_nivel}/activar`);
      }
      setMembresiasData(prev => prev.map(m => (m.id_nivel || m.id) === id_nivel ? { ...m, activo: !estadoActual } : m));
    } catch (err) {
      console.error("Error al cambiar estado de membresía:", err);
    }
  };

  const handleGuardarMembresia = async (e) => {
    e.preventDefault();
    try {
      const idPlan = membresiaDraft.id_nivel || membresiaDraft.id;
      if (idPlan) {
        const res = await api.put(`/membresias/${idPlan}`, membresiaDraft);
        setMembresiasData(membresiasData.map(m => (m.id_nivel || m.id) === idPlan ? res.data : m));
      } else {
        const res = await api.post('/membresias', membresiaDraft);
        setMembresiasData([...membresiasData, res.data]);
      }
      setShowMembresiaModal(false);
      setMembresiaDraft({ descripcion: '', precio: '' , incluye_rutinas: false, titulo: '' });
    } catch (err) {
      console.error("Error al guardar membresía:", err);
    }
  };

  const handleAbrirEdicionEtiqueta = (tag = null) => {
    if (tag) {
      setEtiquetaDraft({ id_etiqueta: tag.id_etiqueta, titulo: tag.titulo });
    } else {
      setEtiquetaDraft({ titulo: '' });
    }
    setShowEtiquetaModal(true);
  };

  const handleToggleActivoEtiqueta = async (id_etiqueta, estadoActual) => {
    try {
      if (estadoActual) {
        await api.delete(`/etiquetas/${id_etiqueta}`);
      } else {
        await api.patch(`/etiquetas/${id_etiqueta}/activar`);
      }
      setEtiquetasData(prev => prev.map(e => e.id_etiqueta === id_etiqueta ? { ...e, activo: !estadoActual } : e));
    } catch (err) {
      console.error("Error al cambiar estado de etiqueta:", err);
    }
  };

  const handleGuardarEtiqueta = async (e) => {
    e.preventDefault();
    try {
      if (etiquetaDraft.id_etiqueta) {
        const res = await api.put(`/etiquetas/${etiquetaDraft.id_etiqueta}`, etiquetaDraft);
        setEtiquetasData(etiquetasData.map(e => e.id_etiqueta === etiquetaDraft.id_etiqueta ? res.data : e));
      } else {
        const res = await api.post('/etiquetas', etiquetaDraft);
        setEtiquetasData([...etiquetasData, res.data]);
      }
      setShowEtiquetaModal(false);
      setEtiquetaDraft({ titulo: '' });
    } catch (err) {
      console.error("Error al guardar etiqueta:", err);
      alert("Hubo un problema al guardar la etiqueta.");
    }
  };

  const filteredVideos = videosData.filter(v => {
    const matchText = v.titulo.toLowerCase().includes(videoSearchTerm.toLowerCase());
    const matchCat = filtroCategoria === '' || v.categoria?.titulo === filtroCategoria;
    const matchTag = filtroEtiqueta === '' || (v.etiquetas && v.etiquetas.some(e => e.titulo === filtroEtiqueta));
    return matchText && matchCat && matchTag;
  });

  const handleAbrirEdicionTestimonio = (testimonio = null) => {
    if (testimonio) {
      setTestimonioDraft({
        id_testimonio: testimonio.id_testimonio,
        titulo: testimonio.titulo || '',
        descripcion: testimonio.descripcion || '',
        nombre_alumna: testimonio.nombre_alumna || '',
        imagenes: testimonio.imagenes || [],
        fotos: []
      });
    } else {
      setTestimonioDraft({ titulo: '', descripcion: '', nombre_alumna: '', imagenes: [], fotos: [] });
    }
    setShowTestimonioModal(true);
  };

  const handleToggleActivoTestimonio = async (id_testimonio, estadoActual) => {
    try {
      if (estadoActual) {
        await api.delete(`/testimonios/${id_testimonio}`);
      } else {
        await api.patch(`/testimonios/${id_testimonio}/activar`);
      }
      setTestimonioData(prev => prev.map(t => t.id_testimonio === id_testimonio ? { ...t, activo: !estadoActual } : t));
    } catch (err) {
      console.error("Error al cambiar estado de testimonio:", err);
    }
  };

  const handleGuardarTestimonio = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (testimonioDraft.titulo) formData.append('titulo', testimonioDraft.titulo);
      if (testimonioDraft.descripcion) formData.append('descripcion', testimonioDraft.descripcion);
      if (testimonioDraft.nombre_alumna) formData.append('nombre_alumna', testimonioDraft.nombre_alumna);
      
      if (testimonioDraft.fotos && testimonioDraft.fotos.length > 0) {
        testimonioDraft.fotos.forEach(foto => {
          formData.append('fotos[]', foto);
        });
      }

      if (testimonioDraft.id_testimonio) {
        // En Laravel a veces los PUT con archivos requieren _method = POST o se manejan con POST
        formData.append('_method', 'PUT');
        const res = await api.post(`/testimonios/${testimonioDraft.id_testimonio}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTestimonioData(testimoniosData.map(t => t.id_testimonio === testimonioDraft.id_testimonio ? res.data : t));
      } else {
        const res = await api.post('/testimonios', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTestimonioData([res.data, ...testimoniosData]);
      }
      setShowTestimonioModal(false);
      setTestimonioDraft({ titulo: '', descripcion: '', nombre_alumna: '', fotos: [] });
    } catch (err) {
      console.error("Error al guardar testimonio:", err);
      alert("Hubo un problema al guardar el testimonio.");
    }
  };

  return (
    <div className="animate-fadeIn pb-10 relative">
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1 block">Gestión</span>
        <h2 className="text-4xl font-display text-[#1A1412]">Contenido</h2>
      </div>
      
      <div className="flex bg-[#EAE2D6]/40 p-1.5 rounded-full mb-10 shadow-inner max-w-3xl overflow-x-auto scrollbar-hide">
        {[{ id: 'videos', label: 'Videos' },
        { id: 'disciplinas', label: 'Disciplinas' },
        { id: 'etiquetas', label: 'Etiquetas' },
        { id: 'membresias', label: 'Membresías' },
        { id: 'testimonios', label: 'Testimonios' }].map(tab => (
          <button key={tab.id} onClick={() => setContentTab(tab.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm transition-all ${contentTab === tab.id ? 'bg-white text-[#1A1412] font-bold border-[1.5px] border-[#1A1412] shadow-sm' : 'text-[#87786E] font-semibold hover:text-[#5C524B] border-[1.5px] border-transparent'}`}>{tab.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 animate-slideUp">
          
          {contentTab === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#87786E] text-xs font-semibold">{filteredVideos.length} resultados</span>
                <button onClick={() => handleAbrirEdicionVideo()} className="text-[#87786E] hover:text-[#1A1412] text-sm font-semibold flex items-center gap-1 transition-colors"><Plus size={16} /> Añadir</button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87786E]" size={18} />
                <input type="text" placeholder="Buscar por título..." value={videoSearchTerm} onChange={(e) => setVideoSearchTerm(e.target.value)} className="w-full bg-white border border-[#EAE2D6] text-[#1A1412] text-sm font-medium rounded-full py-3 pl-11 pr-4 focus:outline-none focus:border-[#87786E] shadow-sm transition-colors placeholder:text-[#D9D0C5]"
                />
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Disciplina:</span>
                  <button onClick={() => setFiltroCategoria('')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroCategoria === '' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Todas</button>
                  {categoriasData.map(cat => (
                    <button key={cat.id_categoria || cat.id} onClick={() => setFiltroCategoria(cat.titulo)} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroCategoria === cat.titulo ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>{cat.titulo}</button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-[10px] uppercase font-bold text-[#87786E] whitespace-nowrap mr-1">Etiqueta:</span>
                  <button onClick={() => setFiltroEtiqueta('')} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEtiqueta === '' ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>Todas</button>
                  {etiquetasData.map(tag => (
                    <button key={tag.id_etiqueta} onClick={() => setFiltroEtiqueta(tag.titulo)} className={`whitespace-nowrap text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-colors border ${filtroEtiqueta === tag.titulo ? 'bg-[#384230] text-[#FAF7F2] border-[#384230]' : 'bg-transparent text-[#87786E] border-[#EAE2D6] hover:border-[#87786E]'}`}>{tag.titulo}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-start md:items-center gap-3 bg-[#FAF7F2] border border-[#EAE2D6] p-4 rounded-[1.25rem] mb-6 shadow-sm">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Star size={16} className="text-[#E56B6F] fill-[#E56B6F]" />
                </div>
                <p className="text-xs text-[#5C524B] leading-relaxed">
                  Los videos marcados son <strong className="text-[#1A1412]">Públicos (Gratuitos)</strong> que aparecerán en la sección de prueba.
                </p>
              </div>

              {cargando ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div></div>
              ) : filteredVideos.length === 0 ? (
                <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-8 text-center shadow-sm text-[#87786E] text-sm">No se encontraron videos.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredVideos.map(video => (
                    <div key={video.id_ejercicio} className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-4 pr-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-[#1A1412] text-[15px] font-bold leading-tight">{video.titulo}</span>
                        <div className="flex items-center gap-1.5 text-[#87786E] text-[11px] font-medium">
                          <span>{video.categoria?.titulo || 'Sin categoría'}</span><span>·</span>
                          
                          <span className="flex items-center gap-0.5 text-[#E56B6F]">
                            <Bookmark size={10} className="fill-[#E56B6F]" /> 
                            {video.favoritos_count || video.guardados || 0}
                          </span>
                        
                        </div>
                        {video.etiquetas && video.etiquetas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {video.etiquetas.map(et => (
                              <span key={et.id_etiqueta} className="bg-[#FAF7F2] border border-[#EAE2D6] text-[#87786E] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                {et.titulo}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => handleTogglePrueba(video.id_ejercicio, video.es_de_prueba)} className={`p-1.5 rounded-full transition-colors ${video.es_de_prueba ? 'text-[#E56B6F] bg-[#E56B6F]/10' : 'text-[#D9D0C5] hover:text-[#87786E]'}`} title={video.es_de_prueba ? "Video de prueba (Gratis)" : "Video normal"}>
                          <Star size={18} className={video.es_de_prueba ? "fill-[#E56B6F]" : ""} />
                        </button>
                        <button className="text-[#D9D0C5] hover:text-[#87786E] transition-colors" onClick={() => handleAbrirEdicionVideo(video)}><Pencil size={18} /></button>
                        <CustomToggle isVisible={video.activo} onToggle={() => handleToggleActivoVideo(video.id_ejercicio, video.activo)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disciplinas */}
          {contentTab === 'disciplinas' && (
            <div className="animate-slideUp">
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-[#87786E] text-xs font-bold">{categoriasData.length} disciplinas totales</span>
                <button onClick={() => handleAbrirEdicionCategoria()} className="text-[#87786E] hover:text-[#1A1412] text-sm font-bold flex items-center gap-1 transition-colors"><Plus size={16} /> Añadir</button>
              </div>

              <div className="flex flex-col gap-5">
                 {categoriasData.map(disc => {
                   const idCat = disc.id_categoria || disc.id;
                   return (
                     <div key={idCat} className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 md:p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-5 pr-2 overflow-hidden">
                         <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#384230] font-bold text-xl flex-shrink-0">{disc.titulo.charAt(0)}</div>
                         <div className="flex flex-col gap-1 min-w-0">
                           <span className="text-[#1A1412] text-base font-bold leading-tight truncate">{disc.titulo}</span>
                           <span className="text-[#87786E] text-xs font-medium truncate max-w-[200px] md:max-w-xs">{disc.descripcion}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
                         <button className="text-[#D9D0C5] hover:text-[#87786E] transition-colors" onClick={() => handleAbrirEdicionCategoria(disc)}>
                           <Pencil size={20} />
                         </button>
                         <CustomToggle isVisible={disc.activo} onToggle={() => handleToggleActivoCategoria(idCat, disc.activo)} />
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

          {contentTab === 'etiquetas' && (
          <div className="animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#87786E] text-xs font-bold">{etiquetasData.length} etiquetas totales</span>
              <button onClick={() => handleAbrirEdicionEtiqueta()} className="text-[#87786E] hover:text-[#1A1412] text-sm font-bold flex items-center gap-1 transition-colors"><Plus size={16} /> Añadir</button>
            </div>
            <div className="flex flex-col gap-5">
              {etiquetasData.map(tag => {
                const totalVideosAsociados = videosData.filter(v => 
                  v.etiquetas && v.etiquetas.some(e => e.id_etiqueta === tag.id_etiqueta)
                ).length;

                return (
                  <div key={tag.id_etiqueta} className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 md:p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FAF7F2] border border-[#EAE2D6] rounded-full flex items-center justify-center text-[#384230] font-bold text-sm flex-shrink-0">
                        {tag.titulo.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#1A1412] text-base font-bold leading-tight">{tag.titulo}</span>
                        <span className="text-[#87786E] text-xs font-medium">
                          {totalVideosAsociados} {totalVideosAsociados === 1 ? 'video' : 'videos'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
                      <button className="text-[#D9D0C5] hover:text-[#87786E] transition-colors" onClick={() => handleAbrirEdicionEtiqueta(tag)}><Pencil size={20} /></button>
                      <CustomToggle isVisible={tag.activo} onToggle={() => handleToggleActivoEtiqueta(tag.id_etiqueta, tag.activo)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {contentTab === 'membresias' && (
          <div className="animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#87786E] text-xs font-bold">{membresiasData.length} planes</span>
                <button onClick={() => handleAbrirEdicionMembresia()} className="text-[#87786E] hover:text-[#1A1412] text-sm font-bold flex items-center gap-1 transition-colors"><Plus size={16} /> Añadir</button>
            </div>

            <div className="flex items-start md:items-center gap-3 bg-[#FAF7F2] border border-[#EAE2D6] p-4 rounded-[1.25rem] mb-6 shadow-sm">
              <div className="p-2 bg-white rounded-full shadow-sm flex-shrink-0">
                <Star size={16} className="text-[#E56B6F] fill-[#E56B6F]" />
              </div>
              <p className="text-xs text-[#5C524B] leading-relaxed">
                El plan marcado se destacará como <strong className="text-[#1A1412]">Popular</strong> en la página principal.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {membresiasData.map(plan => {
                const idPlan = plan.id_nivel || plan.id;
                const esPopular = Boolean(plan.es_popular);
                   
                return (
                  <div key={idPlan} className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 md:p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-1 pr-4 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1A1412] text-base font-bold leading-tight">{plan.titulo}</span>
                        {esPopular && <span className="bg-[#E56B6F]/10 text-[#E56B6F] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1"><Star size={10} className="fill-[#E56B6F]" /> Popular</span>}
                      </div>
                      <span className="text-[#87786E] text-[13px] font-bold">${plan.precio} / mes</span>
                      {plan.descripcion && (
                        <span className="text-[#87786E] text-xs font-medium line-clamp-2 mt-1">
                          {plan.descripcion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                      <button 
                        onClick={async () => {
                          const nuevoEstado = !esPopular;
                          try {
                            await api.put(`/membresias/${idPlan}`, { 
                              titulo: plan.titulo,
                              descripcion: plan.descripcion,
                              precio: plan.precio,
                              incluye_rutinas: plan.incluye_rutinas,
                              es_popular: nuevoEstado 
                            });
                            setMembresiasData(prev => prev.map(m => (m.id_nivel || m.id) === idPlan ? { ...m, es_popular: nuevoEstado } : m));
                          } catch (err) {
                            console.error("Error al actualizar popularidad:", err);
                          }
                        }} 
                        className={`p-1.5 rounded-full transition-colors ${esPopular ? 'text-[#E56B6F] bg-[#E56B6F]/10' : 'text-[#D9D0C5] hover:text-[#87786E]'}`} 
                        title={esPopular ? "Plan Popular" : "Marcar como Popular"}
                      >
                        <Star size={18} className={esPopular ? "fill-[#E56B6F]" : ""} />
                      </button>

                      <button className="text-[#D9D0C5] hover:text-[#87786E] transition-colors" onClick={() => handleAbrirEdicionMembresia(plan)}>
                        <Pencil size={20} />
                      </button>
                      <CustomToggle isVisible={plan.activo} onToggle={() => handleToggleActivoMembresia(idPlan, plan.activo)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {contentTab === 'testimonios' && (
          <div className="animate-slideUp">
              
            <div className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 mb-6 flex items-center justify-between shadow-sm">
              <div className="flex flex-col pr-4">
                <span className="text-[#1A1412] text-sm font-bold">Mostrar sección en la página de inicio</span>
                <span className="text-[#87786E] text-xs">Si se desactiva, la sección de testimonios se ocultará por completo para los visitantes.</span>
              </div>
              <CustomToggle isVisible={perfilGeneral?.mostrar_testimonios ?? true} onToggle={async () => {
                  const estadoActual = perfilGeneral?.mostrar_testimonios ?? true;
                  const nuevoEstado = !estadoActual;
                  
                  setPerfilGeneral(prev => ({ ...prev, mostrar_testimonios: nuevoEstado }));
                  try {
                    if (!perfilGeneral?.id_perfil) {
                      const res = await api.post('/perfil-entrenadora', {
                        mostrar_testimonios: nuevoEstado
                      });
                      setPerfilGeneral(res.data.data || res.data);
                    } else {
                      await api.put(`/perfil-entrenadora/${perfilGeneral.id_perfil}`, {
                        mostrar_testimonios: nuevoEstado
                      });
                    }
                  } catch (err) {
                    console.error("Error al cambiar visibilidad de la sección", err);
                    setPerfilGeneral(prev => ({ ...prev, mostrar_testimonios: estadoActual }));
                    alert("Error de conexión. No se pudo guardar el cambio.");
                  }
                }} 
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-[#87786E] text-xs font-bold">{testimoniosData.length} testimonios totales</span>
              <button onClick={() => handleAbrirEdicionTestimonio()} className="text-[#87786E] hover:text-[#1A1412] text-sm font-bold flex items-center gap-1 transition-colors"><Plus size={16} /> Añadir</button>
            </div>

            <div className="flex flex-col gap-5">
              {testimoniosData.map(item => (
                <div key={item.id_testimonio} className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-5 md:p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 pr-2">
                    <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#384230] font-bold text-sm flex-shrink-0 overflow-hidden border border-[#EAE2D6]">
                      {item.imagenes && item.imagenes.length > 0 ? (
                        <img src={item.imagenes[0].url_foto} alt="Miniatura" className="w-full h-full object-cover" />
                      ) : (
                        <span>VIF</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#1A1412] text-base font-bold leading-tight">
                        {item.nombre_alumna || item.titulo || 'Testimonio sin título'}
                      </span>
                      <span className="text-[#87786E] text-xs font-medium line-clamp-1 max-w-xs">
                        {item.descripcion || 'Sin descripción'}
                      </span>
                      <span className="text-[10px] text-[#384230] font-bold">
                        {item.imagenes?.length || 0} foto(s) adjunta(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
                    <button className="text-[#D9D0C5] hover:text-[#87786E] transition-colors" onClick={() => handleAbrirEdicionTestimonio(item)}>
                      <Pencil size={20} />
                    </button>
                    <CustomToggle isVisible={item.activo} onToggle={() => handleToggleActivoTestimonio(item.id_testimonio, item.activo)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

        <div className="hidden lg:flex flex-col gap-5 lg:col-span-4 sticky top-8 animate-fadeIn">
          
          <div className="bg-white border border-[#EAE2D6] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-[#87786E]" />
              <h3 className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold">Resumen de Catálogo</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D6]/50">
                <span className="text-sm font-medium text-[#1A1412]">Total de videos</span>
                <span className="text-sm font-bold text-[#384230] bg-[#FAF7F2] px-2.5 py-1 rounded-lg">{videosData.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D6]/50">
                <span className="text-sm font-medium text-[#1A1412]">Videos Activos</span>
                <span className="text-sm font-bold text-[#384230] bg-[#FAF7F2] px-2.5 py-1 rounded-lg">{videosData.filter(v => v.activo).length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE2D6]/50">
                <span className="text-sm font-medium text-[#1A1412]">Videos de Prueba</span>
                <span className="text-sm font-bold text-[#E56B6F] bg-[#E56B6F]/10 px-2.5 py-1 rounded-lg">{videosData.filter(v => v.es_de_prueba).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-medium text-[#1A1412]">Disciplinas Activas</span>
                <span className="text-sm font-bold text-[#384230] bg-[#FAF7F2] px-3 py-1.5 rounded-lg">
                  {categoriasData.filter(c => c.activo).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center text-center gap-3">
             <span className="w-10 h-10 bg-white border border-[#EAE2D6] rounded-full flex items-center justify-center shadow-sm text-[#87786E]"><Info size={18} /></span>
             <h4 className="text-[#1A1412] font-bold text-[13px]">Organización de contenido</h4>
             <p className="text-[#87786E] text-[11px] leading-relaxed">
               Las <span className="font-bold">etiquetas</span> ayudan a tus alumnas a buscar videos más allá de la disciplina principal. Úsalas para identificar equipo, intensidad o grupos musculares.
             </p>
          </div>

        </div>
      </div>

      {showVideoModal && (
        <VideoModal videoDraft={videoDraft} setVideoDraft={setVideoDraft} categoriasData={categoriasData} etiquetasData={etiquetasData} onClose={() => setShowVideoModal(false)} onGuardar={handleGuardarVideo} />
      )}
      {showCategoriaModal && (
        <CategoriaModal categoriaDraft={categoriaDraft} setCategoriaDraft={setCategoriaDraft} onClose={() => setShowCategoriaModal(false)} onGuardar={handleGuardarCategoria} />
      )}
      {showEtiquetaModal && (
        <EtiquetaModal etiquetaDraft={etiquetaDraft} setEtiquetaDraft={setEtiquetaDraft} onClose={() => setShowEtiquetaModal(false)} onGuardar={handleGuardarEtiqueta} />
      )}
      {showMembresiaModal && (
        <MembresiaModal membresiaDraft={membresiaDraft} setMembresiaDraft={setMembresiaDraft} onClose={() => setShowMembresiaModal(false)} onGuardar={handleGuardarMembresia} />
      )}
      {showTestimonioModal && (
        <TestimonioModal testimonioDraft={testimonioDraft} setTestimonioDraft={setTestimonioDraft} onClose={() => setShowTestimonioModal(false)} onGuardar={handleGuardarTestimonio} />
      )}
    </div>
  );
}