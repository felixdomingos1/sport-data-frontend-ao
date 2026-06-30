import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';

interface DashboardHeaderProps {
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const PAGE_HEADERS: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: '',
    subtitle: 'Painel do Atleta - Sport Data Angola',
  },
  '/perfil': {
    title: 'Meu Perfil',
    subtitle: 'Dados pessoais e documentos',
  },
  '/documentos': {
    title: 'Documentos',
    subtitle: '', // preenchido dinamicamente
  },
  '/pagamentos': {
    title: 'Pagamentos',
    subtitle: 'Inscrições, renovações e participações',
  },
  '/ranking-atleta': {
    title: 'Ranking Nacional',
    subtitle: 'Basquetebol - Época 2025/2026',
  },
  '/meus-campeonatos': {
    title: 'Competições',
    subtitle: '', // preenchido dinamicamente
  },
  '/notificacoes': {
    title: 'Notificações',
    subtitle: '', // preenchido dinamicamente
  },
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setIsMobileSidebarOpen }) => {
  const { user } = useAuthStore();
  const { notificacoesNaoLidas } = useAtletaMeStore();
  const location = useLocation();
  const userName = user?.nome?.split(' ')[0] || 'Atleta';

  const pageHeader = PAGE_HEADERS[location.pathname];
  const isDashboard = location.pathname === '/dashboard';
  const isCompeticoes = location.pathname === '/meus-campeonatos';
  const isNotificacoes = location.pathname === '/notificacoes';
  const isDocumentos = location.pathname === '/documentos';
  const displayName = user?.nome || 'João Mateus';
  const title = isDashboard ? `Bem-vindo, ${userName}` : pageHeader?.title || 'Sport Data Angola';
  const subtitle = isCompeticoes
    ? `Histórico e próximas competições- ${displayName}`
    : isNotificacoes
      ? `Centro de notificações- ${displayName}`
      : isDocumentos
        ? `Gerencie e envie os seus documentos- ${displayName}`
        : pageHeader?.subtitle || '';

  return (
    <header className="sticky top-0 z-30 bg-[#0f0f0f] border-b border-[#1a1a1a]">
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg md:hidden text-gray-400 hover:text-white hover:bg-[#141414] transition shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-white truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              placeholder="Pesquisar..."
              className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E60000]/50 transition"
            />
          </div>

          <Link
            to="/notificacoes"
            className="relative p-2.5 rounded-xl bg-[#080808] hover:bg-[#141414] transition"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E60000] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificacoesNaoLidas}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
