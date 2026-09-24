import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-16 md:py-20 pb-32 md:pb-20 border-t border-border flex flex-col items-center justify-center text-center px-6">
      
      <h3 className="text-2xl md:text-3xl font-display script text-foreground mb-2">
        Vero Integral Fit
      </h3>

      <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Movimiento con intención
      </p>

      <p className="text-xs text-muted-foreground/70 mb-2">
        Diseñado con dedicación &middot; Todos los derechos reservados
      </p>

      <Link to="/terminos" className="text-[10px] md:text-xs text-[#87786E] hover:text-[#384230] underline underline-offset-4 transition-colors">
        Términos y Condiciones
      </Link>

    </footer>
  );
}