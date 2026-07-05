import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, User, FileText, Bell, CreditCard, Trophy, X } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';

interface PageItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  keywords: string[];
}

const pages: PageItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} />, keywords: ['inicio', 'home', 'painel'] },
  { label: 'Meu Perfil', path: '/perfil', icon: <User size={16} />, keywords: ['perfil', 'conta', 'dados'] },
  { label: 'Documentos', path: '/documentos', icon: <FileText size={16} />, keywords: ['documentos', 'bi', 'foto', 'arquivos'] },
  { label: 'Notificações', path: '/notificacoes', icon: <Bell size={16} />, keywords: ['notificacoes', 'avisos', 'alertas'] },
  { label: 'Pagamentos', path: '/pagamentos', icon: <CreditCard size={16} />, keywords: ['pagamentos', 'faturas', 'recibos'] },
  { label: 'Meus Campeonatos', path: '/meus-campeonatos', icon: <Trophy size={16} />, keywords: ['campeonatos', 'competicoes', 'torneios'] },
  { label: 'Ranking', path: '/ranking-atleta', icon: <Trophy size={16} />, keywords: ['ranking', 'classificacao', 'pontos'] },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const filtered = pages.filter(
    (p) =>
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.keywords.some((k) => k.includes(search.toLowerCase()))
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch('');
    setSelectedIdx(0);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [search]);

  function selectItem(item: PageItem) {
    navigate(item.path);
    handleClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      selectItem(filtered[selectedIdx]);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={handleClose}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-[#222]">
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar páginas..."
                className="flex-1 py-3.5 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-600 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
                <X size={12} onClick={handleClose} className="cursor-pointer hover:text-white" />
              </kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">Nenhum resultado</div>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={item.path}
                    onClick={() => selectItem(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                      idx === selectedIdx
                        ? 'bg-[#E60000]/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#222] text-[10px] text-gray-600">
              <span>↑↓ Navegar</span>
              <span>↵ Abrir</span>
              <span>Esc Fechar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
