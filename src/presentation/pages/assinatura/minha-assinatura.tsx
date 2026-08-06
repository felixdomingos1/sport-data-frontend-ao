import React, { useEffect, useState } from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle, ShieldCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { assinaturaService, type Assinatura } from '@/infrastructure/services/assinatura.service';
import { planoService } from '@/infrastructure/services/plano.service';
import { invalidateSubscriptionCache } from '@/presentation/hooks/use-subscription-guard';
import type { Plano } from '@/core/types/api.types';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';

const STATUS_LABEL: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  ATIVA: 'Ativa',
  EXPIRADA: 'Expirada',
  CANCELADA: 'Cancelada',
};

function StatusBadge({ status }: { status: string }) {
  const active = status === 'ATIVA';
  const pending = status === 'AGUARDANDO_PAGAMENTO';
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
        active
          ? 'bg-green-500/10 text-[#22C55E] border-green-500/20'
          : pending
            ? 'bg-orange-500/10 text-[#F59E0B] border-orange-500/20'
            : 'bg-red-500/10 text-[#EF4444] border-red-500/20'
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatPreco(preco: string | number, moeda: string) {
  const n = typeof preco === 'string' ? parseFloat(preco) : preco;
  return `${n.toLocaleString('pt-AO', { maximumFractionDigits: 0 })} ${moeda}`;
}

function diasRestantes(dataFim?: string) {
  if (!dataFim) return 0;
  return Math.max(0, Math.ceil((new Date(dataFim).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

const MinhaAssinatura: React.FC = () => {
  const navigate = useNavigate();
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [ativa, setAtiva] = useState<Assinatura | null>(null);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selecionado, setSelecionado] = useState<Plano | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [sub, plans] = await Promise.all([
        assinaturaService.minhasAssinaturas(),
        planoService.getAll({ ativo: true, limit: 100 }),
      ]);
      setAssinaturas(sub.assinaturas ?? []);
      setAtiva(sub.ativa ?? null);
      setPlanos((plans.data ?? []).filter((p) => p.ativo));
    } catch {
      setAssinaturas([]);
      setAtiva(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assinar = async (plano: Plano) => {
    setSubmitting(true);
    setSelecionado(plano);
    try {
      const { assinatura } = await assinaturaService.assinar(plano.id);
      await assinaturaService.confirmarPagamento(assinatura.id, { metodo: 'BANCO' });
      toast.success('Assinatura ativada com sucesso!');
      invalidateSubscriptionCache();
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao assinar o plano');
    } finally {
      setSubmitting(false);
      setSelecionado(null);
    }
  };

  if (loading) return <SportLoadingScreen />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Minha Assinatura</h1>
          <p className="text-sm text-gray-500 dark:text-white/40">Gerencie o seu plano de acesso à plataforma</p>
        </div>
      </div>

      {ativa && (
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{ativa.plano?.nome ?? 'Plano'}</p>
                <p className="text-xs text-gray-500 dark:text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {diasRestantes(ativa.dataFim)} dias restantes · termina em{' '}
                  {new Date(ativa.dataFim).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
            <StatusBadge status={ativa.status} />
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (diasRestantes(ativa.dataFim) / 365) * 100)}%` }} />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-gray-600 dark:text-white/70 uppercase tracking-widest mb-4">Planos disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {planos.length === 0 ? (
            <p className="text-gray-400 dark:text-white/30 col-span-full py-8 text-center">Nenhum plano disponível.</p>
          ) : (
            planos.map((plano) => (
              <div
                key={plano.id}
                className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-5 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                    {plano.tipo}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                    {plano.duracao}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{plano.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-1">{plano.descricao}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{formatPreco(plano.preco, plano.moeda)}</span>
                </div>
                <ul className="flex-1 space-y-1.5">
                  {(plano.beneficios ?? []).map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => assinar(plano)}
                  disabled={submitting || !!ativa}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting && selecionado?.id === plano.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  {ativa ? 'Já possui plano ativo' : 'Assinar agora'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {assinaturas.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-600 dark:text-white/70 uppercase tracking-widest mb-4">Histórico</h2>
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-left">
                <tr className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/40">
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Fim</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {assinaturas.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100 dark:border-white/5 text-gray-600 dark:text-white/70">
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
                      {a.plano?.nome ?? '—'}
                    </td>
                    <td className="px-4 py-3">{new Date(a.dataInicio).toLocaleDateString('pt-PT')}</td>
                    <td className="px-4 py-3">{new Date(a.dataFim).toLocaleDateString('pt-PT')}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!ativa && assinaturas.some((a) => a.status === 'AGUARDANDO_PAGAMENTO') && (
        <p className="text-xs text-gray-500 dark:text-white/40 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Tens uma assinatura aguardando pagamento. Para testar, confirma o pagamento na simulação.
        </p>
      )}
    </div>
  );
};

export default MinhaAssinatura;