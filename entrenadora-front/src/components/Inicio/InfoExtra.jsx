import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AcordeonSeccion = ({ titulo, descripcion }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
        <div 
        className="md:hidden bg-[#FAF7F2] rounded-3xl border border-[#EAE2D6] p-6 shadow-sm cursor-pointer transition-colors hover:bg-[#F3EFE9] mb-4 last:mb-0" 
        onClick={() => setIsOpen(!isOpen)}
        >
        <div className="flex justify-between items-center gap-4">
            <h3 className="text-xl font-display font-semibold text-[#1A1412] leading-tight">
            {titulo}
            </h3>
            <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#EAE2D6] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} className="text-[#87786E]" />
            </div>
        </div>
        
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
            <p className="text-[#5C524B] text-sm leading-relaxed whitespace-pre-line pt-2 border-t border-[#EAE2D6]">
                {descripcion}
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default function InfoExtra({ secciones = [] }) {
    if (!secciones || secciones.length === 0) return null;

    return (
        <section className="w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 py-6 md:py-12 bg-white relative z-10">
        
            <div className="flex flex-col md:hidden">
                {secciones.map((seccion, index) => (
                <AcordeonSeccion 
                    key={seccion.id_seccion || index} 
                    titulo={seccion.titulo} 
                    descripcion={seccion.descripcion} 
                />
                ))}
            </div>

            <div className="hidden md:flex flex-col items-center text-center bg-[#FAF7F2] rounded-[2.5rem] border border-[#EAE2D6] p-12 lg:p-16 shadow-sm gap-12">
                {secciones.map((seccion, index) => (
                <div key={seccion.id_seccion || index} className="flex flex-col items-center w-full">
                    <h3 className="text-3xl lg:text-4xl font-display font-semibold text-[#1A1412] mb-6">
                    {seccion.titulo}
                    </h3>
                    <p className="text-[#5C524B] text-base lg:text-lg leading-relaxed whitespace-pre-line max-w-3xl">
                    {seccion.descripcion}
                    </p>
                    
                    {index < secciones.length - 1 && (
                    <div className="w-16 h-[2px] bg-[#D9D0C5] mt-12 rounded-full"></div>
                    )}
                </div>
                ))}
            </div>
        
        </section>
    );
}