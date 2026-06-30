import React, { useState } from 'react';
import {
  Calendar,
  Trophy,
  Star,
  Medal,
  MapPin,
  Eye,
  ChevronDown,
} from 'lucide-react';

type TipoCompeticao = 'Nacional' | 'Regional' | 'Internacional';

interface ProximaCompeticao {
  id: number;
  nome: string;
  data: string;
  local: string;
  tipo: TipoCompeticao;
}

interface HistoricoParticipacao {
  id: number;
  nome: string;
  modalidade: string;
  tipo: TipoCompeticao;
  periodo: string;
  fase: string;
  resultado: string;
  pontos: string;
}

const proximasCompeticoes: ProximaCompeticao[] = [
  {
    id: 1,
    nome: 'Copa Angola — Fase 1',
    data: '22 Mai 2026',
    local: 'Pavilhão FMA, Luanda',
    tipo: 'Nacional',
  },
  {
    id: 2,
    nome: 'Liga Provincial de Luanda',
    data: '05 Jun 2026',
    local: 'Pavilhão da Cidadela',
    tipo: 'Regional',
  },
  {
    id: 3,
    nome: 'Torneio CABL — Pré-eliminar',
    data: '18 Jul 2026',
    local: 'Kinshasa, RDC',
    tipo: 'Internacional',
  },
];

const historicoParticipacoes: HistoricoParticipacao[] = [
  {
    id: 1,
    nome: 'Campeonato Nacional de Basquetebol',
    modalidade: 'Basquetebol',
    tipo: 'Nacional',
    periodo: 'Jan — Jun 2026',
    fase: 'Fase de Grupos',
    resultado: '3º Lugar',
    pontos: '+50',
  },
  {
    id: 2,
    nome: 'Liga Regional de Luanda',
    modalidade: 'Basquetebol',
    tipo: 'Regional',
    periodo: 'Out — Dez 2025',
    fase: 'Encerrado',
    resultado: '1º Lugar',
    pontos: '+120',
  },
  {
    id: 3,
    nome: 'Taça de Angola',
    modalidade: 'Basquetebol',
    tipo: 'Nacional',
    periodo: 'Mar — Mai 2025',
    fase: 'Encerrado',
    resultado: '2º Lugar',
    pontos: '+85',
  },
  {
    id: 4,
    nome: 'Campeonato Provincial de Luanda',
    modalidade: 'Basquetebol',
    tipo: 'Regional',
    periodo: 'Set — Nov 2025',
    fase: 'Encerrado',
    resultado: '1º Lugar',
    pontos: '+95',
  },
  {
    id: 5,
    nome: 'Super Taça de Basquetebol',
    modalidade: 'Basquetebol',
    tipo: 'Nacional',
    periodo: 'Fev 2025',
    fase: 'Encerrado',
    resultado: '4º Lugar',
    pontos: '+40',
  },
];

function TipoBadge({ tipo }: { tipo: TipoCompeticao }) {
  if (tipo === 'Nacional') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E60000]/10 text-[#E60000] border border-[#E60000]/20 uppercase">
        Nacional
      </span>
    );
  }
  if (tipo === 'Internacional') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 text-[#F59E0B] border border-yellow-500/20 uppercase">
        Internacional
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 uppercase">
      Regional
    </span>
  );
}

const MeusCampeonatos: React.FC = () => {
  const [modalidade, setModalidade] = useState('Todas as modalidades');
  const [epoca, setEpoca] = useState('2025-2026');

  const historicoFiltrado = historicoParticipacoes.filter((item) => {
    if (modalidade !== 'Todas as modalidades' && item.modalidade !== modalidade) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Total de Participações
            </p>
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">14</p>
          <p className="text-xs text-gray-500 mt-1">em 2025-2026</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Vitórias / 1º Lugar
            </p>
            <Trophy className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">5</p>
          <p className="text-xs text-gray-500 mt-1">35% das participações</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Pontos Acumulados
            </p>
            <Star className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">1.480</p>
          <p className="text-xs text-gray-500 mt-1">em competições</p>
        </div>

        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">
              Melhor Resultado
            </p>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Medal className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">1º</p>
          <p className="text-xs text-white/70 mt-1">Liga Regional de Luanda</p>
        </div>
      </div>

      {/* Próximas Competições */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white">Próximas Competições</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E60000] text-white">
            {proximasCompeticoes.length}
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {proximasCompeticoes.map((comp) => (
            <div
              key={comp.id}
              className="bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#E60000]/30 transition"
            >
              <TipoBadge tipo={comp.tipo} />
              <h4 className="text-sm font-semibold text-white mt-3 mb-2">{comp.nome}</h4>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {comp.data}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {comp.local}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Participações */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white">Histórico de Participações</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 cursor-pointer"
              >
                <option value="Todas as modalidades">Todas as modalidades</option>
                <option value="Basquetebol">Basquetebol</option>
                <option value="Futebol">Futebol</option>
                <option value="Voleibol">Voleibol</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={epoca}
                onChange={(e) => setEpoca(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 cursor-pointer"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Competição
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Fase
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {historicoFiltrado.map((item) => (
                <tr key={item.id} className="hover:bg-[#141414] transition">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{item.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.modalidade}</p>
                  </td>
                  <td className="px-5 py-4">
                    <TipoBadge tipo={item.tipo} />
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{item.periodo}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{item.fase}</td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{item.resultado}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#22C55E]">{item.pontos}</td>
                  <td className="px-5 py-4">
                    <button
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="lg:hidden divide-y divide-[#1a1a1a]">
          {historicoFiltrado.map((item) => (
            <div key={item.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{item.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.modalidade}</p>
                </div>
                <TipoBadge tipo={item.tipo} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-600 uppercase tracking-wide">Período</p>
                  <p className="text-gray-400 mt-0.5">{item.periodo}</p>
                </div>
                <div>
                  <p className="text-gray-600 uppercase tracking-wide">Fase</p>
                  <p className="text-gray-400 mt-0.5">{item.fase}</p>
                </div>
                <div>
                  <p className="text-gray-600 uppercase tracking-wide">Resultado</p>
                  <p className="text-white font-medium mt-0.5">{item.resultado}</p>
                </div>
                <div>
                  <p className="text-gray-600 uppercase tracking-wide">Pontos</p>
                  <p className="text-[#22C55E] font-semibold mt-0.5">{item.pontos}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition">
                <Eye className="w-3.5 h-3.5" />
                Ver detalhes
              </button>
            </div>
          ))}
        </div>

        {historicoFiltrado.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">Nenhuma participação encontrada para os filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusCampeonatos;
