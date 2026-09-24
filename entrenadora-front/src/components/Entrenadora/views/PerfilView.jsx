import { useState, useEffect } from 'react';
import { Camera, Trash2, Plus, ImageIcon, MessageCircle, Mail, Pencil, Link as LinkIcon, FileText, ChevronRight, KeyRound, X, Info } from 'lucide-react';
import api from '../../../api';
import PerfilModal from './PerfilModal';
import ContactoModal from './ContactoModal';
import FotoModal from './FotoModal';
import TerminosModal from './TerminosModal';

export default function PerfilView() {
  const [perfil, setPerfil] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [archivoPerfil, setArchivoPerfil] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);

  const [showEditPerfil, setShowEditPerfil] = useState(false);
  const [showAddFoto, setShowAddFoto] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTerminosModal, setShowTerminosModal] = useState(false);

  const [perfilDraft, setPerfilDraft] = useState({});
  const [terminosDraft, setTerminosDraft] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState({ descripcion: '' });
  const [contactoDraft, setContactoDraft] = useState({ plataforma: 'WhatsApp', valor_visible: '', url_destino: '' });

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
      } else if (error.response?.data?.mensaje) {
        setPassError(error.response.data.mensaje);
      } else {
        setPassError('Error al actualizar la contraseña.');
      }
    } finally {
      setCargandoPass(false);
    }
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resPerfil, resGaleria, resContactos] = await Promise.all([
          api.get('/perfil-entrenadora'),
          api.get('/galerias'),
          api.get('/contactos')
        ]);
        
        setPerfil(resPerfil.data[0] || null);
        setGaleria(resGaleria.data || []);
        setContactos(resContactos.data?.data || resContactos.data || []);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  const handleAbrirEdicion = () => {
    setPerfilDraft(perfil || { titulo_principal: '', biografia: '', anos_experiencia: '', cantidad_alumnas: '', cantidad_disciplinas: '' });
    setShowEditPerfil(true);
  };

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (perfil?.id_perfil) {
        if (archivoPerfil) {
          const formData = new FormData();
          formData.append('titulo_principal', perfilDraft.titulo_principal || '');
          formData.append('biografia', perfilDraft.biografia || '');
          formData.append('anos_experiencia', perfilDraft.anos_experiencia || '');
          formData.append('cantidad_alumnas', perfilDraft.cantidad_alumnas || '');
          formData.append('cantidad_disciplinas', perfilDraft.cantidad_disciplinas || '');

          formData.append('terminos_condiciones', perfil?.terminos_condiciones || ''); 
          formData.append('foto', archivoPerfil);
          formData.append('_method', 'PUT');

          res = await api.post(`/perfil-entrenadora/${perfil.id_perfil}`, formData, { 
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const payload = {
            titulo_principal: perfilDraft.titulo_principal,
            biografia: perfilDraft.biografia,
            anos_experiencia: perfilDraft.anos_experiencia,
            cantidad_alumnas: perfilDraft.cantidad_alumnas,
            cantidad_disciplinas: perfilDraft.cantidad_disciplinas,
            terminos_condiciones: perfil?.terminos_condiciones || '' 
          };
          res = await api.put(`/perfil-entrenadora/${perfil.id_perfil}`, payload);
        }
      } else {
        const formData = new FormData();
        formData.append('titulo_principal', perfilDraft.titulo_principal || '');
        formData.append('biografia', perfilDraft.biografia || '');
        formData.append('anos_experiencia', perfilDraft.anos_experiencia || '');
        formData.append('cantidad_alumnas', perfilDraft.cantidad_alumnas || '');
        formData.append('cantidad_disciplinas', perfilDraft.cantidad_disciplinas || '');
        formData.append('terminos_condiciones', perfil?.terminos_condiciones || '');
        if (archivoPerfil) formData.append('foto', archivoPerfil);

        res = await api.post('/perfil-entrenadora', formData, { 
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setPerfil(res.data);
      setShowEditPerfil(false);
      setArchivoPerfil(null);
    } catch (error) {
      console.error("Error guardando perfil:", error);
    }
  };

  const handleAbrirTerminos = () => {
    let terminosParseados = [];
    try {
      terminosParseados = perfil?.terminos_condiciones ? JSON.parse(perfil.terminos_condiciones) : [];
    } catch (e) { terminosParseados = []; }
    setTerminosDraft(terminosParseados);
    setShowTerminosModal(true);
  };

  const handleGuardarTerminos = async (e) => {
    e?.preventDefault();
    try {
      const payloadTerminos = JSON.stringify(terminosDraft);
      
      const payload = {
        titulo_principal: perfil?.titulo_principal || '',
        biografia: perfil?.biografia || '',
        anos_experiencia: perfil?.anos_experiencia || '',
        cantidad_alumnas: perfil?.cantidad_alumnas || '',
        cantidad_disciplinas: perfil?.cantidad_disciplinas || '',
        terminos_condiciones: payloadTerminos
      };
      
      let res;
      if (perfil?.id_perfil) {
         res = await api.put(`/perfil-entrenadora/${perfil.id_perfil}`, payload);
      } else {
         res = await api.post('/perfil-entrenadora', payload);
      }
      
      setPerfil(res.data);
      setShowTerminosModal(false);
    } catch (error) {
      console.error("Error guardando términos:", error);
    }
  };

  const handleSubirFoto = async (e) => {
    e.preventDefault();
    if (!archivoFoto) return alert("Selecciona una imagen.");
    const formData = new FormData();
    formData.append('foto', archivoFoto);
    if (nuevaFoto.descripcion) formData.append('descripcion', nuevaFoto.descripcion);
    try {
      const res = await api.post('/galerias', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setGaleria([...galeria, res.data]);
      setShowAddFoto(false);
      setArchivoFoto(null);
      setNuevaFoto({ descripcion: '' });
    } catch (error) {}
  };

  const handleEliminarFoto = async (id) => {
    if(!window.confirm("¿Segura que deseas eliminar esta foto?")) return;
    try {
      await api.delete(`/galerias/${id}`);
      setGaleria(galeria.filter(f => f.id_galeria !== id));
    } catch (error) {}
  };

  const handleGuardarContacto = async (e) => {
    e.preventDefault();
    try {
      const idContacto = contactoDraft.id_contacto || contactoDraft.id;
      if (idContacto) {
        const res = await api.put(`/contactos/${idContacto}`, contactoDraft);
        const contactoActualizado = res.data.contacto || res.data;
        setContactos(contactos.map(c => (c.id_contacto || c.id) === idContacto ? contactoActualizado : c));
      } else {
        const res = await api.post('/contactos', contactoDraft);
        const nuevoContacto = res.data.contacto || res.data;
        setContactos([...contactos, nuevoContacto]);
      }
      setShowContactModal(false);
      setContactoDraft({ plataforma: 'WhatsApp', valor_visible: '', url_destino: '' });
    } catch (error) {}
  };

  const handleEliminarContacto = async (id) => {
    if(!window.confirm("¿Deseas eliminar este medio de contacto?")) return;
    try {
      await api.delete(`/contactos/${id}`);
      setContactos(contactos.filter(c => (c.id_contacto || c.id) !== id));
    } catch (error) {}
  };

  const renderIconoPlataforma = (plataforma) => {
    const p = plataforma.toLowerCase();
    if (p.includes('whatsapp')) return <MessageCircle size={20} className="text-[#4A7C59]" />;
    if (p.includes('instagram')) return <svg className="w-5 h-5 text-[#D97777]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
    if (p.includes('correo') || p.includes('mail')) return <Mail size={20} className="text-[#5C524B]" />;
    return <LinkIcon size={20} className="text-[#87786E]" />;
  };

  if (cargando) return <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div></div>;

  return (
    <div className="animate-fadeIn pb-10 relative">
      
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold mb-1 block">Datos del inicio</span>
          <h2 className="text-4xl font-display text-[#1A1412]">Mi perfil</h2>
        </div>
        <button onClick={handleAbrirEdicion} className="bg-[#EAE2D6]/40 hover:bg-[#EAE2D6] text-[#1A1412] text-sm font-semibold px-5 py-2 rounded-full transition-colors border border-[#EAE2D6]">
          Editar general
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div onClick={handleAbrirEdicion} className="relative cursor-pointer group" title="Hacer clic para editar perfil">
          {perfil?.url_foto ? (
            <img src={perfil.url_foto} alt="Perfil" className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-white transition-opacity group-hover:opacity-90" />
          ) : (
            <div className="w-28 h-28 bg-[#2D2522] rounded-full flex items-center justify-center text-[#FAF7F2] font-display text-5xl shadow-md border-4 border-white transition-opacity group-hover:opacity-90">V</div>
          )}
          <div className="absolute bottom-0 right-0 bg-white border border-[#EAE2D6] p-2.5 rounded-full text-[#1A1412] shadow-sm group-hover:bg-[#FAF7F2] group-hover:scale-105 transition-all">
            <Camera size={18} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#87786E] block mb-1">Título/Subtítulo</span>
          <span className="text-[#1A1412] font-bold text-[15px]">{perfil?.titulo_principal || 'Sin título configurado'}</span>
        </div>
        <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#87786E] block mb-2">Biografía</span>
          <p className="text-[#1A1412] font-medium text-sm leading-relaxed whitespace-pre-line">{perfil?.biografia || 'Sin biografía.'}</p>
        </div>
      </div>

      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-3">Estadísticas del inicio</span>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[9px] uppercase tracking-widest text-[#87786E] font-bold mb-1">Años exp.</span>
            <span className="text-xl md:text-2xl font-display text-[#1A1412] font-bold">{perfil?.anos_experiencia || '-'}</span>
          </div>
          <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[9px] uppercase tracking-widest text-[#87786E] font-bold mb-1">Alumnas</span>
            <span className="text-xl md:text-2xl font-display text-[#1A1412] font-bold">{perfil?.cantidad_alumnas || '-'}</span>
          </div>
          <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-[9px] uppercase tracking-widest text-[#87786E] font-bold mb-1">Disciplinas</span>
            <span className="text-xl md:text-2xl font-display text-[#1A1412] font-bold">{perfil?.cantidad_disciplinas || '-'}</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block">
            Galería del estudio ({galeria.length})
          </span>
          <button onClick={() => setShowAddFoto(true)} className="text-[#87786E] hover:text-[#1A1412] text-xs font-semibold flex items-center gap-1 transition-colors">
            <Plus size={14} /> Añadir foto
          </button>
        </div>

        <p className="text-[11px] text-[#87786E] mb-4 flex items-center gap-1.5 font-medium">
          <Info size={12} className="flex-shrink-0" /> 
          Toca o pasa el cursor sobre una foto para ver la opción de eliminarla.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galeria.map((foto) => (
            <div key={foto.id_galeria} className="relative group bg-white border border-[#EAE2D6] p-1.5 rounded-[1.25rem] shadow-sm">
              <div className="w-full h-24 md:h-32 rounded-xl overflow-hidden bg-[#FAF7F2] relative">
                <img src={foto.url_foto} alt={foto.descripcion} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1A1412]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleEliminarFoto(foto.id_galeria)} className="bg-white text-[#D97777] p-2 rounded-full shadow-lg hover:bg-[#D97777] hover:text-white transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAddFoto(true)} className="w-full h-[108px] md:h-[140px] border-2 border-dashed border-[#D9D0C5] hover:border-[#87786E] rounded-[1.25rem] flex flex-col items-center justify-center gap-2 text-[#87786E] hover:text-[#5C524B] hover:bg-white transition-all">
            <ImageIcon size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium">Subir foto</span>
          </button>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase font-bold text-[#87786E]">Redes y Contacto ({contactos.length})</h3>
          <button onClick={() => { setContactoDraft({ plataforma: 'WhatsApp', valor_visible: '', url_destino: '' }); setShowContactModal(true); }} className="text-[#87786E] hover:text-[#1A1412] text-xs font-semibold flex items-center gap-1 transition-colors">
            <Plus size={14} /> Añadir
          </button>
        </div>
        
        {contactos.length === 0 ? (
          <div className="bg-white border border-[#EAE2D6] rounded-[1.25rem] p-6 text-center shadow-sm">
            <p className="text-[#87786E] text-sm">No has añadido enlaces de contacto.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {contactos.map((contacto) => {
              const idContacto = contacto.id_contacto || contacto.id;
              return (
                <div key={idContacto} className="bg-white p-4 rounded-[1.25rem] border border-[#EAE2D6] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4 text-[#1A1412] font-medium text-sm">
                    {renderIconoPlataforma(contacto.plataforma)}
                    <span>{contacto.valor_visible}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setContactoDraft(contacto); setShowContactModal(true); }} className="text-[#D9D0C5] hover:text-[#87786E] transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleEliminarContacto(idContacto)} className="text-[#D9D0C5] hover:text-[#D97777] transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase font-bold text-[#87786E]">Páginas Legales</h3>
        </div>
        <div 
          onClick={handleAbrirTerminos}
          className="bg-white p-4 md:p-5 rounded-[1.25rem] border border-[#EAE2D6] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer group" 
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#384230] border border-[#EAE2D6]">
               <FileText size={18} />
             </div>
             <div className="flex flex-col">
               <span className="text-[#1A1412] text-sm md:text-base font-bold">Términos y Condiciones</span>
               <span className="text-[#87786E] text-xs">Gestionar secciones y reglas</span>
             </div>
          </div>
          <div className="text-[#D9D0C5] group-hover:text-[#384230] transition-colors pr-2">
             <ChevronRight size={20} />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase font-bold text-[#87786E]">Seguridad</h3>
        </div>
        <div 
          onClick={() => setShowPasswordModal(true)}
          className="bg-white p-4 md:p-5 rounded-[1.25rem] border border-[#EAE2D6] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer group" 
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#384230] border border-[#EAE2D6]">
               <KeyRound size={18} />
             </div>
             <div className="flex flex-col">
               <span className="text-[#1A1412] text-sm md:text-base font-bold">Modificar contraseña</span>
               <span className="text-[#87786E] text-xs">Cambia tu clave de acceso al panel</span>
             </div>
          </div>
          <div className="text-[#D9D0C5] group-hover:text-[#384230] transition-colors pr-2">
             <ChevronRight size={20} />
          </div>
        </div>
      </div>

      {showEditPerfil && (
        <PerfilModal 
          perfilDraft={perfilDraft} 
          setPerfilDraft={setPerfilDraft} 
          setArchivoPerfil={setArchivoPerfil} 
          onClose={() => setShowEditPerfil(false)} 
          onGuardar={handleGuardarPerfil} 
        />
      )}

      {showTerminosModal && (
        <TerminosModal 
          terminosDraft={terminosDraft}
          setTerminosDraft={setTerminosDraft}
          onClose={() => setShowTerminosModal(false)}
          onGuardar={handleGuardarTerminos}
        />
      )}

      {showAddFoto && (
        <FotoModal 
          nuevaFoto={nuevaFoto} 
          setNuevaFoto={setNuevaFoto} 
          setArchivoFoto={setArchivoFoto} 
          onClose={() => setShowAddFoto(false)} 
          onGuardar={handleSubirFoto} 
        />
      )}

      {showContactModal && (
        <ContactoModal 
          contactoDraft={contactoDraft} 
          setContactoDraft={setContactoDraft} 
          onClose={() => setShowContactModal(false)} 
          onGuardar={handleGuardarContacto} 
        />
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 animate-fadeIn">
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
    </div>
  );
}