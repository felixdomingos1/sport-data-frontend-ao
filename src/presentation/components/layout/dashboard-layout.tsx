import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../dashboard/dashboard-sidebar';
import DashboardHeader from '../dashboard/dashboard-header';
import { useRouteLoading } from '@/presentation/hooks/use-route-loading';
import { useLoadingStore } from '@/store/loading.store';

const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { hide } = useLoadingStore();
  useRouteLoading('A preparar a sua área...');

  useEffect(() => {
    const timer = setTimeout(hide, 700);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <div className="dark min-h-screen bg-black">
      <DashboardSidebar
        isMobileMenuOpen={isMobileSidebarOpen}
        setIsMobileMenuOpen={setIsMobileSidebarOpen}
      />

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
