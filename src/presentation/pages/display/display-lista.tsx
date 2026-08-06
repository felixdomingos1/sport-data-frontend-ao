import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Search, Trophy, ArrowRight, Swords } from 'lucide-react';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import { bracketService } from '../../../infrastructure/services/bracket.service';
import type { Campeonato } from '../../../core/types/api.types';
import type { BracketSummary } from '../../../core/types/bracket.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

const DisplayLista: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [bracketsAtivos, setBracketsAtivos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    Promise.all([
      competicaoService.getCampeonatosPublicos({ limit: 100 }),
      bracketService.listar().catch(() => []),
    ]).then(([res, brackets]) => {
      setCampeonatos(res?.data ?? []);
      const ativos = new Set<string>();
      for (const b of brackets) {
        if (b.status === 'READY' || b.status === 'IN_PROGRESS') {
          ativos.add(b.campeonatoId);
        }
      }
      setBracketsAtivos(ativos);
    }).catch(() => setCampeonatos([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = campeonatos.filter(
    (c) =>
      (c.status === 'EM_ANDAMENTO' || c.status === 'FINALIZADO' || c.status === 'INSCRICOES_FECHADAS') &&
      (!search || c.nome.toLowerCase().includes(search.toLowerCase())),
  );

  const aoVivo = filtered.filter((c) => bracketsAtivos.has(c.id));
  const outros = filtered.filter((c) => !bracketsAtivos.has(c.id));

  const totalPages = Math.ceil((aoVivo.length + outros.length) / perPage);
  const allCards = [...aoVivo, ...outros];
  const paginated = allCards.slice((page - 1) * perPage, page * perPage);
  const paginatedLive = paginated.filter((c) => bracketsAtivos.has(c.id));
  const paginatedOutros = paginated.filter((c) => !bracketsAtivos.has(c.id));

  if (loading) return <SportLoadingScreen />;

  const renderCard = (c: Campeonato, isLive: boolean) => (
    <Link
      key={c.id}
      to={`/display/${c.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between rounded-xl p-5 transition-all group ${
        isLive
          ? 'bg-green-500/5 border-2 border-green-500/30 hover:border-green-400 shadow-lg shadow-green-500/5'
          : 'bg-white/[0.03] border border-white/10 hover:border-brand/30 hover:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isLive ? 'bg-green-500/10' : 'bg-brand/10'}`}>
          {isLive ? <Swords className="w-5 h-5 text-green-400" /> : <Trophy className="w-5 h-5 text-brand" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.nome}</h3>
          <p className="text-xs text-gray-500 dark:text-white/40">{c.modalidade}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LUTAS AO VIVO
          </span>
        ) : (
          <span className="text-[10px] font-bold text-gray-500 dark:text-white/30 uppercase tracking-widest">
            {c.status === 'EM_ANDAMENTO' ? 'EM ANDAMENTO' : c.status === 'FINALIZADO' ? 'FINALIZADO' : 'FECHADO'}
          </span>
        )}
        <ArrowRight className={`w-5 h-5 transition-colors ${isLive ? 'text-green-400' : 'text-white/20 group-hover:text-brand'}`} />
      </div>
    </Link>
  );

  if (loading) return <SportLoadingScreen />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-black">Ecrã de Resultados ao Vivo</h1>
          </div>
          <p className="text-gray-500 dark:text-white/40 text-sm mb-8">
            Seleciona um campeonato para exibir no ecrã público.
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Procurar campeonato..."
              className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>

        <div className="space-y-8">
          {paginatedLive.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-green-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Com lutas ao vivo
              </h2>
              <div className="grid gap-3">
                {paginatedLive.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    {renderCard(c, true)}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {paginatedOutros.length > 0 && (
            <div>
              {paginatedLive.length > 0 && (
                <h2 className="text-xs font-bold text-gray-500 dark:text-white/30 uppercase tracking-[0.2em] mb-3">Outros campeonatos</h2>
              )}
              <div className="grid gap-3">
                {paginatedOutros.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    {renderCard(c, false)}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500 dark:text-white/40">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition"
              >
                Seguinte
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-gray-400 text-center py-16">
              Nenhum campeonato encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayLista;
