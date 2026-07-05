import React, { useEffect, useState } from 'react';
import { CheckCheck, Info, Bell, CreditCard, FileText, Calendar, Trophy } from 'lucide-react';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import { formatDatePt } from '@/presentation/utils/atleta.utils';

type FiltroNotificacao = 'todas' | 'nao_lidas' | 'competicoes' | 'pagamentos' | 'documentos';

const filtros: { id: FiltroNotificacao; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'nao_lidas', label: 'Não lidas' },
  { id: 'competicoes', label: 'Competições' },
  { id: 'pagamentos', label: 'Pagamentos' },
  { id: 'documentos', label: 'Documentos' },
];

function getNotificacaoIcon(titulo: string) {
  const t = titulo.toLowerCase();
  if (t.includes('pagamento')) return { Icon: CreditCard, bg: 'bg-yellow-500/10', color: 'text-yellow-400' };
  if (t.includes('documento')) return { Icon: FileText, bg: 'bg-blue-500/10', color: 'text-blue-400' };
  if (t.includes('competi') || t.includes('campeonato')) return { Icon: Calendar, bg: 'bg-[#E60000]/10', color: 'text-[#E60000]' };
  if (t.includes('ranking')) return { Icon: Trophy, bg: 'bg-[#E60000]/10', color: 'text-[#E60000]' };
  return { Icon: Bell, bg: 'bg-gray-500/10', color: 'text-gray-400' };
}

function matchFiltro(titulo: string, mensagem: string, filtro: FiltroNotificacao): boolean {
  const text = `${titulo} ${mensagem}`.toLowerCase();
  if (filtro === 'competicoes') return text.includes('competi') || text.includes('campeonato');
  if (filtro === 'pagamentos') return text.includes('pagamento');
  if (filtro === 'documentos') return text.includes('documento');
  return true;
}

const Notificacoes: React.FC = () => {
  const {
    notificacoes,
    notificacoesNaoLidas,
    isLoading,
    fetchNotificacoes,
    marcarNotificacaoLida,
    marcarTodasLidas,
  } = useAtletaMeStore();
  const [filtro, setFiltro] = useState<FiltroNotificacao>('todas');

  useEffect(() => {
    fetchNotificacoes(filtro === 'nao_lidas');
  }, [fetchNotificacoes, filtro]);

  const notificacoesFiltradas = notificacoes.filter((n) => {
    if (filtro === 'nao_lidas') return !n.lida;
    if (['competicoes', 'pagamentos', 'documentos'].includes(filtro)) {
      return matchFiltro(n.titulo, n.mensagem, filtro);
    }
    return true;
  });

  if (isLoading && notificacoes.length === 0) {
    return <SportLoadingScreen message="A carregar notificações..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filtros.map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltro(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filtro === item.id
                ? 'bg-[#E60000] text-white'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {notificacoesNaoLidas > 0 && (
          <button
            onClick={marcarTodasLidas}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        {notificacoesNaoLidas > 0 && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--card-border)]">
            <p className="text-sm text-[var(--text-secondary)]">{notificacoesNaoLidas} notificações não lidas</p>
            <span className="w-2 h-2 bg-[#E60000] rounded-full" />
          </div>
        )}

        <div className="divide-y divide-[var(--card-border)]">
          {notificacoesFiltradas.map((notificacao) => {
            const { Icon, bg, color } = getNotificacaoIcon(notificacao.titulo);
            return (
              <div
                key={notificacao.id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-[var(--hover-bg)] ${!notificacao.lida ? '' : 'opacity-80'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className={`text-sm ${!notificacao.lida ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {notificacao.titulo}
                      </h4>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{notificacao.mensagem}</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] shrink-0">{formatDatePt(notificacao.createdAt)}</span>
                  </div>
                  {!notificacao.lida && (
                    <button
                      onClick={() => marcarNotificacaoLida(notificacao.id)}
                      className="mt-2 text-xs text-[#E60000] hover:text-[#ff3333] font-medium"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {notificacoesFiltradas.length === 0 && (
          <div className="px-5 py-16 text-center">
            <Info className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Nenhuma notificação encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
