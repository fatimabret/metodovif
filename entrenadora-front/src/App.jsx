import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import BottomNav from './components/Global/BottomNav/BottomNav';
import StudentDashboard from './pages/Student/StudentDashboard';
import TrainerDashboard from './pages/Entrenadora/TrainerDashboard';
import Terminos from './components/Inicio/Terminos';
import CookieBanner from './components/Global/CookieBanner';
import ResetPasswordView from './components/Global/ResetPasswordView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FAF7F2] to-[#FAF7F2] font-sans text-foreground relative">      
        
        <Routes>
          <Route path="/" element={
            <>
              <Inicio />
              <BottomNav />
            </>
          } />

          <Route path="/alumna/*" element={<StudentDashboard />} />
          <Route path="/entrenadora/*" element={<TrainerDashboard />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="*" element={<Navigate to="/?auth=login" replace />} />

          <Route path="/recuperar-password/:token" element={<ResetPasswordView />} />
        </Routes>

        <CookieBanner />

      </div>
    </BrowserRouter>
  );
}

export default App;