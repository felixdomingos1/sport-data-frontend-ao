import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Award, Medal } from 'lucide-react';
import { useArbitroStore } from '../../../store/arbitro.store';
import { CATEGORIA_ARBITRO_LABELS, FAIXA_ARBITRO_LABELS } from '@core/types/arbitro.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';

const FAIXA_STYLES: Record<string, string> = {
  BRANCA: 'bg-white text-gray-900 border border-gray-300',
  AZUL: 'bg-blue-600 text-white',
  ROXA: 'bg-purple-700 text-white',
  MARROM: 'bg-amber-800 text-white',
  PRETA: 'bg-gray-900 text-white',
  CORAL: 'bg-red-700 text-white',
  VERMELHA: 'bg-red-600 text-white',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Arbitros: React.FC = () => {
  const { arbitros, fetchAll, isLoading, pagination } = useArbitroStore();
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchAll(page, limit, {
      search: search || undefined,
      categoria: categoriaFilter !== 'TODAS' ? categoriaFilter : undefined,
    });
  }, [fetchAll, page, search, categoriaFilter]);

  const featured = arbitros.filter((a) => a.categoria === 'MESTRE').slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO
        title="Mestres Árbitros"
        description="Conheça os mestres árbitros e oficial de mesa registados na plataforma Sport Data Angola."
        canonical="/arbitros"
      />
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1920&h=400&fit=crop"
          alt="Hero árbitros"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Arbitragem
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Mestres Árbitros
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-base max-w-lg">
            A equipa de arbitragem que garante a integridade e qualidade das competições nacionais.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Featured mestres */}
        {featured.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Medal className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-black">Mestres Árbitros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((mestre) => (
                <Link
                  key={mestre.id}
                  to={`/arbitros/${mestre.id}`}
                  className="group bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative h-72 bg-gradient-to-br from-brand/30 to-brand-dark/30 overflow-hidden">
                    {mestre.imagemUrl ? (
                      <img
                        src={mestre.imagemUrl}
                        alt={mestre.nome}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-black text-white/30">
                          {getInitials(mestre.nome)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">{mestre.nome}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white">
                      {CATEGORIA_ARBITRO_LABELS[mestre.categoria]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${FAIXA_STYLES[mestre.faixa] ?? 'bg-secondary text-foreground'}`}
                    >
                      Faixa {FAIXA_ARBITRO_LABELS[mestre.faixa]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar árbitro por nome..."
            className="w-full max-w-sm px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand/50 transition text-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            {['TODAS', 'MESTRE', 'INTERNACIONAL', 'NACIONAL', 'REGIONAL', 'ESTADUAL'].map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition ${
                  categoriaFilter === c
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {c === 'TODAS' ? 'Todos' : c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SportLoadingScreen message="A carregar árbitros..." fullscreen={false} size="md" />
        ) : arbitros.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-white/30">
            <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum árbitro encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {arbitros.map((arbitro) => (
              <Link
                key={arbitro.id}
                to={`/arbitros/${arbitro.id}`}
                className="group block bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-center hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full bg-brand/20 mx-auto mb-4 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-brand/30 transition-all">
                  {arbitro.imagemUrl ? (
                    <img
                      src={arbitro.imagemUrl}
                      alt={arbitro.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-brand">{getInitials(arbitro.nome)}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{arbitro.nome}</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                  {CATEGORIA_ARBITRO_LABELS[arbitro.categoria]}
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <Award className="w-3 h-3 text-brand" />
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${FAIXA_STYLES[arbitro.faixa] ?? 'bg-secondary text-foreground'}`}
                  >
                    Faixa {FAIXA_ARBITRO_LABELS[arbitro.faixa]}
                  </span>
                  {arbitro.federacao?.nome && (
                    <span className="text-[10px] text-gray-400 dark:text-white/30">
                      · {arbitro.federacao.nome}
                    </span>
                  )}
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

export default Arbitros;