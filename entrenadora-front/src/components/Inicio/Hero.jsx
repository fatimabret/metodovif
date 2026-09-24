export default function Hero({ titulo, biografia, urlFoto }) {
  return (
    <div className="hero-container relative z-10 flex flex-col w-full">
      
      <div className="absolute top-6 md:top-8 w-full px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-60 z-30 flex justify-start">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hero-logo-box inline-flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-full px-5 py-2 md:px-6 md:py-2.5 cursor-pointer hover:bg-white/60 transition-colors"
        >
            <h2 className="text-base md:text-lg font-display leading-none text-[#1A1412] flex items-baseline gap-1.5 m-0" >
              Metodo <span className="script text-[#384230] text-xl md:text-2xl italic tracking-wide">VIF</span>
            </h2>
        </div>
      </div>

      <div className="hero-image-wrapper relative w-full">
        <img 
          src={urlFoto} 
          alt="Vero Integral Fit" 
          className="hero-image mix-blend-multiply w-full object-cover" 
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)"
          }}
        />
      </div>

      <div className="hero-content relative z-20 w-full px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-60 -mt-4 sm:-mt-8 md:-mt-24 lg:-mt-16 xl:-mt-8 flex flex-col items-start">
        <div className="hero-text-wrapper flex flex-col gap-4 max-w-2xl xl:max-w-3xl">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-display text-[#1A1412] leading-[1.15]">
            {titulo}
          </h1>
          <p className="hero-description text-[#5C524B] text-base md:text-lg lg:text-xl leading-relaxed font-medium">
            {biografia}
          </p>
        </div>
      </div>

    </div>
  );
}