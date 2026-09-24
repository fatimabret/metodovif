import SectionHeader from '../Global/SectionHeader';

export default function Activities({ categorias = [] }) {
  return (
    <section id="actividades" className="w-full pt-16 md:pt-24 relative z-10">
      <SectionHeader eyebrow="LO QUE HAGO" title="" highlight="Actividades & disciplinas" />
      <div className="flex flex-col gap-4 w-full px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-72">
        {categorias.length === 0 ? (
          <p className="text-center text-[#87786E] py-10">Próximamente nuevas disciplinas.</p>
        ) : (
          categorias.map((item) => (
            <div 
              key={item.id_categoria || item.id} 
              className="flex flex-col justify-center p-6 md:p-8 bg-white rounded-3xl border-0 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
            >
              <h3 className="text-xl md:text-2xl font-display font-semibold tracking-wide text-[#1A1412] mb-2">
                {item.titulo}
              </h3>
              <p className="text-[#5C524B] font-medium text-sm md:text-base leading-relaxed">
                {item.descripcion}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
    
  );
}