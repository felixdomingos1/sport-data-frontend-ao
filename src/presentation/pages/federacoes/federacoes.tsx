import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Globe, ArrowRight } from 'lucide-react';
import { useFederacaoStore } from '../../../store/federacao.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';

const Federacoes: React.FC = () => {
  const { federacoes, fetchAll, isLoading, pagination } = useFederacaoStore();
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    fetchAll(page, limit);
  }, [fetchAll, page]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title="Federações" description="Conheça as federações desportivas de Angola — federações de basquetebol, futebol, andebol e mais." canonical="/federacoes" />
      <div className="relative h-[320px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1459865264687-287d453a4c7e?w=1920&h=400&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Gestão Desportiva
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Federações
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-lg">
            Conheça as federações desportivas de Angola e descubra atletas, clubes e competições.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
          <SportLoadingScreen message="A carregar federações..." fullscreen={false} size="md" />
        ) : federacoes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-white/30">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhuma federação encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {federacoes.map((federacao) => (
              <Link
                key={federacao.id}
                to={`/federacoes/${federacao.id}`}
                className="group block bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-brand/30 to-brand-dark/30 overflow-hidden">
                  {federacao.logo ? (
                    <>
                      <img
                        src={federacao.logo}
                        alt={federacao.nome}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{federacao.nome}</h3>
                    {federacao.descricao && (
                      <p className="text-sm text-gray-300 dark:text-white/70 line-clamp-1 mt-0.5 drop-shadow">{federacao.descricao}</p>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {federacao._count?.clubes || 0} clubes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {federacao._count?.atletas || 0} atletas
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {federacao.email && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-white/40 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{federacao.email}</span>
                      </div>
                    )}
                    {federacao.telefone && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-white/40 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{federacao.telefone}</span>
                      </div>
                    )}
                    {federacao.website && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-white/40 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{federacao.website}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                      Explorar <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
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

export default Federacoes;
