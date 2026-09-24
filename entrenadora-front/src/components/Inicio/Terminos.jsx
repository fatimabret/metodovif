import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../Global/Footer';
import api from '../../api';

export default function Terminos() {
  const [seccionesTerminos, setSeccionesTerminos] = useState([]);
  const [fechaActualizacion, setFechaActualizacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const res = await api.get('/perfil-entrenadora');
        
        let datosPerfil = res.data;
        if (Array.isArray(datosPerfil)) datosPerfil = datosPerfil.length > 0 ? datosPerfil[0] : {};
        else if (datosPerfil?.data) datosPerfil = Array.isArray(datosPerfil.data) ? datosPerfil.data[0] : datosPerfil.data;
        
        if (datosPerfil?.updated_at) {
          setFechaActualizacion(datosPerfil.updated_at);
        }

        let terminosArray = [];
        if (datosPerfil?.terminos_condiciones) {
          try {
            terminosArray = JSON.parse(datosPerfil.terminos_condiciones);
          } catch (e) {
            console.error("Error parseando los términos:", e);
          }
        }
        
        setSeccionesTerminos(terminosArray);
      } catch (error) {
        console.error("Error cargando términos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchTerminos();
  }, []);

  const fechaFormateada = fechaActualizacion 
    ? new Date(fechaActualizacion).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#1A1412]">
      <div className="max-w-3xl mx-auto w-full px-6 py-12 md:py-20 flex-grow">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[#87786E] hover:text-[#384230] font-medium text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="text-4xl md:text-5xl font-display text-[#1A1412] mb-4">Términos y Condiciones</h1>
        
        {fechaFormateada && (
          <p className="text-[#87786E] text-sm mb-12 uppercase tracking-widest font-semibold">
            Última actualización: {fechaFormateada}
          </p>
        )}

        <div className="bg-white border border-[#EAE2D6] rounded-3xl p-6 md:p-10 shadow-sm">
          {cargando ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
            </div>
          ) : seccionesTerminos.length === 0 ? (
            <p className="text-[#87786E] text-center py-10">Los términos y condiciones aún no han sido configurados.</p>
          ) : (
            <div className="space-y-8 text-[#5C524B] leading-relaxed text-sm md:text-base">
              {seccionesTerminos.map((seccion, index) => (
                <section key={index}>
                  {seccion.titulo && (
                    <h2 className="text-lg font-bold text-[#1A1412] mb-3">{seccion.titulo}</h2>
                  )}
                  <p className="whitespace-pre-line">{seccion.descripcion}</p>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}