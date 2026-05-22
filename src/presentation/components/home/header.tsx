import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

import { useAuthStore } from '../../../store/auth.store';
import { useFederacaoStore } from '../../../store/federacao.store';
import ThemeToggle from '../theme-toggle';
import { Federacao } from '../../../core/types/api.types';

const Header: React.FC = () => {
  const { isAuthenticated, } = useAuthStore();
  const { federacoes } = useFederacaoStore();

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openComp, setOpenComp] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Rankings', path: '/rankings' },
    { name: 'Eventos', path: '/eventos' },
  ];

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[70%] md:w-[70%]">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/20 dark:border-gray-700/40 rounded-[30px] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">SDA</span>
              </div>
              <span className="hidden sm:block font-bold text-white">
                Sport Data Angola
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 relative">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white/80 hover:text-white transition"
                >
                  {item.name}
                </Link>
              ))}
              <div className="relative">
                <button
                  onClick={() => setOpenComp(!openComp)}
                  className="flex items-center gap-1 text-white/80 hover:text-white"
                >
                  Competições
                  <ChevronDown size={16} />
                </button>
                {openComp && (
                  <div className="absolute top-10 left-0 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 min-w-55 shadow-xl">
                    {Array.isArray(federacoes) &&
                      federacoes.map((f: Federacao) => (
                        <Link
                          key={f.id}
                          to={`/competicoes/${f.id}`}
                          className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                        >
                          {f.nome}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                Ao Vivo
              </div>
            </div>

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar atletas, clubes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-60 px-4 py-2 pl-10 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
              </div>
            </form>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">

              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                    <Bell className="w-5 h-5 text-white" />
                  </button>

                  <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-red-600 to-yellow-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2"
                >
                  Entrar
                </Link>
              )}

              {/* MOBILE MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                {isMobileMenuOpen ? (
                  <X className="text-white" />
                ) : (
                  <Menu className="text-white" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block py-2 text-white/80"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
