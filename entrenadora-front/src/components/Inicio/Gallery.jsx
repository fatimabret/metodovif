export default function Gallery({ imagenes = [] }) {
  if (imagenes.length === 0) return null;

  const getSizes = (total) => {
    if (total === 1) return 'w-full max-w-2xl';
    if (total === 2) return 'w-[calc(50%-6px)] md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] max-w-lg';
    if (total === 4) return 'w-[calc(50%-6px)] md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] max-w-sm';

    return 'w-[calc(50%-6px)] md:w-[calc(33.333%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm';
  };

  return (
    <section id="galeria" className="w-full pt-16 md:pt-24 pb-12">
      
      <div className="flex flex-col items-start text-left mb-6 md:mb-10 px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72 w-full">
        <h2 className="text-3xl md:text-5xl font-display script text-[#1A1412]">
          Momentos del estudio
        </h2>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 w-full lg:w-[75%] mx-auto">
          
          {imagenes.map((img) => {
            const rutaImagen = img.url_foto;

            return (
              <div 
                key={img.id_galeria} 
                className={`relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl border border-[#EAE2D6] bg-white shadow-sm group ${getSizes(imagenes.length)}`}
              >
                <img 
                  src={rutaImagen} 
                  alt={img.descripcion || "Galería Vero Integral Fit"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            );
          })}

        </div>
      </div>
      
    </section>
  );
}