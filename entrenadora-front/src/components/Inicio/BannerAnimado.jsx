export default function BannerAnimado() {
  // Puedes cambiar o agregar las palabras que quieras aquí
  const palabras = [
    "MÉTODO VIF", 
    "ENTRENAMIENTO", 
    "BIENESTAR", 
    "SALUD INTEGRAL", 
    "HÁBITOS", 
    "ENERGÍA"
  ];

  return (
    <div className="relative w-full bg-[#E5DCD0] text-[#384230] py-3.5 md:py-4 overflow-hidden border-y border-[#2A3323] z-20 shadow-md">
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker {
            display: flex;
            width: max-content;
            animation: scroll-left 25s linear infinite;
          }
        `}
      </style>

      <div className="animate-ticker">
        <div className="flex whitespace-nowrap items-center">
          {palabras.map((item, index) => (
            <div key={`g1-${index}`} className="flex items-center">
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] px-8 md:px-12">
                {item}
              </span>
              <span className="text-[#87786E] text-xs">✦</span>
            </div>
          ))}
        </div>
        
        <div className="flex whitespace-nowrap items-center">
          {palabras.map((item, index) => (
            <div key={`g2-${index}`} className="flex items-center">
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] px-8 md:px-12">
                {item}
              </span>
              <span className="text-[#87786E] text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}