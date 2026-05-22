import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import PrivateRoute from './presentation/routes/private-route';
import PublicRoute from './presentation/routes/public-route';
import NotFound from './presentation/pages/not-found';
import { useAuthStore } from './store/auth.store';
import Login from './presentation/pages/login/login';
import Register from './presentation/pages/register/register';
import Layout from './presentation/components/layout';
import Home from './presentation/pages/home/home';
import Federacoes from './presentation/pages/federacoes/federacoes';
import Clubes from './presentation/pages/clubes/clubes';
import Atletas from './presentation/pages/atletas/atletas';
import Eventos from './presentation/pages/eventos/evento';
import DashboardLayout from './presentation/components/layout/dashboard-layout';
import Dashboard from './presentation/pages/dashboard/dashboard';
import Perfil from './presentation/pages/perfil';
import MeusCampeonatos from './presentation/pages/meus-campeonatos';
import Notificacoes from './presentation/pages/notificacoes';
import Rankings from './presentation/pages/rankings';
import FederacaoDetalhe from './presentation/pages/federacoes/federacao-detalhe';

function App() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-red-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando Sport Data Angola...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/federacoes" element={<Federacoes />} />
            <Route path="/federacoes/:id" element={<FederacaoDetalhe />} />
            <Route path="/clubes" element={<Clubes />} />
            <Route path="/atletas" element={<Atletas />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/rankings" element={<Rankings />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/meus-campeonatos" element={<MeusCampeonatos />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
