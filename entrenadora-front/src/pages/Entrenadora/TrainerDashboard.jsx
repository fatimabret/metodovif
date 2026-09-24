import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import api from '../../api';
import TrainerBottomNav from '../../components/Entrenadora/TrainerBottomNav';
import ResumenView from '../../components/Entrenadora/views/ResumenView';
import AlumnasView from '../../components/Entrenadora/views/AlumnasView';
import ContenidoView from '../../components/Entrenadora/views/ContenidoView';
import PerfilView from '../../components/Entrenadora/views/PerfilView';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('trainerTab') || 'resumen';
  }); 

  useEffect(() => {
    if (!token) {
      navigate('/?auth=login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('trainerTab', tab);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      localStorage.removeItem('token'); 
      localStorage.removeItem('trainerTab'); 
      window.location.href = '/'; 
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'resumen': return <ResumenView />;
      case 'alumnas': return <AlumnasView />;
      case 'contenido': return <ContenidoView />;
      case 'perfil': return <PerfilView />;
      default: return <ResumenView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF7F2] pb-32 font-sans text-foreground">
      
      <header className="pt-8 px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 flex justify-between items-start mb-6">
        <div className="flex flex-col items-start">
        <h1 onClick={() => handleTabChange('resumen')} className="text-2xl font-display leading-none text-[#1A1412] cursor-pointer" >
          Metodo <span className="italic text-[#5C524B]">VIF</span>
        </h1>
          <span className="bg-[#384230] text-[#FAF7F2] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
            Entrenadora
          </span>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[#5C524B] hover:text-[#D97777] hover:bg-[#FFF5F5] hover:border-[#D97777] transition-all bg-transparent px-4 py-1.5 rounded-full border border-[#D9D0C5]"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span className="text-sm font-medium">Salir</span>
        </button>
      </header>

      <main className="w-full max-w-md md:max-w-4xl mx-auto px-6 mt-2">
        {renderView()}
      </main>
      
      <TrainerBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}