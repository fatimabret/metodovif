import { X, Clock } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  if (!video) return null; 

  return (
    <div 

      className="fixed inset-0 z-50 flex items-center justify-center bg-[#384230]/60 backdrop-blur-sm px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#FAF7F2] rounded-3xl p-6 md:p-8 shadow-2xl relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5C524B] hover:text-[#1A1412] p-1.5 rounded-full hover:bg-white transition-colors z-20"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <h3 className="text-2xl md:text-3xl font-display text-[#1A1412] pr-8 mb-4 md:mb-6 leading-tight">
          {video.titulo}
        </h3>

        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-5 shadow-inner">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`} 
            title={video.titulo} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-[#5C524B] text-sm md:text-base leading-relaxed mb-4">
          {video.descripcion}
        </p>

      </div>
    </div>
  );
}