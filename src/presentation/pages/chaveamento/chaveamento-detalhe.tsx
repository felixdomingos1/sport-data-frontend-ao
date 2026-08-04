import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Tag,
  Trophy,
  BarChart3,
  Shield,
  Network,
} from 'lucide-react';
import { competicaoService, type ClassificacaoItem } from '../../../infrastructure/services/competicao.service';
import { bracketService } from '../../../infrastructure/services/bracket.service';
import { useBracketStore } from '../../../store/bracket.store';
import type { Campeonato, Fase, Partida } from '../../../core/types/api.types';
import type { BracketDto, BracketSummary } from '../../../core/types/bracket.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';
import BracketViewer from '../../components/bracket/bracket-viewer';

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
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatMatchDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const MatchStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; cls: string }> = {
    AGENDADA: { label: 'Agendada', cls: 'bg-white/10 text-white/60' },
    EM_ANDAMENTO: { label: 'Ao Vivo', cls: 'bg-brand text-white' },
    FINALIZADA: { label: 'Finalizada', cls: 'bg-white/20 text-white/70' },
    CANCELADA: { label: 'Cancelada', cls: 'bg-red-500/20 text-red-400' },
    ADIADA: { label: 'Adiada', cls: 'bg-amber-500/20 text-amber-400' },
    INTERVALO: { label: 'Intervalo', cls: 'bg-amber-500/20 text-amber-400' },
  };
  const info = map[status] ?? map.AGENDADA;
  return (
    <span className={`inline-flex text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${info.cls}`}>
      {info.label}
    </span>
  );
};

const StandingsTable: React.FC<{ data: ClassificacaoItem[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/5">
          <th className="text-left text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-4">#</th>
          <th className="text-left text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-4">Equipa / Atleta</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">J</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">V</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">E</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">D</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">GP</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">GC</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-2">SG</th>
          <th className="text-center text-white/40 text-xs font-bold uppercase tracking-widest py-3 px-4">Pts</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={row.participacaoId}
            className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${i < 3 ? 'bg-white/[0.02]' : ''}`}
          >
            <td className="py-3 px-4 text-white/60 font-mono text-xs">{row.posicao}</td>
            <td className="py-3 px-4 text-white font-semibold text-sm">
              {row.nomeEquipa ?? row.nomeAtleta ?? '—'}
            </td>
            <td className="text-center py-3 px-2 text-white/50 text-xs">{row.vitorias + row.derrotas + row.empates}</td>
            <td className="text-center py-3 px-2 text-emerald-400 text-xs font-semibold">{row.vitorias}</td>
            <td className="text-center py-3 px-2 text-amber-400 text-xs">{row.empates}</td>
            <td className="text-center py-3 px-2 text-red-400 text-xs">{row.derrotas}</td>
            <td className="text-center py-3 px-2 text-white/50 text-xs">{row.golsPro}</td>
            <td className="text-center py-3 px-2 text-white/50 text-xs">{row.golsContra}</td>
            <td className="text-center py-3 px-2 text-white/50 text-xs">
              {row.saldoGols > 0 ? `+${row.saldoGols}` : row.saldoGols}
            </td>
            <td className="text-center py-3 px-4 text-white font-bold text-sm">{row.pontos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FasesView: React.FC<{
  fases: Fase[];
  activeTab: string;
  onTabChange: (id: string) => void;
  loadingPhase: boolean;
  confrontos: Partida[];
  classificacao: ClassificacaoItem[];
}> = ({ fases, activeTab, onTabChange, loadingPhase, confrontos, classificacao }) => {
  const activeFase = fases.find((f) => f.id === activeTab);
  const showBracket = activeFase?.tipo === 'ELIMINATORIA';

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {fases
          .slice()
          .sort((a, b) => a.ordem - b.ordem)
          .map((fase) => (
            <button
              key={fase.id}
              onClick={() => onTabChange(fase.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === fase.id
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {fase.nome}
            </button>
          ))}
      </div>

      {activeFase && (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
            <Trophy className="w-4 h-4 text-brand" />
            <span className="text-white font-bold text-sm">{activeFase.nome}</span>
          </div>
          {loadingPhase ? (
            <div className="py-16 flex justify-center">
              <SportLoadingScreen message="A carregar fase..." fullscreen={false} size="sm" />
            </div>
          ) : (
            <div className="p-2">
              {showBracket && confrontos.length > 0 && (
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 min-w-max px-4">
                    {confrontos.map((partida) => (
                      <div
                        key={partida.id}
                        className="bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden min-w-[220px]"
                      >
                        <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                          <span className="text-white/30 text-[10px] uppercase tracking-wider font-semibold">
                            Ronda {partida.rodada ?? 1}
                          </span>
                          <MatchStatusBadge status={partida.status} />
                        </div>
                        <div className="divide-y divide-white/[0.03]">
                          {(partida.jogadores ?? []).map((jp, idx) => (
                            <div
                              key={jp.id}
                              className={`flex items-center justify-between px-3 py-2.5 ${jp.vencedor ? 'bg-white/[0.03]' : ''}`}
                            >
                              <span className={`text-xs font-semibold truncate ${jp.vencedor ? 'text-white' : 'text-white/60'}`}>
                                {jp.participacao?.inscricao?.atleta?.nomeCompleto ??
                                  jp.participacao?.inscricao?.clube?.nome ??
                                  `Participante ${idx + 1}`}
                              </span>
                              <span className={`text-sm font-black tabular-nums ${jp.vencedor ? 'text-white' : 'text-white/40'}`}>
                                {jp.gols}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-1 bg-white/[0.02]">
                          <span className="text-white/30 text-[10px]">{formatMatchDate(partida.dataHora)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showBracket && confrontos.length === 0 && (
                <div className="py-12 text-center text-white/30 text-sm">Sem confrontos disponíveis</div>
              )}
              {!showBracket && classificacao.length > 0 && <StandingsTable data={classificacao} />}
              {!showBracket && classificacao.length === 0 && (
                <div className="py-12 text-center text-white/30 text-sm">Sem classificação disponível</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChaveamentoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campeonato, setCampeonato] = useState<Campeonato | null>(null);
  const [fases, setFases] = useState<Fase[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [confrontos, setConfrontos] = useState<Partida[]>([]);
  const [classificacao, setClassificacao] = useState<ClassificacaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [error, setError] = useState(false);

  const brackets = useBracketStore((s) => s.brackets);
  const selectedBracket = useBracketStore((s) => s.selected);
  const isLoadingDetail = useBracketStore((s) => s.isLoadingDetail);
  const [selectedBracketId, setSelectedBracketId] = useState<string>('');

  const loadFase = useCallback(async (faseId: string) => {
    setLoadingPhase(true);
    Promise.all([
      competicaoService.getConfrontos(faseId).catch(() => []),
      competicaoService.getClassificacao(faseId).catch(() => []),
    ])
      .then(([confs, classif]) => {
        setConfrontos(confs);
        setClassificacao(classif);
      })
      .finally(() => setLoadingPhase(false));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    useBracketStore.getState().subscribeToCampeonato(id);

    Promise.all([
      competicaoService.getCampeonatoById(id),
      competicaoService.getFases(id).catch(() => []),
      bracketService.listarPorCampeonato(id).catch(() => [] as BracketSummary[]),
    ])
      .then(([c, f, brs]) => {
        setCampeonato(c);
        setFases(f);
        if (f.length > 0 && brs.length === 0) setActiveTab(f[0].id);
        if (brs.length > 0) setSelectedBracketId(brs[0].id);
        useBracketStore.setState({ brackets: brs, isLoadingList: false });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    return () => {
      useBracketStore.getState().unsubscribeFromCampeonato(id as string);
    };
  }, [id]);

  useEffect(() => {
    if (activeTab && brackets.length === 0) {
      loadFase(activeTab);
    }
  }, [activeTab, brackets.length, loadFase]);

  useEffect(() => {
    if (!selectedBracketId) return;
    useBracketStore.getState().fetchById(selectedBracketId).catch(() => undefined);
  }, [selectedBracketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <SportLoadingScreen message="A carregar campeonato..." fullscreen={false} size="md" />
      </div>
    );
  }

  if (error || !campeonato) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-lg font-medium">Campeonato não encontrado</p>
          <Link to="/chaveamento" className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos chaveamentos
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[campeonato.status] ?? STATUS_MAP.EM_ANDAMENTO;
  const showBrackets = brackets.length > 0;
  const activeBracket: BracketDto | null = selectedBracket;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SEO
        title={campeonato.nome}
        description={`${campeonato.modalidade} — ${FORMATO_MAP[campeonato.formato] ?? campeonato.formato}. ${campeonato.descricao ?? 'Chaveamento e classificações do campeonato.'}`}
        canonical={`/chaveamento/${campeonato.id}`}
      />

      <div className="relative h-[320px] md:h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=600&fit=crop"
          alt={campeonato.nome}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-24 bg-brand rounded-full" />

        <div className="relative h-full flex flex-col justify-end pl-14 pr-8 pb-10 max-w-4xl">
          <Link to="/chaveamento" className="inline-flex items-center gap-2 text-white/60 text-xs font-bold tracking-wide mb-4 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar aos chaveamentos
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                <Tag className="w-3 h-3" />
                {FORMATO_MAP[campeonato.formato] ?? campeonato.formato}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${statusInfo.color} text-white`}>
                {statusInfo.dot && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
                    <span className="relative rounded-full bg-white w-full h-full" />
                  </span>
                )}
                {statusInfo.label}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-3">
              {campeonato.nome}
            </h1>

            <p className="text-white/50 text-sm font-semibold tracking-wide">{campeonato.modalidade}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Início</p>
              <p className="text-sm font-bold text-white">{formatDate(campeonato.dataInicio)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fim</p>
              <p className="text-sm font-bold text-white">{formatDate(campeonato.dataFim)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tipo</p>
              <p className="text-sm font-bold text-white">{campeonato.tipo === 'EQUIPAS' ? 'Equipes' : campeonato.tipo === 'INDIVIDUAL' ? 'Individual' : 'Misto'}</p>
            </div>
          </div>
        </motion.div>

        {campeonato.descricao && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Sobre o Campeonato</h2>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{campeonato.descricao}</p>
          </motion.div>
        )}

        {showBrackets ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {brackets.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Network className="w-4 h-4 text-brand" />
                {brackets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBracketId(b.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                      selectedBracketId === b.id
                        ? 'bg-brand text-white shadow-lg shadow-brand/20'
                        : 'bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {b.nome}
                    <span className="ml-2 text-[10px] opacity-70">
                      {b.totalParticipantes} part.
                    </span>
                  </button>
                ))}
              </div>
            )}

            {isLoadingDetail && !activeBracket ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl py-20 flex justify-center">
                <SportLoadingScreen message="A carregar chaveamento..." fullscreen={false} size="md" />
              </div>
            ) : activeBracket ? (
              <BracketViewer bracket={activeBracket} />
            ) : (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl py-16 text-center text-white/30">
                <p className="text-sm">Chaveamento indisponível</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Fases</h2>
            </div>
            {fases.length > 0 ? (
              <FasesView
                fases={fases}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                loadingPhase={loadingPhase}
                confrontos={confrontos}
                classificacao={classificacao}
              />
            ) : (
              <div className="text-center py-16 text-white/30">
                <p className="text-sm">Nenhuma fase configurada para este campeonato</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChaveamentoDetalhe;
