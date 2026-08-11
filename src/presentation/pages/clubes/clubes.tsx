import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Users, Search } from 'lucide-react';
import { useClubeStore } from '../../../store/clube.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';

const Clubes: React.FC = () => {
  const { clubes, fetchAll, isLoading, pagination } = useClubeStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    fetchAll(page, limit);
  }, [fetchAll, page]);

  const filtered = search
    ? clubes.filter(c =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        (c.cidade && c.cidade.toLowerCase().includes(search.toLowerCase()))
      )
    : clubes;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title="Clubes" description="Descubra os clubes desportivos de Angola filiados às federações nacionais." canonical="/clubes" />
      <div className="relative h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1920&h=400&fit=crop"
          alt="Hero clubes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Clubes
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Clubes Desportivos
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-lg">
            Explore os clubes registados nas federações desportivas de Angola.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar clube..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-brand/50 transition text-sm"
          />
        </div>

        {isLoading ? (
          <SportLoadingScreen message="A carregar clubes..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-white/30">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum clube encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((clube, index) => (
              <Link to={`/clubes/${clube.id}`} key={clube.id}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {clube.logo ? (
                      <img src={clube.logo} alt={clube.nome} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-5 h-5 text-brand" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-brand transition-colors">
                      {clube.nome}
                    </h3>
                    {clube.cidade && (
                      <p className="text-xs text-gray-500 dark:text-white/40 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {clube.cidade}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/30 border-t border-gray-200 dark:border-white/5 pt-3">
                  {clube.anoFundacao && <span>Fundado em {clube.anoFundacao}</span>}
                  <span className="flex items-center gap-1 ml-auto">
                    <Users className="w-3 h-3" />
                    {clube._count?.atletas || 0}
                  </span>
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

export default Clubes;
