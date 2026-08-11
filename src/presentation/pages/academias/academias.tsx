import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Users, Search, GraduationCap } from 'lucide-react';
import { apiClient } from '../../../infrastructure/api/client';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';

interface AcademiaItem {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  logo?: string;
  cidade?: string;
  status: string;
  _count?: { atletas: number };
  federacao?: { nome: string };
}

const Academias: React.FC = () => {
  const [academias, setAcademias] = useState<AcademiaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get<{ data: AcademiaItem[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }>(
        `/academias?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
      )
      .then((res: any) => {
        setAcademias(res.data ?? []);
        if (res.pagination) {
          setPage(res.pagination.page);
          setTotalPages(res.pagination.totalPages);
        }
      })
      .finally(() => setIsLoading(false));
  }, [page, search]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title="Academias" description="Descubra as academias desportivas de Angola filiadas às federações nacionais." canonical="/academias" />
      <div className="relative h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=400&fit=crop"
          alt="Hero academias"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Academias
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Academias Desportivas
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-lg">
            Explore as academias registadas nas federações desportivas de Angola.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Pesquisar academia..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-brand/50 transition text-sm"
          />
        </div>

        {isLoading ? (
          <SportLoadingScreen message="A carregar academias..." fullscreen={false} size="md" />
        ) : academias.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-white/30">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhuma academia encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {academias.map((academia, index) => (
              <motion.div
                key={academia.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                    <GraduationCap className="w-5 h-5 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-brand transition-colors">
                      {academia.nome}
                    </h3>
                    {academia.federacao && (
                      <p className="text-[11px] text-gray-400 dark:text-white/40">{academia.federacao.nome}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-white/30 mt-3 pt-3 border-t border-gray-200 dark:border-white/5">
                  {academia.cidade && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {academia.cidade}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <Users className="w-3 h-3" />
                    {academia._count?.atletas ?? 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Academias;
