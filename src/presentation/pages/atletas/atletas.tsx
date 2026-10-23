import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Medal, Search } from 'lucide-react';
import { useAtletaStore } from '../../../store/atleta.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';
import { useDebouncedValue } from '../../hooks/use-debounced-value';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Atletas: React.FC = () => {
  const { atletas, fetchAll, isLoading, pagination } = useAtletaStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;
  const debouncedSearch = useDebouncedValue(search.trim());

  useEffect(() => {
    // Pesquisa no servidor: a lista é paginada, filtrar no cliente só cobriria a página atual
    fetchAll(page, limit, undefined, debouncedSearch || undefined).catch(() => {
      // erro já registado no store
    });
  }, [fetchAll, page, debouncedSearch]);

  // Loader completo apenas no primeiro carregamento; depois mantém a lista visível
  const isInitialLoading = isLoading && atletas.length === 0 && !pagination;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title="Atletas" description="Perfil dos atletas angolanos registados na plataforma Sport Data Angola." canonical="/atletas" />
      <div className="relative h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1920&h=400&fit=crop"
          alt="Hero atletas"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Atletas
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Atletas Registados
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-lg">
            Conheça os atletas registados na plataforma nacional de gestão desportiva.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar atleta por nome ou BI..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand/50 transition text-sm"
            />
          </div>
        </div>

        {isInitialLoading ? (
          <SportLoadingScreen message="A carregar atletas..." fullscreen={false} size="md" />
        ) : atletas.length === 0 ? (
          <div
            aria-busy={isLoading}
            className={`text-center py-20 text-gray-400 dark:text-white/30 transition-opacity ${isLoading ? 'opacity-50' : ''}`}
          >
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum atleta encontrado</p>
          </div>
        ) : (
          <div
            aria-busy={isLoading}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-opacity ${isLoading ? 'opacity-50' : ''}`}
          >
            {atletas.map((atleta, index) => (
              <Link to={`/atletas/${atleta.id}`} key={atleta.id}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-full bg-brand/20 mx-auto mb-3 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-brand/30 transition-all">
                  {atleta.imagemUrl ? (
                    <img src={atleta.imagemUrl} alt={atleta.nomeCompleto} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-brand">{getInitials(atleta.nomeCompleto)}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{atleta.nomeCompleto}</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{atleta.nacionalidade || 'Angola'}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-white/30">
                  <Medal className="w-3 h-3" />
                  <span>Atleta</span>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
        {pagination && (
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};

export default Atletas;
