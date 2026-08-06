import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Globe,
  Hash,
  Loader2,
  MapPin,
  Shield,
  Users,
  AlertCircle,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { federacaoService } from '@/infrastructure/services/federacao.service';
import { planoService } from '@/infrastructure/services/plano.service';
import type { Federacao, Plano } from '@/core/types/api.types';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import {
  formatDatePt,
  getInscricaoAtiva,
  getStatusInscricaoLabel,
} from '@/presentation/utils/atleta.utils';
import { SEO } from '../../components/seo/seo';

type Step = 'choose-federacao' | 'choose-plano' | 'confirm';

const Inscricoes: React.FC = () => {
  const { profile, isLoading, isSaving, fetchMe, inscreverAtletaFederacao } = useAtletaMeStore();
  const [federacoes, setFederacoes] = useState<Federacao[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingFederacoes, setLoadingFederacoes] = useState(false);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [selectedFederacao, setSelectedFederacao] = useState<Federacao | null>(null);
  const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null);
  const [step, setStep] = useState<Step>('choose-federacao');

  useEffect(() => {
    if (!profile) fetchMe();
  }, [profile, fetchMe]);

  const inscricao = getInscricaoAtiva(profile?.inscricoes);

  const loadFederacoes = useCallback(async () => {
    setLoadingFederacoes(true);
    try {
      const res = await federacaoService.getAll({ limit: 50 });
      setFederacoes(res.data);
    } catch {
      toast.error('Erro ao carregar federações');
    } finally {
      setLoadingFederacoes(false);
    }
  }, []);

  useEffect(() => {
    if (!inscricao && federacoes.length === 0) {
      loadFederacoes();
    }
  }, [inscricao, federacoes.length, loadFederacoes]);

  const handleSelectFederacao = async (federacao: Federacao) => {
    setSelectedFederacao(federacao);
    setSelectedPlano(null);
    setLoadingPlanos(true);
    try {
      const res = await planoService.getAll({ ativo: true, limit: 50 });
      setPlanos(res.data.filter((p) => p.tipo === 'ATLETA'));
      setStep('choose-plano');
    } catch {
      toast.error('Erro ao carregar planos');
    } finally {
      setLoadingPlanos(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFederacao || !selectedPlano || !profile) return;
    try {
      await inscreverAtletaFederacao({
        atletaId: profile.id,
        federacaoId: selectedFederacao.id,
        planoId: selectedPlano.id,
      });
      toast.success('Inscrição realizada com sucesso!');
      await fetchMe();
      setStep('choose-federacao');
      setSelectedFederacao(null);
      setSelectedPlano(null);
    } catch {
      toast.error('Erro ao realizar inscrição');
    }
  };

  if (isLoading && !profile) {
    return <SportLoadingScreen message="A carregar..." fullscreen={false} size="md" />;
  }

  if (inscricao) {
    return (
      <div className="space-y-6">
        <SEO title="Minha Inscrição" description="Gerir inscrição como atleta." />
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 lg:p-6 border border-[var(--card-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Inscrição Activa</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {getStatusInscricaoLabel(inscricao.status)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--hover-bg)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Federação</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {inscricao.federacao?.nome ?? '—'}
              </p>
            </div>
            <div className="bg-[var(--hover-bg)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Plano</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {inscricao.plano?.nome ?? '—'}
              </p>
            </div>
            <div className="bg-[var(--hover-bg)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Nº Registo</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {inscricao.numeroRegistro ?? '—'}
              </p>
            </div>
            <div className="bg-[var(--hover-bg)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Clube</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {inscricao.clube?.nome ?? '—'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--card-border)]">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Início: {formatDatePt(inscricao.dataInicio)}</p>
              <p className="text-xs text-[var(--text-muted)]">
                Expira: {formatDatePt(inscricao.dataFim)}
              </p>
            </div>
            <Link
              to="/pagamentos"
              className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
            >
              Renovar / Pagar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'choose-federacao') {
    return (
      <div className="space-y-6">
        <SEO title="Inscrever-se" description="Inscreva-se numa federação desportiva." />
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Escolher Federação</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Selecione a federação em que deseja inscrever-se como atleta.
          </p>
        </div>

        {loadingFederacoes ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E60000]" />
          </div>
        ) : federacoes.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)]">
            <Building2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)]">Nenhuma federação disponível.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {federacoes.map((fed) => (
              <button
                key={fed.id}
                onClick={() => handleSelectFederacao(fed)}
                className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)] hover:border-[#E60000]/50 text-left transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E60000]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {fed.logoUrl ? (
                      <img src={fed.logoUrl} alt={fed.nome} className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-6 h-6 text-[#E60000]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#E60000] transition">
                      {fed.nome}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {fed.provincia ?? fed.endereco ?? 'Angola'}
                    </p>
                    {fed.modalidades && fed.modalidades.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {fed.modalidades.slice(0, 3).map((m) => (
                          <span
                            key={m}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--hover-bg)] text-[var(--text-muted)]"
                          >
                            {m}
                          </span>
                        ))}
                        {fed.modalidades.length > 3 && (
                          <span className="text-[10px] text-[var(--text-muted)]">
                            +{fed.modalidades.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[#E60000] transition shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 'choose-plano') {
    return (
      <div className="space-y-6">
        <SEO title="Escolher Plano" description="Escolha o plano de inscrição." />
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setStep('choose-federacao'); setSelectedFederacao(null); setPlanos([]); }}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Escolher Plano</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Planos disponíveis para <strong>{selectedFederacao?.nome}</strong>
            </p>
          </div>
        </div>

        {loadingPlanos ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E60000]" />
          </div>
        ) : planos.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)]">
            <CreditCard className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)]">Nenhum plano disponível para esta federação.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planos.map((plano) => {
              const selected = selectedPlano?.id === plano.id;
              return (
                <button
                  key={plano.id}
                  onClick={() => setSelectedPlano(plano)}
                  className={`relative bg-[var(--card-bg)] rounded-2xl p-5 border text-left transition ${
                    selected
                      ? 'border-[#E60000] ring-1 ring-[#E60000]'
                      : 'border-[var(--card-border)] hover:border-[#E60000]/50'
                  }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#E60000] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <p className="text-base font-bold text-[var(--text-primary)]">{plano.nome}</p>
                  {plano.descricao && (
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{plano.descricao}</p>
                  )}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--text-primary)]">
                      {plano.preco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">{plano.moeda}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                    {plano.duracao}
                  </p>
                  {plano.beneficios && plano.beneficios.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {plano.beneficios.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedPlano && (
          <div className="flex justify-end pt-4 border-t border-[var(--card-border)]">
            <button
              onClick={() => setStep('confirm')}
              className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
            >
              Continuar para confirmação
            </button>
          </div>
        )}
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <SEO title="Confirmar Inscrição" description="Confirme a sua inscrição." />
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Confirmar Inscrição</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Revise os dados antes de confirmar.</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)] space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#E60000]/10 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#E60000]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Federação</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedFederacao?.nome}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#E60000]/10 rounded-xl flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-[#E60000]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Plano</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedPlano?.nome}</p>
              <p className="text-xs text-[var(--text-secondary)]">{selectedPlano?.descricao}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                {selectedPlano?.preco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} {selectedPlano?.moeda}
                <span className="text-xs text-[var(--text-muted)] font-normal"> /{selectedPlano?.duracao.toLowerCase()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-500">
            Ao confirmar, será criada uma inscrição que poderá exigir pagamento para activação.
            Verifique os documentos necessários na página <Link to="/documentos" className="underline font-medium">Documentos</Link>.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={() => setStep('choose-plano')}
            className="px-5 py-2.5 border border-[var(--card-border)] rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            Voltar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#E60000] hover:bg-[#cc0000] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Confirmar Inscrição
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Inscricoes;
