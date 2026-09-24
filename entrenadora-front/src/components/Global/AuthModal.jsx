import { useState } from 'react';
import { X, Info, MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthModal({ activeView, onClose, onChangeView }) {
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({ correo: '', contrasenia: '' });
  const [errorLogin, setErrorLogin] = useState('');
  const [cargandoLogin, setCargandoLogin] = useState(false);

  const [regData, setRegData] = useState({ nombre: '', correo: '', contrasenia: '', confirmarContrasenia: '' });
  const [errorReg, setErrorReg] = useState('');
  const [cargandoReg, setCargandoReg] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [estadoRecuperacion, setEstadoRecuperacion] = useState('idle');
  const [errorRecuperacion, setErrorRecuperacion] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    setCargandoLogin(true);

    try {
      const respuesta = await api.post('/auth/login', {
        correo: credenciales.correo,
        contrasenia: credenciales.contrasenia
      });

      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('rol', respuesta.data.rol);
      
      onClose();
      
      if (respuesta.data.rol === 'entrenadora') {
        navigate('/entrenadora');
      } else {
        navigate('/alumna');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorLogin('Correo o contraseña incorrectos.');
      } else if (error.response && error.response.status === 403) {
        setErrorLogin(error.response.data.mensaje);
      } else {
        setErrorLogin('Error de conexión con el servidor.');
      }
    } finally {
      setCargandoLogin(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse) => {
    setErrorLogin('');
    setCargandoLogin(true);
    
    try {
      const res = await api.post('/auth/login-google', {
        token: credentialResponse.credential
      });

      if (res.status === 202) {
        setMensajeExito(res.data.mensaje);
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('rol', 'alumna');
        
        onClose();
        navigate('/alumna');
      }
    } catch (error) {
      setErrorLogin(error.response?.data?.mensaje || 'Error al autenticar con Google.');
    } finally {
      setCargandoLogin(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorReg('');
    
    if (regData.contrasenia !== regData.confirmarContrasenia) {
      setErrorReg('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return; 
    }

    setCargandoReg(true);

    try {
      const payload = {
        nombre: regData.nombre,
        correo: regData.correo,
        contrasenia: regData.contrasenia
      };

      const res = await api.post('/usuarios', payload);
      setMensajeExito(res.data.mensaje); 
    } catch (error) {
      if (error.response?.data?.errors) {
        const primerosErrores = Object.values(error.response.data.errors).flat();
        setErrorReg(primerosErrores[0]); 
      } else {
        setErrorReg(error.response?.data?.mensaje || 'Ocurrió un error al intentar registrarte.');
      }
    } finally {
      setCargandoReg(false);
    }
  };

  const handleRecuperarPassword = async (e) => {
    if (e) e.preventDefault();
    setErrorRecuperacion('');
    setEstadoRecuperacion('loading');

    try {
      await api.post('/auth/forgot-password', { correo: correoRecuperacion });
      setEstadoRecuperacion('success');
    } catch (error) {
      setErrorRecuperacion(error.response?.data?.mensaje || 'No encontramos una cuenta con ese correo.');
      setEstadoRecuperacion('idle');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#384230]/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose} 
    >
      <div 
        className="w-full max-w-md bg-[#FAF7F2] rounded-t-[2.5rem] md:rounded-3xl p-6 md:p-8 pb-12 shadow-2xl relative animate-slideUp transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onClick={(e) => e.stopPropagation()} 
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        <div className="w-10 h-1 bg-[#D9D0C5] rounded-full mx-auto mb-6 md:hidden flex-shrink-0"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#5C6653] hover:text-[#384230] p-1 rounded-full hover:bg-white transition-colors hidden md:block"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {mensajeExito ? (
          <div className="text-center animate-fadeIn py-4">
            <div className="w-16 h-16 bg-[#384230]/10 text-[#384230] rounded-full flex items-center justify-center mx-auto mb-6">
              <Info size={32} />
            </div>
            <h3 className="text-2xl font-display text-[#1A1412] mb-3">¡Registro Exitoso!</h3>
            <p className="text-[#5C524B] text-sm leading-relaxed mb-8">{mensajeExito}</p>
            <button 
              onClick={() => {
                setMensajeExito('');
                onChangeView('login');
              }}
              className="w-full py-4 text-[#FAF7F2] rounded-[2rem] text-sm font-medium transition-colors bg-[#384230] hover:bg-[#2A3323]"
            >
              Volver a inicio de sesión
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-display script text-[#1A1412] mb-2">
                Vero Integral Fit
              </h3>
              <p className="script text-[#5C6653] text-lg mt-[-0.5rem]">
                {activeView === 'login' && 'Área exclusiva para alumnas'}
                {activeView === 'register' && 'Súmate a la comunidad'}
                {activeView === 'forgot' && 'Recuperar contraseña'}
              </p>
            </div>

            {activeView === 'login' && (
              <div className="animate-fadeIn">
                <form className="flex flex-col" onSubmit={handleLogin}>
                  <div className="flex flex-col gap-3">
                    <input 
                      type="email" 
                      placeholder="Correo electrónico" 
                      value={credenciales.correo}
                      onChange={(e) => setCredenciales({...credenciales, correo: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#1A1412] focus:outline-none focus:border-[#1A1412] focus:ring-1 focus:ring-[#1A1412] transition-all"
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Contraseña" 
                      value={credenciales.contrasenia}
                      onChange={(e) => setCredenciales({...credenciales, contrasenia: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230] focus:ring-1 focus:ring-[#384230] transition-all"
                      required
                    />
                  </div>

                  {errorLogin && (
                    <div className="mt-3 bg-[#D97777]/10 text-[#D97777] p-2.5 rounded-xl text-sm font-medium text-center">
                      {errorLogin}
                    </div>
                  )}

                  <div className="flex justify-end mt-3 mb-1">
                    <button type="button" onClick={() => onChangeView('forgot')} className="text-xs font-medium text-[#5C6653] hover:text-[#384230] transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button type="submit" disabled={cargandoLogin} className={`w-full py-4 mt-4 text-[#FAF7F2] rounded-[2rem] text-sm font-medium transition-colors ${cargandoLogin ? 'bg-[#5C6653]' : 'bg-[#384230] hover:bg-[#2A3323]'}`} >
                    {cargandoLogin ? 'Verificando...' : 'Ingresar'}
                  </button>

                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-[#EAE2D6]"></div>
                    <span className="px-4 text-xs text-[#87786E] font-medium uppercase tracking-widest">O</span>
                    <div className="flex-1 border-t border-[#EAE2D6]"></div>
                  </div>

                  <div className="flex justify-center w-full">
                    <GoogleLogin onSuccess={handleGoogleAuth} onError={() => setErrorLogin('No se pudo conectar con Google.')} shape="pill" theme="outline" text="continue_with" size="large" width="100%"
                    />
                  </div>

                  <p className="text-[10px] text-center text-[#87786E] mt-3">
                    Al ingresar, aceptas nuestros <a href="/terminos" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#384230]">Términos y Condiciones</a>.
                  </p>
                </form>

                <div className="text-center mt-8 pb-4">
                  <p className="text-sm text-[#5C6653]">
                    ¿Todavía no tenés cuenta? 
                    <button onClick={() => onChangeView('register')} className="font-display italic text-lg text-[#384230] hover:opacity-80 transition-opacity ml-1">
                      Registrate
                    </button>
                  </p>
                </div>
              </div>
            )}

            {activeView === 'register' && (
              <div className="animate-fadeIn">
                <form className="flex flex-col gap-3" onSubmit={handleRegister}>
                  <input type="text" placeholder="Nombre completo" value={regData.nombre} onChange={(e) => setRegData({...regData, nombre: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230] transition-all" required />
                  <input type="email" placeholder="Correo electrónico" value={regData.correo} onChange={(e) => setRegData({...regData, correo: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#1A1412] focus:outline-none focus:border-[#1A1412] transition-all" required />
                  <input type="password" placeholder="Crear contraseña" value={regData.contrasenia} onChange={(e) => setRegData({...regData, contrasenia: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230] transition-all" required />
                  <input type="password" placeholder="Confirmar contraseña" value={regData.confirmarContrasenia} onChange={(e) => setRegData({...regData, confirmarContrasenia: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#384230] focus:outline-none focus:border-[#384230] transition-all" required />

                  {errorReg && <div className="mt-1 bg-[#D97777]/10 text-[#D97777] p-2.5 rounded-xl text-sm font-medium text-center">{errorReg}</div>}

                  <button type="submit" disabled={cargandoReg} className={`w-full py-4 mt-4 text-[#FAF7F2] rounded-[2rem] text-sm font-medium transition-colors ${cargandoReg ? 'bg-[#5C6653]' : 'bg-[#2A3323] hover:bg-black'}`}>
                    {cargandoReg ? 'Registrando...' : 'Crear cuenta'}
                  </button>
                </form>

                <div className="text-center mt-8 pb-4">
                  <p className="text-sm text-[#5C6653]">¿Ya tenés cuenta? <button onClick={() => onChangeView('login')} className="font-display italic text-lg text-[#384230] hover:opacity-80 transition-opacity ml-1">Ingresá</button></p>
                </div>
              </div>
            )}

            {activeView === 'forgot' && (
              <div className="animate-fadeIn">
                {estadoRecuperacion === 'success' ? (
                  <div className="text-center py-2 flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#384230]/10 text-[#384230] rounded-full flex items-center justify-center mb-4">
                      <MailCheck size={28} />
                    </div>
                    <h4 className="text-lg font-bold text-[#1A1412] mb-2">Revisá tu bandeja</h4>
                    <p className="text-sm text-[#5C524B] mb-6 leading-relaxed">
                      Si el correo <span className="font-bold">{correoRecuperacion}</span> existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.
                    </p>
                    
                    <button 
                      onClick={() => handleRecuperarPassword()} 
                      className="text-xs font-bold text-[#87786E] hover:text-[#384230] underline mb-6 transition-colors"
                    >
                      ¿No te llegó el correo? Reenviar enlace
                    </button>

                    <button 
                      onClick={() => onChangeView('login')}
                      className="w-full py-3.5 bg-transparent border border-[#EAE2D6] text-[#384230] rounded-[2rem] text-sm font-bold hover:bg-white transition-colors"
                    >
                      Volver a Iniciar Sesión
                    </button>
                  </div>
                ) : (
                  <form className="flex flex-col gap-3" onSubmit={handleRecuperarPassword}>
                    <p className="text-sm text-[#5C524B] text-center mb-4">
                      Ingresá tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
                    </p>
                    <input 
                      type="email" 
                      placeholder="Correo electrónico" 
                      value={correoRecuperacion}
                      onChange={(e) => setCorreoRecuperacion(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#EAE2D6] text-sm text-[#1A1412] focus:outline-none focus:border-[#1A1412] transition-all"
                      required
                    />

                    {errorRecuperacion && <div className="mt-1 bg-[#D97777]/10 text-[#D97777] p-2.5 rounded-xl text-sm font-medium text-center">{errorRecuperacion}</div>}

                    <button 
                      type="submit" 
                      disabled={estadoRecuperacion === 'loading'}
                      className={`w-full py-4 mt-2 text-[#FAF7F2] rounded-[2rem] text-sm font-medium transition-colors ${estadoRecuperacion === 'loading' ? 'bg-[#5C6653]' : 'bg-[#384230] hover:bg-[#2A3323]'}`}
                    >
                      {estadoRecuperacion === 'loading' ? 'Enviando enlace...' : 'Recuperar contraseña'}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => onChangeView('login')}
                      className="w-full py-3 mt-2 text-[#87786E] text-sm font-medium hover:text-[#1A1412] transition-colors"
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}