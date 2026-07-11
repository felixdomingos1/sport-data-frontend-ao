import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './presentation/routes/private-route';
import PublicRoute from './presentation/routes/public-route';
import NotFound from './presentation/pages/not-found';
import { useAuthStore } from './store/auth.store';
import Login from './presentation/pages/login/login';
import Register from './presentation/pages/register/register';
import ForgotPassword from './presentation/pages/forgot-password/forgot-password';
import ResetPassword from './presentation/pages/reset-password/reset-password';
import Layout from './presentation/components/layout';
import Home from './presentation/pages/home/home';
import Federacoes from './presentation/pages/federacoes/federacoes';
import Clubes from './presentation/pages/clubes/clubes';
import Atletas from './presentation/pages/atletas/atletas';
import Eventos from './presentation/pages/eventos/evento';
import EventoDetalhe from './presentation/pages/eventos/evento-detalhe';
import DashboardLayout from './presentation/components/layout/dashboard-layout';
import Dashboard from './presentation/pages/dashboard/dashboard';
import Perfil from './presentation/pages/perfil';
import Documentos from './presentation/pages/documentos';
import { ThemeProvider } from './presentation/components/ui/theme-provider';
import MeusCampeonatos from './presentation/pages/meus-campeonatos';
import Notificacoes from './presentation/pages/notificacoes';
import Pagamentos from './presentation/pages/pagamentos';
import RankingAtleta from './presentation/pages/ranking-atleta';
import Rankings from './presentation/pages/rankings';
import FederacaoDetalhe from './presentation/pages/federacoes/federacao-detalhe';
import Inscricoes from './presentation/pages/inscricoes';
import SportLoadingScreen from './presentation/components/ui/sport-loading-screen';
import GlobalLoadingOverlay from './presentation/components/ui/global-loading-overlay';
import { OrganizationLD, WebSiteLD } from './presentation/components/seo/json-ld';

function App() {
  const { loadUser } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    loadUser().finally(() => setIsBootstrapping(false));
  }, [loadUser]);

  if (isBootstrapping) {
    return <SportLoadingScreen message="A iniciar Sport Data Angola..." />;
  }

  return (
    <HelmetProvider>
    <ThemeProvider>
    <Router>
      <GlobalLoadingOverlay />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/federacoes" element={<Federacoes />} />
            <Route path="/federacoes/:id" element={<FederacaoDetalhe />} />
            <Route path="/clubes" element={<Clubes />} />
            <Route path="/atletas" element={<Atletas />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalhe />} />
            <Route path="/rankings" element={<Rankings />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/meus-campeonatos" element={<MeusCampeonatos />} />
              <Route path="/inscricoes" element={<Inscricoes />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/ranking-atleta" element={<RankingAtleta />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
    </ThemeProvider>
    <OrganizationLD />
    <WebSiteLD />
    </HelmetProvider>
  );
}

export default App;
