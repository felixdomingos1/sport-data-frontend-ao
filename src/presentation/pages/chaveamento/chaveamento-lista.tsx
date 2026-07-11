import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Calendar, Tag, Layers, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import type { Campeonato } from '../../../core/types/api.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const STATUS_MAP: Record<string, { label: string; color: string; dot: boolean }> = {
  INSCRICOES_ABERTAS: { label: 'Inscrições Abertas', color: 'bg-emerald-500', dot: false },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'bg-brand', dot: true },
  FINALIZADO: { label: 'Finalizado', color: 'bg-white/20', dot: false },
};

const FORMATO_MAP: Record<string, string> = {
  LIGA: 'Liga',
  KNOCKOUT: 'Eliminação',
  GRUPOS: 'Grupos',
  MISTO: 'Misto',
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand/40 opacity-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-brand" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm leading-tight truncate">
                  {campeonato.nome}
                </h3>
                <p className="text-white/40 text-xs mt-0.5 truncate">
                  {campeonato.modalidade}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${statusInfo.color} text-white`}>
              {statusInfo.dot && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
                  <span className="relative rounded-full bg-white w-full h-full" />
                </span>
              )}
              {statusInfo.label}
            </span>
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
            {campeonato.federacao && (
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{campeonato.federacao.nome}</span>
              </div>
            )}
          </div>

          <Link to={`/chaveamento/${campeonato.id}`}>
            <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/5 border border-white/5 text-white text-xs font-bold tracking-wide hover:bg-white/10 active:scale-[0.98] transition-all duration-150">
              <span>Ver chaveamento</span>
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

const ChaveamentoLista: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const result = await competicaoService.getCampeonatosPublicos({ limit: 50 });
        setCampeonatos(result.data);
      } catch {
        setCampeonatos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampeonatos();
  }, []);

  const filtered = selectedStatus === 'all'
    ? campeonatos
    : campeonatos.filter(c => c.status === selectedStatus);

  const openCount = campeonatos.filter(c => c.status === 'INSCRICOES_ABERTAS').length;
  const liveCount = campeonatos.filter(c => c.status === 'EM_ANDAMENTO').length;
  const finishedCount = campeonatos.filter(c => c.status === 'FINALIZADO').length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SEO
        title="Chaveamentos"
        description="Acompanhe os chaveamentos e classificações dos campeonatos desportivos de Angola."
        canonical="/chaveamento"
      />

      <div className="relative h-[400px] md:h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=600&fit=crop"
          alt="Chaveamentos"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/30" />
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-brand rounded-full" />
        <div className="relative h-full flex flex-col justify-center pl-14 pr-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3"
          >
            Angola · Campeonatos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-4"
          >
            Chaveamentos<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              & Classificações
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-white/60 text-base max-w-sm leading-relaxed"
          >
            Acompanhe o desenvolvimento dos campeonatos em tempo real.
          </motion.p>
          {liveCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/20 border border-brand/30 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-brand/60" />
                <span className="relative rounded-full bg-brand w-full h-full" />
              </span>
              <span className="text-brand-light text-sm font-semibold">
                {liveCount} campeonato{liveCount > 1 ? 's' : ''} em andamento
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10 overflow-x-auto scrollbar-none">
          {[
            { label: 'Total', value: campeonatos.length },
            { label: 'Inscrições', value: openCount },
            { label: 'Ao Vivo', value: liveCount, accent: true },
            { label: 'Finalizados', value: finishedCount },
          ].map(stat => (
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Filter className="w-4 h-4 text-white/30 shrink-0 mr-1" />
          {STATUS_FILTERS.map(f => {
            const isActive = selectedStatus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedStatus(f.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${isActive
                    ? 'bg-white text-gray-900 shadow-lg shadow-white/10'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/8 border border-white/10'
                  }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <SportLoadingScreen message="A carregar campeonatos..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-lg font-medium">Nenhum campeonato encontrado</p>
            <p className="text-sm mt-1">Tente seleccionar outro filtro</p>
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

export default ChaveamentoLista;
