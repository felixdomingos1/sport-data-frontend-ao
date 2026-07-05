import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../dashboard/dashboard-sidebar';
import DashboardHeader from '../dashboard/dashboard-header';
import { CommandPalette } from '../ui/command-palette';
import { useRouteLoading } from '@/presentation/hooks/use-route-loading';
import { useLoadingStore } from '@/store/loading.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '../ui/theme-provider';

const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { hide } = useLoadingStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { fetchDashboard, fetchNotificacoesCount, fetchMe } = useAtletaMeStore();
  const { resolved } = useTheme();
  useRouteLoading('A preparar a sua área...');

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchMe();
    fetchDashboard();
    fetchNotificacoesCount();
    const timer = setTimeout(hide, 700);
    return () => clearTimeout(timer);
  }, [isAuthenticated, fetchMe, fetchDashboard, fetchNotificacoesCount, hide]);

  return (
    <div className={`min-h-screen ${resolved === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <DashboardSidebar
        isMobileMenuOpen={isMobileSidebarOpen}
        setIsMobileMenuOpen={setIsMobileSidebarOpen}
      />

      <CommandPalette />
      <div className="md:ml-64 transition-all duration-300">
        <DashboardHeader setIsMobileSidebarOpen={setIsMobileSidebarOpen} />

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
