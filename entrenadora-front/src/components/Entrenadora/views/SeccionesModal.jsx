import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export default function SeccionesModal({ seccionesIniciales = [], onClose, onGuardar }) {
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const ordenadas = [...seccionesIniciales].sort((a, b) => (a.orden || 0) - (b.orden || 0));
        setSecciones(ordenadas);
    }, [seccionesIniciales]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleAddSeccion = () => {
        setSecciones([
        ...secciones,
            {
                id_seccion: null,
                titulo: '',
                descripcion: '',
                activo: true,
                orden: secciones.length
            }
        ]);
    };

    const handleChange = (index, field, value) => {
        const nuevas = [...secciones];
        nuevas[index][field] = value;
        setSecciones(nuevas);
    };

    const handleDelete = (index) => {
        if (window.confirm("¿Seguro que deseas eliminar este bloque de información?")) {
            const nuevas = secciones.filter((_, i) => i !== index);
            nuevas.forEach((sec, i) => sec.orden = i);
            setSecciones(nuevas);
        }
    };

    const handleMove = (index, direccion) => {
        const nuevas = [...secciones];
        if (direccion === 'arriba' && index > 0) {
            [nuevas[index - 1], nuevas[index]] = [nuevas[index], nuevas[index - 1]];
        } else if (direccion === 'abajo' && index < nuevas.length - 1) {
            [nuevas[index + 1], nuevas[index]] = [nuevas[index], nuevas[index + 1]];
        }
        nuevas.forEach((sec, i) => sec.orden = i);
        setSecciones(nuevas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const invalidas = secciones.some(s => !s.titulo.trim() || !s.descripcion.trim());
        if (invalidas) {
            alert("Por favor, completa el título y la descripción de todos los bloques.");
            return;
        }
        onGuardar(secciones);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1412]/40 backdrop-blur-sm px-4 py-6 animate-fadeIn">
            <div className="bg-[#FAF7F2] w-full max-w-3xl max-h-full rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                
                <div className="bg-white px-6 md:px-8 py-5 border-b border-[#EAE2D6] flex justify-between items-center z-10 flex-shrink-0">
                    <div>
                        <h3 className="text-xl md:text-2xl font-display text-[#1A1412] font-semibold leading-none mb-1">Bloques de Información</h3>
                        <p className="text-[#87786E] text-xs font-medium">Agrega información extra para tu página de inicio (acordeones)</p>
                    </div>
                    <button onClick={onClose} className="text-[#87786E] hover:text-[#1A1412] transition-colors p-2 bg-[#FAF7F2] rounded-full hover:bg-[#EAE2D6]">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {secciones.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-[#EAE2D6] rounded-[1.5rem] shadow-sm">
                            <p className="text-[#87786E] text-sm mb-4">No tienes bloques de información adicionales.</p>
                        </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                            {secciones.map((seccion, index) => (
                                <div key={index} className={`bg-white border ${seccion.activo ? 'border-[#EAE2D6]' : 'border-dashed border-[#D9D0C5] opacity-75'} rounded-[1.5rem] p-5 shadow-sm relative transition-all`}>
                                
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#FAF7F2]">
                                        <span className="bg-[#FAF7F2] text-[#87786E] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        Bloque {index + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleMove(index, 'arriba')} disabled={index === 0} className="p-1.5 text-[#87786E] hover:text-[#1A1412] hover:bg-[#FAF7F2] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                                                <ArrowUp size={18} />
                                            </button>
                                            <button type="button" onClick={() => handleMove(index, 'abajo')} disabled={index === secciones.length - 1} className="p-1.5 text-[#87786E] hover:text-[#1A1412] hover:bg-[#FAF7F2] rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                                                <ArrowDown size={18} />
                                            </button>
                                            <div className="w-[1px] h-4 bg-[#EAE2D6] mx-1"></div>
                                            <button type="button" onClick={() => handleChange(index, 'activo', !seccion.activo)} className={`p-1.5 rounded-md transition-colors ${seccion.activo ? 'text-[#384230] hover:bg-[#FAF7F2]' : 'text-[#87786E] bg-[#FAF7F2]'}`} title={seccion.activo ? 'Ocultar bloque' : 'Mostrar bloque'}>
                                                {seccion.activo ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button type="button" onClick={() => handleDelete(index)} className="p-1.5 text-[#D97777] hover:bg-[#FFF5F5] rounded-md transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-1.5">Título del bloque</label>
                                            <input 
                                                type="text" 
                                                value={seccion.titulo}
                                                onChange={(e) => handleChange(index, 'titulo', e.target.value)}
                                                placeholder="Ej: Sobre el método VIF"
                                                className="w-full bg-[#FAF7F2] border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] text-[#1A1412] font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-[#87786E] font-bold block mb-1.5">Descripción</label>
                                            <textarea 
                                                value={seccion.descripcion}
                                                onChange={(e) => handleChange(index, 'descripcion', e.target.value)}
                                                placeholder="Escribe todo el contenido aquí..."
                                                rows={4}
                                                className="w-full bg-[#FAF7F2] border border-[#EAE2D6] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#384230] text-[#1A1412] resize-none"
                                            />
                                        </div>
                                    </div>

                                    {!seccion.activo && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-[1.5rem] pointer-events-none flex items-center justify-center">
                                            <span className="bg-white/90 text-[#87786E] text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">Bloque Oculto</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        type="button" 
                        onClick={handleAddSeccion}
                        className="w-full mt-6 border-2 border-dashed border-[#D9D0C5] hover:border-[#384230] bg-transparent hover:bg-white text-[#87786E] hover:text-[#384230] text-sm font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Añadir nuevo bloque
                    </button>
                </div>

                <div className="bg-white p-6 border-t border-[#EAE2D6] flex-shrink-0">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-[#384230] text-white text-sm font-bold py-4 rounded-full hover:bg-[#2A3323] transition-colors shadow-md"
                    >
                        Guardar Cambios
                    </button>
                </div>

            </div>
        </div>
    );
}