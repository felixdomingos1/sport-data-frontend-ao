import React from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';

interface DashboardHeaderProps {
  setIsMobileSidebarOpen: (value: boolean) => void;
  isMobileSidebarOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  setIsMobileSidebarOpen,
  isMobileSidebarOpen
}) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.nome}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Atleta</p>
            </div>
            <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">{user?.nome?.charAt(0) || 'U'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
