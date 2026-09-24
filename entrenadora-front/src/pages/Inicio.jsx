import { useState, useEffect } from 'react';
import api from '../api';

import Hero from '../components/Inicio/Hero';
import Stats from '../components/Inicio/Stats';
import Activities from '../components/Inicio/Activities';
import PreviewExercises from '../components/Inicio/PreviewExercises';
import Gallery from '../components/Inicio/Gallery';
import Memberships from '../components/Inicio/Memberships';
import Contact from '../components/Inicio/Contact';
import Footer from '../components/Global/Footer';
import TestimoniosSection from '../components/Inicio/TestimoniosSection';

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  
  const [testimonios, setTestimonios] = useState([]);

  const [perfil, setPerfil] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [ejerciciosPrueba, setEjerciciosPrueba] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchDatosInicio = async () => {
      try {
        const [resPerfil, resCat, resEje, resGal, resMem, resCon, resTest] = await Promise.all([
          api.get('/perfil-entrenadora').catch(() => ({ data: [] })),
          api.get('/categorias').catch(() => ({ data: [] })),
          api.get('/ejercicios').catch(() => ({ data: [] })),
          api.get('/galerias').catch(() => ({ data: [] })),
          api.get('/membresias').catch(() => ({ data: [] })),
          api.get('/contactos').catch(() => ({ data: [] })),
          api.get('/testimonios').catch(() => ({ data: [] })) 
        ]);

        let datosPerfil = resPerfil.data;
        if (Array.isArray(datosPerfil)) datosPerfil = datosPerfil.length > 0 ? datosPerfil[0] : {};
        else if (datosPerfil?.data) datosPerfil = Array.isArray(datosPerfil.data) ? datosPerfil.data[0] : datosPerfil.data;
        setPerfil(datosPerfil || {});

        const extraerArray = (respuesta) => {
          if (!respuesta || !respuesta.data) return [];
          if (Array.isArray(respuesta.data)) return respuesta.data;
          if (Array.isArray(respuesta.data.data)) return respuesta.data.data;
          if (typeof respuesta.data === 'object') return Object.values(respuesta.data);
          return [];
        };

        const listCat = extraerArray(resCat);
        const listEje = extraerArray(resEje);
        const listGal = extraerArray(resGal);
        const listMem = extraerArray(resMem);
        const listCon = extraerArray(resCon);
        const listTest = extraerArray(resTest);

        setCategorias(listCat.filter(c => Boolean(c.activo) === true));
        setEjerciciosPrueba(listEje.filter(e => Boolean(e.activo) === true && Boolean(e.es_de_prueba) === true));
        setGaleria(listGal.filter(g => Boolean(g.activo) === true));
        setMembresias(listMem.filter(m => Boolean(m.activo) === true));
        setContactos(listCon); 

        const testimoniosMapeados = listTest
          .filter(t => Boolean(t.activo) === true)
          .map(t => ({
            id_testimonio: t.id_testimonio,
            titulo: t.titulo,
            descripcion: t.descripcion,
            nombreAlumna: t.nombre_alumna,
            fotos: t.imagenes ? t.imagenes.map(img => img.url_foto) : []
          }));

        setTestimonios(testimoniosMapeados);

      } catch (error) {
        console.error("Error al cargar la web:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDatosInicio();
  }, []);

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#EAE2D6] border-t-[#384230] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tituloSeguro = perfil?.titulo || perfil?.titulo_principal || "Entrenadora personal & coach de bienestar integral";
  const biografiaSegura = perfil?.biografia || perfil?.descripcion || "Acompañándote a transformar tu cuerpo y mente con métodos personalizados.";
  const expSegura = perfil?.anos_experiencia || "10+";
  const alumnasSegura = perfil?.cantidad_alumnas || perfil?.alumnas || "200+";
  const categoriasSegura = perfil?.cantidad_disciplinas || "5+";
  const fotoSegura = perfil?.url_foto || "home_perfil.jpg";

  return (
    <main className="flex flex-col relative animate-fadeIn min-h-screen">
      
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 w-full flex flex-col">
        <section id="hero" className="w-full">
          <Hero 
            titulo={tituloSeguro}
            biografia={biografiaSegura} 
            urlFoto={fotoSegura} 
          />
          <Stats 
            exp={expSegura}
            alumnas={alumnasSegura}
            disciplinas={categoriasSegura} 
          />
        </section>
        
        <Activities categorias={categorias} />
        <PreviewExercises ejercicios={ejerciciosPrueba} />
        <Gallery imagenes={galeria} />
        <Memberships membresias={membresias} contactos={contactos} />
        {perfil?.mostrar_testimonios !== false && testimonios.length > 0 && (
          <TestimoniosSection testimonios={testimonios} />
        )}

        <Contact contactos={contactos} />
        <Footer />
      </div>
      
    </main>
  );
}