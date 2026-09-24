import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../../api.js';

export default function ResetPasswordView() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const correo = searchParams.get('email');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [estado, setEstado] = useState('idle'); 
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!token || !correo) {
      setEstado('error');
      setMensaje('El enlace de recuperación está incompleto o dañado.');
    }
  }, [token, correo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setEstado('error');
      setMensaje('Las contraseñas no coinciden.');
      return;
    }
    
    setEstado('loading');
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        correo,
        contrasenia: password
      });
      setEstado('success');
      setMensaje(res.data.mensaje);
    } catch (error) {
      setEstado('error');
      setMensaje(error.response?.data?.mensaje || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[2rem] p-8 shadow-xl border border-[#EAE2D6]">
        
        <div className="w-14 h-14 bg-[#384230]/10 text-[#384230] rounded-full flex items-center justify-center mx-auto mb-6">
          {estado === 'success' ? <CheckCircle2 size={28} /> : <KeyRound size={28} />}
        </div>

        <h3 className="text-2xl font-display text-center text-[#1A1412] mb-2">
          {estado === 'success' ? '¡Contraseña actualizada!' : 'Crear nueva contraseña'}
        </h3>
        
        <p className="text-sm text-[#5C524B] text-center mb-8">
          {estado === 'success' 
            ? 'Tu contraseña ha sido restablecida exitosamente. Ya puedes acceder a tu cuenta.' 
            : `Ingresá la nueva contraseña para el correo: ${correo}`}
        </p>

        {estado === 'success' ? (
          <button 
            onClick={() => navigate('/?auth=login')}
            className="w-full py-4 text-[#FAF7F2] bg-[#384230] hover:bg-[#2A3323] rounded-[2rem] text-sm font-bold transition-colors"
          >
            Ir a Iniciar Sesión
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Nueva contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230]"
              required
              minLength={6}
            />
            <input 
              type="password" 
              placeholder="Confirmar nueva contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230]"
              required
            />

            {estado === 'error' && (
              <div className="bg-[#D97777]/10 text-[#D97777] p-3 rounded-xl text-sm font-medium text-center">
                {mensaje}
              </div>
            )}

            <button 
              type="submit" 
              disabled={estado === 'loading' || !token || !correo}
              className={`w-full py-4 mt-2 text-[#FAF7F2] rounded-[2rem] text-sm font-bold transition-colors ${estado === 'loading' ? 'bg-[#5C6653]' : 'bg-[#384230] hover:bg-[#2A3323]'}`}
            >
              {estado === 'loading' ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}