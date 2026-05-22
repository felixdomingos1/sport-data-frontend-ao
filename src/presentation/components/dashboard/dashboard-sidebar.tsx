import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  User,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import clsx from 'clsx';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Perfil',
      icon: User,
      path: '/perfil',
    },
    {
      label: 'Campeonatos',
      icon: Trophy,
      path: '/meus-campeonatos',
    },
    {
      label: 'Notificações',
      icon: Bell,
      path: '/notificacoes',
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col',

          isSidebarOpen ? 'w-72' : 'w-20',

          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* HEADER */}

        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {isSidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-red-500">
                Sport Data
              </h1>

              <p className="text-xs text-gray-500">
                Angola
              </p>
            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>


        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200',

                  active
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Icon size={20} />

                {isSidebarOpen && (
                  <span className="font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut size={20} />

            {isSidebarOpen && (
              <span className="font-medium">
                Terminar Sessão
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
