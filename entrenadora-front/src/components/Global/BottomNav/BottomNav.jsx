import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, CalendarCheck, MessageCircle, PlayCircle, User } from 'lucide-react';
import AuthModal from '../AuthModal';

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeModal, setActiveModal] = useState(null); 

  const location = useLocation();
  const navigate = useNavigate();

  const estaAutenticado = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    const parametros = new URLSearchParams(location.search);
    
    if (parametros.get('auth') === 'login') {
      setActiveModal('login');
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  // Detector de scroll para actualizar la pestaña activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2.5;

      const planesEl = document.getElementById('planes');
      const contactoEl = document.getElementById('contacto');
      const clasesEl = document.getElementById('ejercicios-prueba');

      if (contactoEl && scrollPosition >= contactoEl.offsetTop) {
        setActiveTab('contacto');
      } else if (planesEl && scrollPosition >= planesEl.offsetTop) {
        setActiveTab('planes');
      } else if (clasesEl && scrollPosition >= clasesEl.offsetTop) {
        setActiveTab('clases');
      } else {
        setActiveTab('inicio');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tabName, sectionId) => {
    setActiveTab(tabName);
    
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAuthClick = () => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (token && rol) {
      navigate(rol === 'entrenadora' ? '/entrenadora' : '/alumna');
    } else {
      setActiveModal('login');
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home, section: 'top' },
    { id: 'clases', label: 'Clases', icon: Dumbbell, section: 'ejercicios-prueba' },
    { id: 'planes', label: 'Planes', icon: CalendarCheck, section: 'planes' },
    { id: 'contacto', label: 'Contacto', icon: MessageCircle, section: 'contacto' },
  ];

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
        <ul className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-white/85 px-2.5 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl m-0 list-none transition-all">
          
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <li 
                key={item.id}
                onClick={() => handleNavClick(item.id, item.section)}
                className={`flex items-center justify-center transition-all duration-300 cursor-pointer rounded-full ${
                  isActive 
                    ? 'bg-[#384230] text-white px-4 py-2.5 gap-2 shadow-md' 
                    : 'p-2.5 text-[#5C6653] hover:text-[#384230] hover:bg-[#EAE2D6]/40'
                }`}
              >
                <IconComponent className="h-[19px] w-[19px] flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                {isActive && (
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}

          <div className="h-5 w-[1px] bg-[#EAE2D6] mx-0.5 flex-shrink-0" />

          {estaAutenticado ? (
            <li 
              onClick={handleAuthClick} 
              className="flex min-w-14 flex-col items-center gap-0.5 rounded-full bg-[#384230] px-3 py-1.5 text-[10px] font-bold tracking-wide text-white transition-opacity hover:opacity-90 cursor-pointer ml-1 shadow-md flex-shrink-0"
            >
              <PlayCircle className="h-[18px] w-[18px]" strokeWidth={2} />
            </li>
          ) : (
            <li 
              onClick={handleAuthClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EAE2D6]/70 hover:bg-[#EAE2D6] text-[#1A1412] rounded-full transition-all duration-300 cursor-pointer shadow-sm group flex-shrink-0"
              title="Iniciar sesión"
            >
              <User className="h-[18px] w-[18px] text-[#384230] group-hover:scale-110 transition-transform" strokeWidth={2} />
            </li>
          )}

        </ul>
      </nav>

      {activeModal !== null && (
        <AuthModal 
          activeView={activeModal} 
          onClose={() => setActiveModal(null)} 
          onChangeView={setActiveModal} 
        />
      )}
    </>
  );
}