import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionGuard } from '@/presentation/hooks/use-subscription-guard';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';

const FREE_ROUTES = ['/minha-assinatura', '/perfil'];

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasActivePlan, checking } = useSubscriptionGuard();
  const location = useLocation();

  if (isLoading || checking) {
    return <SportLoadingScreen message="A verificar a sua sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasActivePlan === false && !FREE_ROUTES.includes(location.pathname)) {
    return <Navigate to="/minha-assinatura" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
