import React from 'react';
import {
  LayoutDashboard,
  User,
  FileText,
  CreditCard,
  Trophy,
  Calendar,
  Bell,
  LogOut,
  Shield,
  Menu,
  X,
  Globe,
  ClipboardList,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { getInscricaoAtiva, getInitials } from '@/presentation/utils/atleta.utils';
import clsx from 'clsx';

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { profile, dashboard } = useAtletaMeStore();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Meu Perfil', icon: User, path: '/perfil' },
    { label: 'Minha Inscrição', icon: ClipboardList, path: '/inscricoes' },
    { label: 'Documentos', icon: FileText, path: '/documentos' },
    { label: 'Pagamentos', icon: CreditCard, path: '/pagamentos' },
    { label: 'Ranking', icon: Trophy, path: '/ranking-atleta' },
    { label: 'Competições', icon: Calendar, path: '/meus-campeonatos' },
    { label: 'Notificações', icon: Bell, path: '/notificacoes' },
  ];

  const inscricao = getInscricaoAtiva(profile?.inscricoes ?? dashboard?.ultimasInscricoes);
  const athleteId = inscricao?.numeroRegistro ?? '—';
  const displayName = profile?.nomeCompleto || user?.nome || 'Atleta';
  const initials = getInitials(displayName);

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col transition-transform duration-300',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)] tracking-wide leading-tight">
                SPORT DATA
              </p>
              <p className="text-[11px] text-[var(--text-muted)] tracking-widest">ANGOLA</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-muted)] tracking-widest uppercase">
            Atleta
          </p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200',
                      active
                        ? 'bg-[#E60000] text-white rounded-r-xl rounded-l-none font-medium'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-xl'
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile footer */}
        <div className="p-4 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#E60000] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
              {profile?.usuario?.perfis?.[0]?.avatar ?? profile?.imagemUrl ? (
                <img src={profile!.usuario!.perfis![0]!.avatar ?? profile!.imagemUrl!} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{displayName}</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">ID: {athleteId}</p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="p-1.5 text-[var(--text-muted)] hover:text-brand hover:bg-[var(--hover-bg)] rounded-lg transition shrink-0"
                title="Ir para o site"
              >
                <Globe size={16} />
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition shrink-0"
                title="Terminar sessão"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export { Menu as DashboardMenuIcon };
export default DashboardSidebar;
