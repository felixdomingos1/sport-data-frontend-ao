import React from 'react';
import {
  Wallet,
  Calendar,
  CheckCircle,
  Download,
  Receipt,
} from 'lucide-react';

interface Pagamento {
  id: number;
  descricao: string;
  data: string;
  referencia: string;
  valor: string;
  estado: 'APROVADO' | 'PENDENTE';
}

const historicoPagamentos: Pagamento[] = [
  {
    id: 1,
    descricao: 'Inscrição Anual - Basquetebol',
    data: '12 Jan 2026',
    referencia: '#PAY-0048231',
    valor: 'KZ 15.000',
    estado: 'APROVADO',
  },
  {
    id: 2,
    descricao: 'Participação - Campeonato Nacional',
    data: '05 Abr 2026',
    referencia: '#PAY-0049102',
    valor: 'KZ 3.500',
    estado: 'APROVADO',
  },
  {
    id: 3,
    descricao: 'Participação - Copa Angola Sub-23',
    data: '17 Jan 2026',
    referencia: '#PAY-0048750',
    valor: 'KZ 2.000',
    estado: 'APROVADO',
  },
  {
    id: 4,
    descricao: 'Renovação Semestral',
    data: 'Pendente',
    referencia: '#PAY-0050033',
    valor: 'KZ 8.500',
    estado: 'PENDENTE',
  },
];

function StatusBadge({ estado }: { estado: 'APROVADO' | 'PENDENTE' }) {
  if (estado === 'APROVADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
        Aprovado
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-[#F59E0B] border border-orange-500/20 uppercase tracking-wide">
      Pendente
    </span>
  );
}

const Pagamentos: React.FC = () => {
  const diasRestantes = 154;
  const progressoPlano = 58;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Total Pago
            </p>
            <Wallet className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-white">KZ 20.500</p>
          <p className="text-xs text-gray-500 mt-1">em 2025-2026</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Próximo Vencimento
            </p>
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-white">31 Dez 2026</p>
          <p className="text-xs text-gray-500 mt-1">Plano Anual</p>
        </div>

        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">
              Pagamentos
            </p>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-white">3</p>
          <p className="text-xs text-white/70 mt-1">confirmados</p>
        </div>
      </div>

      {/* Plano Activo */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white">Plano Activo</h3>
        </div>

        <div className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h4 className="text-lg font-bold text-white">Plano Anual</h4>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
                  Ativo
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Federação Angolana de Basquetebol • Válido até 31 Dezembro 2026
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <p className="text-xl font-bold text-white">KZ 15.000 / ano</p>
              <button className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition">
                Renovar Agora
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E60000] rounded-full transition-all"
                style={{ width: `${progressoPlano}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
              {diasRestantes} dias restantes
            </span>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white">Histórico de Pagamentos</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#3a3a3a] text-gray-400 hover:text-white hover:border-gray-500 rounded-xl text-sm font-medium transition">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Referência
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {historicoPagamentos.map((pag) => (
                <tr key={pag.id} className="hover:bg-[#141414] transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-white">{pag.descricao}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{pag.data}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 font-mono">{pag.referencia}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{pag.valor}</td>
                  <td className="px-5 py-4">
                    <StatusBadge estado={pag.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden divide-y divide-[#1a1a1a]">
          {historicoPagamentos.map((pag) => (
            <div key={pag.id} className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{pag.descricao}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{pag.referencia}</p>
                </div>
                <StatusBadge estado={pag.estado} />
              </div>
              <div className="flex items-center justify-between pl-11">
                <span className="text-xs text-gray-500">{pag.data}</span>
                <span className="text-sm font-semibold text-white">{pag.valor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagamentos;
