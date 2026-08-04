import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Trophy,
  Star,
  Medal,
  MapPin,
  Eye,
  Plus,
  Loader2,
  CheckCircle,
  X,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { campeonatoService } from '@/infrastructure/services/campeonato.service';
import type { Campeonato, CategoriaCampeonato } from '@/core/types/api.types';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import { formatDatePt, getInscricaoAtiva } from '@/presentation/utils/atleta.utils';
import { SEO } from '../../components/seo/seo';

type FiltroHistorico = 'todas' | 'nacional' | 'regional';

const MeusCampeonatos: React.FC = () => {
  const { profile, dashboard, isLoading, fetchDashboard } = useAtletaMeStore();
  const [proximos, setProximos] = useState<Campeonato[]>([]);
  const [filtro, setFiltro] = useState<FiltroHistorico>('todas');

  // Modal de inscrição
  const [showModal, setShowModal] = useState(false);
  const [campeonatosDisponiveis, setCampeonatosDisponiveis] = useState<Campeonato[]>([]);
  const [loadingCampeonatos, setLoadingCampeonatos] = useState(false);
  const [selectedCampeonato, setSelectedCampeonato] = useState<Campeonato | null>(null);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaCampeonato | null>(null);
  const [numeroCamisola, setNumeroCamisola] = useState('');
  const [inscrevendo, setInscrevendo] = useState(false);

  const inscricaoAtiva = getInscricaoAtiva(profile?.inscricoes ?? dashboard?.ultimasInscricoes);

  useEffect(() => {
    fetchDashboard();
    campeonatoService.getActive({ limit: 10 }).then((res) => setProximos(res.data)).catch(() => setProximos([]));
  }, [fetchDashboard]);

  const handleAbrirModal = async () => {
    setShowModal(true);
    setSelectedCampeonato(null);
    setSelectedCategoria(null);
    setNumeroCamisola('');
    if (!inscricaoAtiva) return;
    setLoadingCampeonatos(true);
    try {
      const res = await campeonatoService.getByFederacao(inscricaoAtiva.federacaoId, { limit: 50 });
      setCampeonatosDisponiveis(res.data.filter((c) => c.status === 'INSCRICOES_ABERTAS'));
    } catch {
      toast.error('Erro ao carregar campeonatos');
    } finally {
      setLoadingCampeonatos(false);
    }
  };

  const handleInscrever = async () => {
    if (!selectedCampeonato || !selectedCategoria || !inscricaoAtiva) return;
    setInscrevendo(true);
    try {
      await campeonatoService.inscreverAtleta(selectedCampeonato.id, {
        inscricaoId: inscricaoAtiva.id,
        categoriaId: selectedCategoria.id,
        numeroCamisola: numeroCamisola ? parseInt(numeroCamisola, 10) : undefined,
      });
      toast.success('Inscrição no campeonato realizada com sucesso!');
      setShowModal(false);
      fetchDashboard();
    } catch {
      toast.error('Erro ao inscrever no campeonato');
    } finally {
      setInscrevendo(false);
    }
  };

  const historico = dashboard?.ultimasCompeticoes ?? [];
  const metricas = dashboard?.metricas;

  const historicoFiltrado = historico.filter((item) => {
    const modalidade = item.campeonato?.modalidade?.toLowerCase() ?? '';
    if (filtro === 'nacional') return modalidade.includes('nacional') || item.campeonato?.nome?.toLowerCase().includes('nacional');
    if (filtro === 'regional') return modalidade.includes('regional') || modalidade.includes('provincial');
    return true;
  });

  if (isLoading && !dashboard) {
    return <SportLoadingScreen message="A carregar competições..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-6">
      <SEO title="Competições" description="Minhas competições e campeonatos." />

      {inscricaoAtiva && (
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Inscrição activa em</p>
              <p className="text-base font-bold text-[var(--text-primary)]">{inscricaoAtiva.federacao?.nome}</p>
            </div>
            <button
              onClick={handleAbrirModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Inscrever em Campeonato
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{proximos.length}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Próximas competições</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Trophy className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{metricas?.totalCompeticoes ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Total participações</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Star className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{metricas?.inscricoesAtivas ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Inscrições activas</p>
        </div>
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <Medal className="w-4 h-4 text-white mb-3" />
          <p className="text-3xl font-bold text-white">{metricas?.rankingGeral ? `#${metricas.rankingGeral}` : '—'}</p>
          <p className="text-xs text-white/70 mt-1">Posição no ranking</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Próximas Competições</h3>
        </div>
        <div className="divide-y divide-[var(--card-border)]">
          {proximos.length === 0 ? (
            <p className="px-5 py-10 text-sm text-[var(--text-muted)] text-center">Nenhuma competição activa disponível.</p>
          ) : (
            proximos.map((comp) => (
              <div key={comp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="w-10 h-10 bg-[#E60000]/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{comp.nome}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDatePt(comp.dataInicio)}- {formatDatePt(comp.dataFim)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {comp.modalidade} • {comp.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#2a2a2a]">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['todas', 'nacional', 'regional'] as FiltroHistorico[]).map((item) => (
          <button
            key={item}
            onClick={() => setFiltro(item)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
              filtro === item
                ? 'bg-[#E60000] text-white'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Histórico de Participações</h3>
        </div>
        <div className="divide-y divide-[var(--card-border)]">
          {historicoFiltrado.length === 0 ? (
            <p className="px-5 py-12 text-sm text-[var(--text-muted)] text-center">Nenhuma participação registada.</p>
          ) : (
            historicoFiltrado.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.campeonato?.nome ?? 'Competição'}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {item.campeonato?.modalidade} • {item.categoria?.nome ?? 'Categoria'} • {item.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#22C55E]">{item.pontos} pts</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.vitorias}V / {item.derrotas}D / {item.empates}E</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[var(--card-bg)] z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {selectedCampeonato ? 'Escolher Categoria' : 'Inscrever em Campeonato'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {!selectedCampeonato ? (
                loadingCampeonatos ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#E60000]" />
                  </div>
                ) : campeonatosDisponiveis.length === 0 ? (
                  <p className="text-center py-12 text-sm text-[var(--text-muted)]">
                    Nenhum campeonato com inscrições abertas disponível.
                  </p>
              ) : (
                <div className="space-y-3">
                    {campeonatosDisponiveis.map((campeonato) => (
                      <button
                        key={campeonato.id}
                        onClick={async () => {
                          setLoadingCategorias(true);
                          try {
                            const detalhe = await campeonatoService.getById(campeonato.id);
                            setSelectedCampeonato(detalhe);
                            setSelectedCategoria(null);
                            setNumeroCamisola('');
                          } catch {
                            toast.error('Erro ao carregar detalhes do campeonato');
                          } finally {
                            setLoadingCategorias(false);
                          }
                        }}
                        className="w-full bg-[var(--hover-bg)] rounded-xl p-4 text-left hover:bg-[var(--card-border)] transition"
                      >
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{campeonato.nome}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {campeonato.modalidade} • {campeonato.formato} • {formatDatePt(campeonato.dataInicio)}
                        </p>
                      </button>
                    ))}
                  </div>
                )
              ) : loadingCategorias ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E60000]" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[var(--hover-bg)] rounded-xl p-3">
                    <p className="text-xs text-[var(--text-muted)]">Campeonato</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedCampeonato.nome}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Categoria</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCampeonato.categorias?.map((cat) => {
                        const selected = selectedCategoria?.id === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoria(cat)}
                            className={`p-3 rounded-xl text-sm border text-left transition ${
                              selected
                                ? 'border-[#E60000] bg-[#E60000]/10 text-[var(--text-primary)]'
                                : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[#E60000]/50'
                            }`}
                          >
                            <p className="font-medium">{cat.nome}</p>
                            {cat.genero && (
                              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 capitalize">{cat.genero === "MASCULINO" ? "Masculino" : "Feminino"}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Nº Camisola (opcional)</p>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={numeroCamisola}
                        onChange={(e) => setNumeroCamisola(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        placeholder="Ex: 10"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setSelectedCampeonato(null); setSelectedCategoria(null); setNumeroCamisola(''); }}
                      className="flex-1 py-2.5 border border-[var(--card-border)] rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleInscrever}
                      disabled={!selectedCategoria || inscrevendo}
                      className="flex-1 py-2.5 bg-[#E60000] hover:bg-[#cc0000] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {inscrevendo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeusCampeonatos;
