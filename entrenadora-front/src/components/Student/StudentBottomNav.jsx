import { PlaySquare, Bookmark, CalendarDays, User } from 'lucide-react';

export default function StudentBottomNav({ activeTab, setActiveTab, permiteRutinas }) {
  
  const navItems = [
    { id: 'videos', label: 'Videos', icon: PlaySquare },
    { id: 'favoritos', label: 'Guardados', icon: Bookmark },
    ...(permiteRutinas ? [{ id: 'rutina', label: 'Rutina', icon: CalendarDays }] : []),
    { id: 'perfil', label: 'Mi perfil', icon: User },
  ];

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <ul className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-white/85 px-2.5 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl m-0 list-none overflow-x-auto no-scrollbar max-w-full">
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <li 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-center transition-all duration-300 cursor-pointer rounded-full flex-shrink-0 ${
                isActive 
                  ? 'bg-[#384230] text-white px-4 py-2.5 gap-2 shadow-md' 
                  : 'p-2.5 text-[#5C6653] hover:text-[#384230] hover:bg-[#EAE2D6]/40'
              }`}
            >
              <IconComponent 
                className="h-[19px] w-[19px] flex-shrink-0" 
                strokeWidth={isActive ? 2.2 : 1.8} 
              />
              {isActive && (
                <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
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