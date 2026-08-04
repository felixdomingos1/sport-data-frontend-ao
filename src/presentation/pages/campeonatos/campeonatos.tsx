import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ArrowRight,
  Calendar,
  Layers,
  Tag,
  Search,
  Users,
  Filter,
  Shield,
  Grid3X3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import type { Campeonato } from '../../../core/types/api.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const STATUS_MAP: Record<string, { label: string; color: string; dot: boolean }> = {
  INSCRICOES_ABERTAS: { label: 'Inscrições Abertas', color: 'bg-emerald-500', dot: false },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'bg-brand', dot: true },
  FINALIZADO: { label: 'Finalizado', color: 'bg-white/20', dot: false },
  INSCRICOES_FECHADAS: { label: 'Inscrições Fechadas', color: 'bg-amber-500', dot: false },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500', dot: false },
  RASCUNHO: { label: 'Rascunho', color: 'bg-white/10', dot: false },
};

const FORMATO_MAP: Record<string, string> = {
  LIGA: 'Liga',
  KNOCKOUT: 'Eliminação',
  GRUPOS: 'Grupos',
  MISTO: 'Misto',
  DOUBLE_ELIM: 'Dupla Eliminação',
  SWISS: 'Sistema Suíço',
};

const MODALIDADE_META: Record<string, { label: string; emoji: string; color: string }> = {
  JIU_JITSU: { label: 'Jiu-Jitsu', emoji: '🥋', color: 'from-amber-500/30 to-red-600/20' },
  KARATE: { label: 'Karaté', emoji: '🥋', color: 'from-sky-500/30 to-indigo-600/20' },
  JUDO: { label: 'Judo', emoji: '🥋', color: 'from-emerald-500/30 to-teal-600/20' },
  BASQUETEBOL: { label: 'Basquetebol', emoji: '🏀', color: 'from-orange-500/30 to-amber-600/20' },
  FUTEBOL: { label: 'Futebol', emoji: '⚽', color: 'from-emerald-500/30 to-green-600/20' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const CampeonatoCard: React.FC<{ campeonato: Campeonato; index: number }> = ({ campeonato, index }) => {
  const [hovered, setHovered] = useState(false);
  const statusInfo = STATUS_MAP[campeonato.status] ?? STATUS_MAP.EM_ANDAMENTO;
  const modal = MODALIDADE_META[campeonato.modalidade] ?? {
    label: campeonato.modalidade,
    emoji: '🏆',
    color: 'from-brand/30 to-brand/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]">
        <div
          className={`h-20 bg-gradient-to-br ${modal.color} relative overflow-hidden`}
        >
          <span className="absolute right-4 -bottom-3 text-6xl opacity-40">{modal.emoji}</span>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-brand/40 transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-brand" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                  {campeonato.nome}
                </h3>
                <p className="text-white/40 text-xs mt-0.5 truncate">
                  {modal.label} · {campeonato.temporada}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${statusInfo.color} text-white`}>
              {statusInfo.dot && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
                  <span className="relative rounded-full bg-white w-full h-full" />
                </span>
              )}
              {statusInfo.label}
            </span>
            {campeonato.status === 'INSCRICOES_ABERTAS' && (
              <span className="text-[10px] font-semibold text-emerald-400/80">
                até {formatDate(campeonato.dataInscricaoFim ?? campeonato.dataInicio)}
              </span>
            )}
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span>{FORMATO_MAP[campeonato.formato] ?? campeonato.formato}</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{formatDate(campeonato.dataInicio)} — {formatDate(campeonato.dataFim)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{campeonato._count?.participacoes ?? 0} participantes</span>
            </div>
            {campeonato.federacao && (
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{campeonato.federacao.nome}</span>
              </div>
            )}
          </div>

          <Link to={`/campeonatos/${campeonato.id}`}>
            <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-brand text-white text-xs font-bold tracking-wide hover:bg-brand/90 active:scale-[0.98] transition-all duration-150">
              <span>Ver Campeonato</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const STATUS_FILTERS = [
  { id: 'all', name: 'Todos' },
  { id: 'INSCRICOES_ABERTAS', name: 'Inscrições Abertas' },
  { id: 'EM_ANDAMENTO', name: 'Em Andamento' },
  { id: 'FINALIZADO', name: 'Finalizados' },
];

const MODALIDADE_FILTERS = [
  { id: 'all', name: 'Todas' },
  { id: 'JIU_JITSU', name: 'Jiu-Jitsu' },
  { id: 'KARATE', name: 'Karaté' },
  { id: 'JUDO', name: 'Judo' },
];

const Campeonatos: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedModalidade, setSelectedModalidade] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const result = await competicaoService.getCampeonatosPublicos({ limit: 100 });
        setCampeonatos(result.data);
      } catch {
        setCampeonatos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampeonatos();
  }, []);

  const filtered = useMemo(() => {
    return campeonatos.filter((c) => {
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedModalidade !== 'all' && c.modalidade !== selectedModalidade) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.nome.toLowerCase().includes(q) ||
          c.modalidade.toLowerCase().includes(q) ||
          (c.federacao?.nome ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [campeonatos, selectedStatus, selectedModalidade, search]);

  const openCount = campeonatos.filter((c) => c.status === 'INSCRICOES_ABERTAS').length;
  const liveCount = campeonatos.filter((c) => c.status === 'EM_ANDAMENTO').length;
  const finishedCount = campeonatos.filter((c) => c.status === 'FINALIZADO').length;
  const totalParticipants = campeonatos.reduce((acc, c) => acc + (c._count?.participacoes ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SEO
        title="Campeonatos"
        description="Explore os campeonatos de Jiu-Jitsu, Karaté, Judo e outras modalidades em Angola. Inscreva-se e acompanhe os chaveamentos em tempo real."
        canonical="/campeonatos"
      />

      <div className="relative h-[380px] md:h-[460px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1920&h=600&fit=crop"
          alt="Campeonatos"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/30" />
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-brand rounded-full" />
        <div className="relative h-full flex flex-col justify-center pl-14 pr-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3"
          >
            Angola · Competições
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-4"
          >
            Campeonatos<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              & Torneios
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-white/60 text-base max-w-sm leading-relaxed"
          >
            Jiu-Jitsu, Karaté e Judo. Inscreva-se e acompanhe os chaveamentos em tempo real.
          </motion.p>
          {openCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-500/60" />
                <span className="relative rounded-full bg-emerald-400 w-full h-full" />
              </span>
              <span className="text-emerald-400 text-sm font-semibold">
                {openCount} campeonato{openCount > 1 ? 's' : ''} com inscrições abertas
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10 overflow-x-auto scrollbar-none">
          {[
            { label: 'Total', value: campeonatos.length },
            { label: 'Inscrições Abertas', value: openCount },
            { label: 'Ao Vivo', value: liveCount, accent: true },
            { label: 'Finalizados', value: finishedCount },
            { label: 'Atletas', value: totalParticipants },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 shrink-0">
              <span className={`text-2xl font-black tabular-nums ${stat.accent ? 'text-brand' : 'text-white'}`}>
                {stat.value}
              </span>
              <span className="text-white/40 text-xs uppercase tracking-widest">{stat.label}</span>
              <span className="w-px h-5 bg-white/10 last:hidden" />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <Filter className="w-4 h-4 text-white/30 shrink-0 mr-1" />
            {STATUS_FILTERS.map((f) => {
              const isActive = selectedStatus === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedStatus(f.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-lg shadow-white/10'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/8 border border-white/10'
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
            <span className="w-px h-5 bg-white/10 mx-2 shrink-0" />
            {MODALIDADE_FILTERS.map((f) => {
              const isActive = selectedModalidade === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedModalidade(f.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-brand text-white shadow-lg shadow-brand/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/8 border border-white/10'
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar campeonato, modalidade, federação..."
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <SportLoadingScreen message="A carregar campeonatos..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-lg font-medium">Nenhum campeonato encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou a pesquisa</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((campeonato, index) => (
                <CampeonatoCard key={campeonato.id} campeonato={campeonato} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campeonatos;
