import { LayoutDashboard, Users, Layers, User } from 'lucide-react';

export default function TrainerBottomNav({ activeTab, setActiveTab }) {
  
  const navItems = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    { id: 'alumnas', label: 'Alumnos', icon: Users },
    { id: 'contenido', label: 'Contenido', icon: Layers },
    { id: 'perfil', label: 'Mi perfil', icon: User },
  ];

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <ul className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-[#384230] px-2.5 py-2 shadow-[0_20px_40px_-10px_rgba(56,66,48,0.4)] backdrop-blur-xl m-0 list-none overflow-x-auto no-scrollbar max-w-full">
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <li 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-center transition-all duration-300 cursor-pointer rounded-full flex-shrink-0 ${
                isActive 
                  ? 'bg-[#E5DCD0] text-[#1A1412] px-4 py-2.5 gap-2 shadow-md' 
                  : 'p-2.5 text-[#C4CFC0] hover:text-white hover:bg-white/10'
              }`}
            >
              <IconComponent 
                className="h-[19px] w-[19px] flex-shrink-0" 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              {isActive && (
                <span className="text-xs font-bold tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}

      </ul>
    </nav>
  );
}