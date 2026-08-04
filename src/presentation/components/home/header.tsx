import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Shield } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';
import clsx from 'clsx';

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Campeonatos', path: '/campeonatos' },
  { name: 'Federações', path: '/federacoes' },
  { name: 'Clubes', path: '/clubes' },
  { name: 'Atletas', path: '/atletas' },
  { name: 'Rankings', path: '/rankings' },
  { name: 'Eventos', path: '/eventos' },
];

const Header: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/atletas?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[72px]">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white tracking-wide leading-tight">SPORT DATA</p>
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
                      ? 'text-white bg-[#1a1a1a]'
                      : 'text-gray-400 hover:text-white hover:bg-[#141414]'
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
                  className="w-44 lg:w-52 pl-9 pr-4 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
                />
              </div>
            </form>

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
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
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
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-[#1a1a1a] pt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#141414] rounded-lg transition"
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
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E60000]/50"
                />
              </div>
            </form>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 border border-[#2a2a2a] text-gray-400 rounded-xl text-sm"
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
