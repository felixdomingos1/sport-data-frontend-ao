import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Network,
  Shield,
  Tag,
  Trophy,
  Users,
  UserPlus,
  CheckCircle,
  Loader2,
  Medal,
  Lock,
} from 'lucide-react';
import { competicaoService } from '@/infrastructure/services/competicao.service';
import { campeonatoService } from '@/infrastructure/services/campeonato.service';
import { bracketService } from '@/infrastructure/services/bracket.service';
import { useAuthStore } from '@/store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import type { Campeonato, CategoriaCampeonato } from '@/core/types/api.types';
import type { BracketSummary } from '@/core/types/bracket.types';
import { getInscricaoAtiva } from '@/presentation/utils/atleta.utils';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import { SEO } from '@/presentation/components/seo/seo';
import { SportsEventLD, BreadcrumbLD } from '@/presentation/components/seo/json-ld';

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

const MODALIDADE_META: Record<string, { label: string; emoji: string; hero: string }> = {
  JIU_JITSU: { label: 'Jiu-Jitsu', emoji: '🥋', hero: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1920&h=600&fit=crop' },
  KARATE: { label: 'Karaté', emoji: '🥋', hero: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1920&h=600&fit=crop' },
  JUDO: { label: 'Judo', emoji: '🥋', hero: 'https://images.unsplash.com/photo-1548857562-6b4f5f9a4d2b?w=1920&h=600&fit=crop' },
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getAthleteName(p: { inscricao?: { atleta?: { nomeCompleto?: string; usuario?: { nome?: string } | null } | null; clube?: { nome?: string } | null } | null }): string {
  return (
    p.inscricao?.atleta?.nomeCompleto ??
    p.inscricao?.atleta?.usuario?.nome ??
    p.inscricao?.clube?.nome ??
    'Participante'
  );
}

function getAthletePhoto(p: { inscricao?: { atleta?: { imagemUrl?: string | null } | null } | null }): string | null {
  return p.inscricao?.atleta?.imagemUrl ?? null;
}

const CampeonatoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { profile, fetchMe } = useAtletaMeStore();

  const [campeonato, setCampeonato] = useState<Campeonato | null>(null);
  const [brackets, setBrackets] = useState<BracketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inscrevendo, setInscrevendo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    Promise.all([
      competicaoService.getCampeonatoById(id),
      bracketService.listarPorCampeonato(id).catch(() => [] as BracketSummary[]),
    ])
      .then(([c, brs]) => {
        setCampeonato(c);
        setBrackets(brs);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchMe().catch(() => undefined);
    }
  }, [isAuthenticated, profile, fetchMe]);

  const inscricaoAtiva = useMemo(
    () => (campeonato ? getInscricaoAtiva(profile?.inscricoes) : null),
    [profile, campeonato]
  );

  const jaInscritoIds = useMemo(() => {
    if (!campeonato) return new Set<string>();
    return new Set(
      (campeonato.inscricoes ?? []).map((p) => p.inscricaoId)
    );
  }, [campeonato]);

  const podeInscrever = Boolean(
    campeonato &&
      campeonato.status === 'INSCRICOES_ABERTAS' &&
      inscricaoAtiva &&
      inscricaoAtiva.federacaoId === campeonato.federacaoId
  );

  const handleInscrever = useCallback(
    async (categoria: CategoriaCampeonato) => {
      if (!campeonato || !inscricaoAtiva) return;
      setInscrevendo(categoria.id);
      try {
        await campeonatoService.inscreverAtleta(campeonato.id, {
          inscricaoId: inscricaoAtiva.id,
          categoriaId: categoria.id,
        });
        toast.success('Inscrição no campeonato realizada com sucesso!');
        const updated = await competicaoService.getCampeonatoById(campeonato.id);
        setCampeonato(updated);
      } catch {
        toast.error('Erro ao inscrever no campeonato. Verifique se já não está inscrito.');
      } finally {
        setInscrevendo(null);
      }
    },
    [campeonato, inscricaoAtiva]
  );

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
          <Link to="/campeonatos" className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos campeonatos
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[campeonato.status] ?? STATUS_MAP.EM_ANDAMENTO;
  const modal = MODALIDADE_META[campeonato.modalidade] ?? {
    label: campeonato.modalidade,
    emoji: '🏆',
    hero: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=600&fit=crop',
  };
  const totalParticipantes = campeonato._count?.participacoes ?? campeonato.inscricoes?.length ?? 0;
  const totalCategorias = campeonato.categorias?.length ?? 0;
  const totalBrackets = brackets.length;

  const getBracketForCategoria = (categoriaId: string) =>
    brackets.find((b) => b.categoriaId === categoriaId);

  const renderRegistrationPanel = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-brand" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-sm mb-1">Inscrições abertas</p>
          <p className="text-gray-500 dark:text-white/50 text-xs mb-5">
            Entre na sua conta de atleta para se inscrever neste campeonato.
          </p>
          <Link
            to={`/login?redirect=/campeonatos/${campeonato.id}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand/90 transition"
          >
            <UserPlus className="w-4 h-4" />
            Entrar e inscrever-se
          </Link>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 text-gray-400 dark:text-white/30 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 dark:text-white/50 text-xs">A verificar perfil de atleta...</p>
        </div>
      );
    }

    if (!inscricaoAtiva) {
      return (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-sm mb-1">Faltam dados federativos</p>
          <p className="text-gray-500 dark:text-white/50 text-xs leading-relaxed mb-5">
            Para se inscrever num campeonato precisa de ter uma inscrição federativa ativa.
          </p>
          <Link
            to="/inscricoes"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-white/90 transition"
          >
            <Shield className="w-4 h-4" />
            Completar inscrição
          </Link>
        </div>
      );
    }

    if (inscricaoAtiva.federacaoId !== campeonato.federacaoId) {
      return (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-sm mb-1">Federação diferente</p>
          <p className="text-gray-500 dark:text-white/50 text-xs leading-relaxed mb-5">
            A sua inscrição federativa ativa pertence a outra federação.
            {campeonato.federacao && (
              <span className="block mt-1 text-gray-600 dark:text-white/70">Necessária inscrição em: {campeonato.federacao.nome}</span>
            )}
          </p>
          <Link
            to="/inscricoes"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-white/90 transition"
          >
            <Shield className="w-4 h-4" />
            Gerir inscrição federativa
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-2 py-2">
        <p className="text-gray-600 dark:text-white/60 text-xs leading-relaxed mb-3">
          Escolha a categoria onde pretende competir. A inscrição fica registada na sua federação.
        </p>
        {(campeonato.categorias ?? []).map((categoria) => {
          const inscrito = jaInscritoIds.has(inscricaoAtiva.id) && (campeonato.inscricoes ?? []).some(
            (p) => p.categoriaId === categoria.id && p.inscricaoId === inscricaoAtiva.id
          );
          const busy = inscrevendo === categoria.id;
          return (
            <button
              key={categoria.id}
              onClick={() => handleInscrever(categoria)}
              disabled={inscrito || busy || campeonato.status !== 'INSCRICOES_ABERTAS'}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-xs font-semibold transition-all duration-150 ${
                inscrito
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:border-brand/40 active:scale-[0.99] disabled:opacity-50'
              }`}
            >
              <span>{categoria.nome}</span>
              {inscrito ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Inscrito
                </span>
              ) : busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">Inscrever</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO
        title={campeonato.nome}
        description={`${modal.label} — ${FORMATO_MAP[campeonato.formato] ?? campeonato.formato}. ${campeonato.descricao ?? 'Categorias, inscrições e chaveamento do campeonato.'}`}
        canonical={`/campeonatos/${campeonato.id}`}
      />
      <SportsEventLD
        name={campeonato.nome}
        description={`${modal.label} — ${FORMATO_MAP[campeonato.formato] ?? campeonato.formato}. ${campeonato.descricao ?? 'Categorias, inscrições e chaveamento do campeonato.'}`}
        startDate={campeonato.dataInicio}
        endDate={campeonato.dataFim}
        image={campeonato.bannerUrl ?? undefined}
        url={`/campeonatos/${campeonato.id}`}
        organizerName={campeonato.federacao?.nome ?? undefined}
        sport={campeonato.modalidade ?? undefined}
        status={campeonato.status === 'INSCRICOES_ABERTAS' ? 'Scheduled' : campeonato.status === 'EM_ANDAMENTO' ? 'Scheduled' : campeonato.status === 'FINALIZADO' ? 'Completed' : campeonato.status === 'CANCELADO' ? 'Cancelled' : 'Scheduled'}
      />
      <BreadcrumbLD items={[{ name: 'Campeonatos', url: '/campeonatos' }, { name: campeonato.nome, url: `/campeonatos/${campeonato.id}` }]} />

      <div className="relative h-[320px] md:h-[400px] overflow-hidden">
        <img
          src={campeonato.bannerUrl || modal.hero}
          alt={campeonato.nome}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-24 bg-brand rounded-full" />

        <div className="relative h-full flex flex-col justify-end pl-14 pr-8 pb-10 max-w-4xl">
          <Link to="/campeonatos" className="inline-flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs font-bold tracking-wide mb-4 hover:text-gray-900 dark:hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar aos campeonatos
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                <Tag className="w-3 h-3" />
                {modal.label} · {FORMATO_MAP[campeonato.formato] ?? campeonato.formato}
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
            {campeonato.metadata?.local && (
              <p className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/60 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {campeonato.metadata.local}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { icon: Calendar, label: 'Início', value: formatDate(campeonato.dataInicio) },
            { icon: Clock, label: 'Fim', value: formatDate(campeonato.dataFim) },
            { icon: Users, label: 'Participantes', value: String(totalParticipantes) },
            { icon: GridIcon, label: 'Categorias', value: String(totalCategorias) },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">{s.label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {campeonato.descricao && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Sobre o Campeonato</h2>
                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed whitespace-pre-line">{campeonato.descricao}</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <GridIcon className="w-4 h-4 text-brand" />
                  <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Categorias</h2>
                </div>
                {totalBrackets > 0 && (
                  <Link
                    to={`/chaveamento/${campeonato.id}`}
                    className="inline-flex items-center gap-2 text-brand text-xs font-bold hover:underline"
                  >
                    <Network className="w-3.5 h-3.5" />
                    Ver chaveamento completo
                  </Link>
                )}
              </div>

              {totalCategorias === 0 ? (
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl py-12 text-center text-gray-400 dark:text-white/30 text-sm">
                  Sem categorias definidas
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(campeonato.categorias ?? []).map((categoria) => {
                    const participantes = categoria.participacoes?.length ?? 0;
                    const bracket = getBracketForCategoria(categoria.id);
                    return (
                      <div
                        key={categoria.id}
                        className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-4 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                              <Medal className="w-4 h-4 text-brand" />
                            </div>
                            <div className="min-w-0">
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate">{categoria.nome}</h3>
                            <p className="text-gray-500 dark:text-white/40 text-[11px]">
                                {categoria.genero === 'M' ? 'Masculino' : categoria.genero === 'F' ? 'Feminino' : 'Misto'}
                                {categoria.pesoMinimo !== undefined && categoria.pesoMinimo !== null
                                  ? ` · ${categoria.pesoMinimo}-${categoria.pesoMaximo ?? '∞'} kg`
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-white/50 px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 shrink-0">
                            <Users className="w-3 h-3" />
                            {participantes}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/chaveamento/${campeonato.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white text-[11px] font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition"
                          >
                            <Network className="w-3 h-3" />
                            {bracket ? 'Visualizar Chave' : 'Chaveamento'}
                          </Link>
                          {isAuthenticated && podeInscrever && (
                            <button
                              onClick={() => handleInscrever(categoria)}
                              disabled={inscrevendo === categoria.id}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white text-[11px] font-bold hover:bg-brand/90 transition disabled:opacity-50"
                            >
                              {inscrevendo === categoria.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <UserPlus className="w-3 h-3" />
                              )}
                              Inscrever
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center gap-2.5 mb-4">
                <Users className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Inscritos</h2>
                <span className="text-gray-400 dark:text-white/30 text-xs font-semibold">({totalParticipantes})</span>
              </div>
              {(campeonato.inscricoes ?? []).length === 0 ? (
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl py-12 text-center text-gray-400 dark:text-white/30 text-sm">
                  Ainda não há inscritos
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden">
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-200 dark:divide-white/[0.04]">
                    {(campeonato.inscricoes ?? []).map((p, idx) => {
                      const foto = getAthletePhoto(p);
                      const nome = getAthleteName(p);
                      const categoria = p.categoria ?? (campeonato.categorias ?? []).find((c) => c.id === p.categoriaId);
                      return (
                        <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                          <span className="text-gray-400 dark:text-white/30 text-xs font-mono w-6 shrink-0">{idx + 1}</span>
                          {foto ? (
                            <img src={foto} alt={nome} className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-black shrink-0">
                              {nome.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                          <p className="text-gray-900 dark:text-white text-xs font-semibold truncate">{nome}</p>
                          <p className="text-gray-500 dark:text-white/40 text-[11px] truncate">
                              {p.inscricao?.clube?.nome ?? p.inscricao?.academia?.nome ?? '—'}
                            </p>
                          </div>
                          {categoria && (
                            <span className="text-[10px] font-bold text-gray-500 dark:text-white/40 px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 shrink-0">
                              {categoria.nome}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <UserPlus className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Inscrição</h2>
              </div>
              {renderRegistrationPanel()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Informações</h2>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span>Formato: {FORMATO_MAP[campeonato.formato] ?? campeonato.formato}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Início: {formatDate(campeonato.dataInicio)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Fim: {formatDate(campeonato.dataFim)}</span>
              </div>
              {campeonato.dataInscricaoFim && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Fim das inscrições: {formatDateTime(campeonato.dataInscricaoFim)}</span>
                </div>
              )}
              {campeonato.metadata?.local && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{campeonato.metadata.local}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{campeonato.federacao?.nome ?? 'Federação'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GridIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export default CampeonatoDetalhe;
