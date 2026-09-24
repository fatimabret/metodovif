export default function TestimoniosSection({ testimonios = [] }) {
  if (!testimonios || testimonios.length === 0) return null;

  return (
    <section id="testimonios" className="w-full pt-16 md:pt-24 pb-16 relative z-10">
      
      <div className="flex flex-col items-center text-center mb-12 px-6">
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#87786E] font-bold mb-2">
          RESULTADOS REALES
        </span>
        <h2 className="text-3xl md:text-5xl font-display text-[#1A1412]">
          Transformaciones de alumnos
        </h2>
        <p className="text-[#5C524B] text-sm md:text-base mt-2 max-w-lg">
          Historias de constancia, salud y evolución con Método VIF.
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:gap-16 w-full px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-60">
        {testimonios.map((item, index) => {
          const imagenes = item.fotos || [];

          return (
            <div 
              key={item.id_testimonio || index}
              className="bg-white border border-[#EAE2D6] rounded-[2rem] p-6 md:p-10 shadow-sm flex flex-col lg:flex-row items-center gap-8 md:gap-12"
            >
              <div className="w-full lg:w-1/2 flex justify-center">
                {imagenes.length === 1 ? (
                  <div className="relative w-full max-w-[260px] lg:max-w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md border-[6px] border-white bg-white mx-auto">
                    <img 
                      src={imagenes[0]} 
                      alt="Transformación alumna VIF" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full flex flex-col lg:flex-row items-center justify-center">
                    
                    <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm lg:hidden relative pb-0">
                      
                      <div className="sticky top-24 w-[85%] mx-auto aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm border-[4px] border-[#EAE2D6] z-10 bg-white">
                        <img 
                          src={imagenes[0]} 
                          alt="Transformación antes" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="relative w-[95%] mx-auto aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white z-20 bg-white mt-12 -mb-28 sm:-mb-32 transition-transform duration-300">
                        <img 
                          src={imagenes[1]} 
                          alt="Transformación después" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                    </div>

                    <div className="hidden lg:flex flex-row justify-center items-center w-full max-w-lg">
                      <div className="w-1/2 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-md border-[8px] border-white z-10 transform -rotate-6 hover:rotate-0 hover:scale-105 hover:shadow-xl hover:z-30 transition-all duration-500 cursor-pointer bg-white">
                        <img 
                          src={imagenes[0]} 
                          alt="Transformación antes" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-1/2 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl border-[8px] border-white z-20 transform rotate-6 hover:rotate-0 hover:scale-105 hover:shadow-2xl hover:z-30 transition-all duration-500 cursor-pointer -ml-8 mt-8 bg-white">
                        <img 
                          src={imagenes[1]} 
                          alt="Transformación después" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>

              <div className={`w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left ${imagenes.length === 1 ? 'mt-6 lg:mt-0' : 'mt-36 sm:mt-40 lg:mt-0'}`}>
                
                {item.nombreAlumna && (
                  <span className="text-xs uppercase tracking-widest text-[#384230] font-bold mb-2">
                    {item.nombreAlumna}
                  </span>
                )}
                
                {item.titulo && (
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-[#1A1412] mb-4 leading-tight">
                    {item.titulo}
                  </h3>
                )}

                {item.descripcion && (
                  <p className="text-[#5C524B] text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {item.descripcion}
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}