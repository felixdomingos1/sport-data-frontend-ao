import React, { useState } from 'react';
import {
  ShieldCheck,
  Trophy,
  CreditCard,
  FileText,
  TrendingUp,
  Info,
  Calendar,
  CheckCheck,
  LucideIcon,
} from 'lucide-react';

type CategoriaNotificacao = 'competicao' | 'pagamento' | 'documento' | 'ranking' | 'sistema';
type FiltroNotificacao = 'todas' | 'nao_lidas' | 'competicoes' | 'pagamentos' | 'documentos';

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaNotificacao;
  lida: boolean;
  timestamp: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const mockNotificacoes: Notificacao[] = [
  {
    id: '1',
    titulo: 'Documentos aprovados',
    descricao: 'A Federação Angolana de Basquetebol aprovou o seu Bilhete de Identidade e Foto 3x4.',
    categoria: 'documento',
    lida: false,
    timestamp: 'Hoje, 09:14',
    icon: ShieldCheck,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-[#22C55E]',
  },
  {
    id: '2',
    titulo: 'Nova competição disponível',
    descricao: 'As inscrições para a Copa Angola — Fase 1 estão abertas até 30 de Junho.',
    categoria: 'competicao',
    lida: false,
    timestamp: 'Hoje, 08:42',
    icon: Trophy,
    iconBg: 'bg-[#E60000]/10',
    iconColor: 'text-[#E60000]',
  },
  {
    id: '3',
    titulo: 'Pagamento confirmado',
    descricao: 'O pagamento de KZ 15.000 referente à Inscrição Anual foi confirmado com sucesso.',
    categoria: 'pagamento',
    lida: false,
    timestamp: 'Ontem, 15:22',
    icon: CreditCard,
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-[#F59E0B]',
  },
  {
    id: '4',
    titulo: 'Documento pendente',
    descricao: 'A Declaração do Clube ainda não foi enviada. Envie antes do prazo de 15 de Julho.',
    categoria: 'documento',
    lida: true,
    timestamp: 'Ontem, 11:05',
    icon: FileText,
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-[#F59E0B]',
  },
  {
    id: '5',
    titulo: 'Subiu no ranking',
    descricao: 'Parabéns! Subiu 4 posições no ranking nacional de Basquetebol Senior.',
    categoria: 'ranking',
    lida: true,
    timestamp: '08 Jun 2025',
    icon: TrendingUp,
    iconBg: 'bg-[#E60000]/10',
    iconColor: 'text-[#E60000]',
  },
  {
    id: '6',
    titulo: 'Actualização de regulamento',
    descricao: 'Novas regras de elegibilidade para competições nacionais entram em vigor em Setembro.',
    categoria: 'sistema',
    lida: true,
    timestamp: '05 Jun 2025',
    icon: Info,
    iconBg: 'bg-gray-500/10',
    iconColor: 'text-gray-400',
  },
  {
    id: '7',
    titulo: 'Competição a aproximar-se',
    descricao: 'A Liga Provincial de Luanda começa em 5 dias. Confirme a sua presença.',
    categoria: 'competicao',
    lida: true,
    timestamp: '01 Jun 2025',
    icon: Calendar,
    iconBg: 'bg-[#E60000]/10',
    iconColor: 'text-[#E60000]',
  },
];

const filtros: { id: FiltroNotificacao; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'nao_lidas', label: 'Não lidas' },
  { id: 'competicoes', label: 'Competições' },
  { id: 'pagamentos', label: 'Pagamentos' },
  { id: 'documentos', label: 'Documentos' },
];

const Notificacoes: React.FC = () => {
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes);
  const [filtro, setFiltro] = useState<FiltroNotificacao>('todas');

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const handleMarcarComoLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const handleMarcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const notificacoesFiltradas = notificacoes.filter((n) => {
    if (filtro === 'nao_lidas') return !n.lida;
    if (filtro === 'competicoes') return n.categoria === 'competicao';
    if (filtro === 'pagamentos') return n.categoria === 'pagamento';
    if (filtro === 'documentos') return n.categoria === 'documento';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filtros.map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltro(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filtro === item.id
                  ? 'bg-[#E60000] text-white'
                  : 'bg-[#0f0f0f] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-[#2a2a2a]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {naoLidas > 0 && (
          <button
            onClick={handleMarcarTodasComoLidas}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Notifications Card */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        {naoLidas > 0 && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a1a1a]">
            <p className="text-sm text-gray-400">
              {naoLidas} notificações não lidas
            </p>
            <span className="w-2 h-2 bg-[#E60000] rounded-full" />
          </div>
        )}

        <div className="divide-y divide-[#1a1a1a]">
          {notificacoesFiltradas.map((notificacao) => {
            const Icon = notificacao.icon;

            return (
              <div
                key={notificacao.id}
                className={`flex items-start gap-4 px-5 py-4 transition ${
                  !notificacao.lida ? 'bg-[#0f0f0f]' : 'bg-[#0f0f0f]/60 opacity-80'
                } hover:bg-[#141414]`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notificacao.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${notificacao.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!notificacao.lida && (
                          <span className="w-2 h-2 bg-[#E60000] rounded-full shrink-0" />
                        )}
                        <h4
                          className={`text-sm truncate ${
                            !notificacao.lida ? 'font-semibold text-white' : 'font-medium text-gray-300'
                          }`}
                        >
                          {notificacao.titulo}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {notificacao.descricao}
                      </p>
                    </div>

                    <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap pt-0.5">
                      {notificacao.timestamp}
                    </span>
                  </div>

                  {!notificacao.lida && (
                    <button
                      onClick={() => handleMarcarComoLida(notificacao.id)}
                      className="mt-2 text-xs text-[#E60000] hover:text-[#ff3333] font-medium transition"
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
            <Info className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">
              Nenhuma notificação encontrada para o filtro seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
