import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/auth.store';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.log(error);

      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Sport Data Angola
              </Link>
              {isAuthenticated && (
                <div className="hidden md:flex ml-10 space-x-4">
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <Link to="/federacoes" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Federações
                  </Link>
                  <Link to="/clubes" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Clubes
                  </Link>
                  <Link to="/atletas" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Atletas
                  </Link>
                  <Link to="/campeonatos" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                    Campeonatos
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Olá, {user?.nome}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-brand text-white px-4 py-2 rounded-xl hover:bg-brand-hover transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
