import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Shield, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';
import { useTheme } from '../ui/theme-provider';
import clsx from 'clsx';

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Campeonatos', path: '/campeonatos' },
  { name: 'Federações', path: '/federacoes' },
  { name: 'Clubes', path: '/clubes' },
  { name: 'Atletas', path: '/atletas' },
  { name: 'Rankings', path: '/rankings' },
  { name: 'Eventos', path: '/eventos' },
  { name: 'Display', path: '/display' },
];

const Header: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { resolved, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/atletas?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${resolved === 'dark' ? 'bg-[#0f0f0f]/95 border-[#1a1a1a]' : 'bg-white/95 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[72px]">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-bold tracking-wide leading-tight ${resolved === 'dark' ? 'text-white' : 'text-gray-900'}`}>SPORT DATA</p>
              <p className="text-[10px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition',
                    active
                      ? resolved === 'dark' ? 'text-white bg-[#1a1a1a]' : 'text-[#E60000] bg-red-50'
                      : resolved === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#141414]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-44 lg:w-52 pl-9 pr-4 py-2 rounded-xl text-sm transition focus:outline-none focus:border-[#E60000]/50 ${resolved === 'dark' ? 'bg-[#080808] border border-[#1a1a1a] text-white placeholder:text-gray-600' : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
            </form>

            <button
              onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition ${resolved === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
              title={resolved === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {resolved === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
              >
                Meu Painel
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={clsx('px-4 py-2 text-sm transition', resolved === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
                >
                  Registar
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition ${resolved === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={`lg:hidden pb-4 border-t pt-4 space-y-1 ${resolved === 'dark' ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm rounded-lg transition ${resolved === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#141414]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {item.name}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition focus:outline-none focus:border-[#E60000]/50 ${resolved === 'dark' ? 'bg-[#080808] border border-[#1a1a1a] text-white placeholder:text-gray-600' : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
            </form>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex-1 text-center py-2.5 border rounded-xl text-sm ${resolved === 'dark' ? 'border-[#2a2a2a] text-gray-400' : 'border-gray-200 text-gray-600'}`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-[#E60000] text-white rounded-xl text-sm font-medium"
                >
                  Registar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
