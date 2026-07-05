import React from 'react';
import { Bell, Search, Menu, Sun, Moon, Monitor } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { useTheme } from '../ui/theme-provider';

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
  const { theme, setTheme, resolved } = useTheme();
  const location = useLocation();
  const userName = user?.nome?.split(' ')[0] || 'Atleta';

  console.log("USUARIO:",user);

  const pageHeader = PAGE_HEADERS[location.pathname];
  const isDashboard = location.pathname === '/dashboard';
  const isCompeticoes = location.pathname === '/meus-campeonatos';
  const isNotificacoes = location.pathname === '/notificacoes';
  const isDocumentos = location.pathname === '/documentos';
  const displayName = user?.nome || 'Usuário';
  const title = isDashboard ? `Bem-vindo, ${userName}` : pageHeader?.title || 'Sport Data Angola';
  const subtitle = isCompeticoes
    ? `Histórico e próximas competições- ${displayName}`
    : isNotificacoes
      ? `Centro de notificações- ${displayName}`
      : isDocumentos
        ? `Gerencie e envie os seus documentos- ${displayName}`
        : pageHeader?.subtitle || '';

  return (
    <header className={`sticky top-0 z-30 border-b ${resolved === 'dark' ? 'bg-[var(--header-bg)] border-[var(--header-border)]' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`p-2 rounded-lg md:hidden transition shrink-0 ${resolved === 'dark' ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className={`text-xl lg:text-2xl font-bold truncate ${resolved === 'dark' ? 'text-[var(--text-primary)]' : 'text-gray-900'}`}>{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }))}
            className={`relative hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
              resolved === 'dark'
                ? 'bg-[var(--search-bg)] border border-[var(--search-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--hover-border)]'
                : 'bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Pesquisar...</span>
            <kbd className={`ml-2 px-1.5 py-0.5 text-[10px] rounded ${resolved === 'dark' ? 'bg-[var(--kbd-bg)] text-[var(--kbd-text)]' : 'bg-gray-200 text-gray-500'}`}>Ctrl+K</kbd>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            className={`p-2.5 rounded-xl transition ${
              resolved === 'dark'
                ? 'bg-[var(--search-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
            }`}
            title={`Tema: ${theme}`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          <Link
            to="/notificacoes"
            className={`relative p-2.5 rounded-xl transition ${
              resolved === 'dark'
                ? 'bg-[var(--search-bg)] hover:bg-[var(--hover-bg)]'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Bell className={`w-5 h-5 ${resolved === 'dark' ? 'text-[var(--text-secondary)]' : 'text-gray-500'}`} />
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
