import React, { useEffect, useMemo } from 'react';
import { Wallet, Calendar, CheckCircle, Download, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import {
  formatDatePt,
  getInscricaoAtiva,
  getMetodoPagamentoLabel,
  getStatusPagamentoLabel,
} from '@/presentation/utils/atleta.utils';
import { SEO } from '../../components/seo/seo';

function StatusBadge({ status }: { status: string }) {
  const confirmed = status === 'CONFIRMADO';
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
        confirmed
          ? 'bg-green-500/10 text-[#22C55E] border-green-500/20'
          : 'bg-orange-500/10 text-[#F59E0B] border-orange-500/20'
      }`}
    >
      {getStatusPagamentoLabel(status)}
    </span>
  );
}

const Pagamentos: React.FC = () => {
  const { profile, pagamentos, isLoading, isSaving, fetchMe, fetchPagamentos, createPagamento } =
    useAtletaMeStore();

  useEffect(() => {
    const load = async () => {
      await fetchMe();
      const inscricao = getInscricaoAtiva(useAtletaMeStore.getState().profile?.inscricoes);
      if (inscricao?.id) await fetchPagamentos(inscricao.id);
    };
    load();
  }, [fetchMe, fetchPagamentos]);

  const inscricao = getInscricaoAtiva(profile?.inscricoes);
  const confirmados = pagamentos.filter((p) => p.status === 'CONFIRMADO');
  const totalPago = confirmados.reduce((sum, p) => sum + p.valor, 0);

  const diasRestantes = useMemo(() => {
    if (!inscricao?.dataFim) return 0;
    const diff = new Date(inscricao.dataFim).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [inscricao?.dataFim]);

  const progressoPlano = useMemo(() => {
    if (!inscricao?.dataInicio || !inscricao?.dataFim) return 0;
    const start = new Date(inscricao.dataInicio).getTime();
    const end = new Date(inscricao.dataFim).getTime();
    const now = Date.now();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
  }, [inscricao]);

  const handleRenovar = async () => {
    if (!inscricao?.id || !inscricao.plano?.preco) {
      toast.error('Inscrição ou plano não encontrado');
      return;
    }
    try {
      await createPagamento({
        inscricaoId: inscricao.id,
        metodo: 'MULTICAIXA',
        valor: inscricao.plano.preco,
        moeda: inscricao.plano.moeda ?? 'AOA',
      });
      toast.success('Pagamento iniciado com sucesso');
    } catch {
      toast.error('Erro ao iniciar pagamento');
    }
  };

  if (isLoading && pagamentos.length === 0) {
    return <SportLoadingScreen message="A carregar pagamentos..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-6">
      <SEO title="Pagamentos" description="Histórico de pagamentos e inscrições do atleta." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Wallet className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">
            {totalPago.toLocaleString('pt-PT')} {inscricao?.plano?.moeda ?? 'AOA'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Total pago confirmado</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">{formatDatePt(inscricao?.dataFim)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Próximo vencimento</p>
        </div>
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <CheckCircle className="w-4 h-4 text-white mb-3" />
          <p className="text-2xl lg:text-3xl font-bold text-white">{confirmados.length}</p>
          <p className="text-xs text-white/70 mt-1">pagamentos confirmados</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Plano Activo</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
            <div>
              <h4 className="text-lg font-bold text-[var(--text-primary)]">{inscricao?.plano?.nome ?? 'Sem plano'}</h4>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {inscricao?.federacao?.nome} • Válido até {formatDatePt(inscricao?.dataFim)}
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {(inscricao?.plano?.preco ?? 0).toLocaleString('pt-PT')} {inscricao?.plano?.moeda ?? 'AOA'}
              </p>
              <button
                onClick={handleRenovar}
                disabled={isSaving}
                className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
              >
                {isSaving ? 'A processar...' : 'Renovar Agora'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[#E60000] rounded-full" style={{ width: `${progressoPlano}%` }} />
            </div>
            <span className="text-xs text-[var(--text-muted)] shrink-0">{diasRestantes} dias restantes</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)] flex justify-between items-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Histórico de Pagamentos</h3>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[var(--hover-border)] text-[var(--text-secondary)] rounded-xl text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {pagamentos.length === 0 ? (
          <p className="px-5 py-12 text-sm text-[var(--text-muted)] text-center">Nenhum pagamento registado.</p>
        ) : (
          <div className="divide-y divide-[var(--card-border)]">
            {pagamentos.map((pag) => (
              <div key={pag.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[var(--hover-bg)]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{inscricao?.plano?.nome ?? 'Pagamento'}</p>
                    <p className="text-xs text-[var(--text-muted)]">{getMetodoPagamentoLabel(pag.metodo)} • {formatDatePt(pag.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-11 sm:pl-0">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {pag.valor.toLocaleString('pt-PT')} {pag.moeda}
                  </span>
                  <StatusBadge status={pag.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagamentos;
