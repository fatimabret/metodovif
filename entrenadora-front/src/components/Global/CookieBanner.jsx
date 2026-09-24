import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const decision = localStorage.getItem('cookies_consent');
    
    if (!decision) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (decision === 'accepted') {
      activarCookiesDeTerceros();
    }
  }, []);

  const activarCookiesDeTerceros = () => {
    console.log("Cookies analíticas activadas.");
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookies_consent', 'accepted');
    activarCookiesDeTerceros();
    setIsVisible(false);
  };

  const handleOnlyEssential = () => {
    localStorage.setItem('cookies_consent', 'rejected');
    console.log("Cookies analíticas bloqueadas por el usuario.");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:bottom-8 md:right-8 md:inset-x-auto z-[100] w-auto md:max-w-sm pointer-events-none flex justify-center md:justify-end animate-fadeIn">
      
      <div className="pointer-events-auto w-full bg-white border border-[#EAE2D6] rounded-[2rem] p-5 md:p-6 shadow-2xl relative flex flex-col gap-3 md:gap-4">
        
        <button 
          onClick={handleOnlyEssential} 
          className="absolute top-4 right-4 text-[#87786E] hover:text-[#1A1412] transition-colors"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        <div>
          <h4 className="text-[#1A1412] font-display text-base md:text-lg font-semibold mb-1.5 pr-6">
            Usamos cookies
          </h4>
          <p className="text-[#5C524B] text-xs md:text-sm leading-relaxed">
            Las cookies esenciales mantienen tu sesión activa. Las de analítica nos ayudan a entender qué funciones importan — solo se activan si las aceptas.{' '}
            <Link 
              to="/terminos" 
              onClick={() => setIsVisible(false)} 
              className="underline text-[#1A1412] font-medium hover:text-[#384230]"
            >
              Más información
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button 
            onClick={handleOnlyEssential}
            className="flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-full text-xs font-bold border border-[#EAE2D6] text-[#1A1412] bg-white hover:bg-[#FAF7F2] transition-colors"
          >
            Solo esenciales
          </button>
          <button 
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-full text-xs font-bold bg-[#1A1412] text-[#FAF7F2] hover:bg-[#384230] transition-colors shadow-sm"
          >
            Aceptar todas
          </button>
        </div>

      </div>
      
    </div>
  );
}