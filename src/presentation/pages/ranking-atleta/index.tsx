import React, { useState } from 'react';
import {
  Trophy,
  Star,
  TrendingUp,
  Medal,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface RankingAthlete {
  posicao: number;
  nome: string;
  clube: string;
  pontos: number;
  isCurrentUser?: boolean;
}

const classificacaoGeral: RankingAthlete[] = [
  { posicao: 1, nome: 'Miguel Santos', clube: 'Petro de Luanda', pontos: 1820 },
  { posicao: 2, nome: 'Armando Lopes', clube: '1º de Agosto', pontos: 1710 },
  { posicao: 3, nome: 'Carlos Ferreira', clube: 'Interclube', pontos: 1650 },
  { posicao: 4, nome: 'Rui Mendes', clube: 'Recreativo do Libolo', pontos: 1590 },
  { posicao: 5, nome: 'Paulo Nunes', clube: 'ASA', pontos: 1540 },
  { posicao: 6, nome: 'António Silva', clube: 'Sporting Clube de Benguela', pontos: 1510 },
  { posicao: 7, nome: 'João Mateus', clube: 'Petro de Luanda', pontos: 1480, isCurrentUser: true },
  { posicao: 8, nome: 'Felipe Costa', clube: 'G.D. Sagrada Esperança', pontos: 1420 },
  { posicao: 9, nome: 'Manuel Dias', clube: 'Kabuscorp', pontos: 1380 },
  { posicao: 10, nome: 'Hélder Ramos', clube: 'Académica do Lobito', pontos: 1350 },
];

const composicaoPontuacao = [
  { label: 'Vitórias', valor: 900, max: 900, cor: 'bg-[#E60000]' },
  { label: 'Nível da Competição', valor: 380, max: 900, cor: 'bg-[#F59E0B]' },
  { label: 'Bónus de Assiduidade', valor: 120, max: 900, cor: 'bg-[#22C55E]' },
  { label: 'Desempate', valor: 80, max: 900, cor: 'bg-gray-500' },
];

const proximasCompeticoes = [
  {
    id: 1,
    nome: 'Copa Angola - Fase 1',
    data: '15 Jul 2026',
    nivel: 'Nacional',
  },
  {
    id: 2,
    nome: 'Liga Provincial de Luanda',
    data: '28 Jul 2026',
    nivel: 'Regional',
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'AT';
}

function Avatar({ name, highlighted }: { name: string; highlighted?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
        highlighted
          ? 'bg-white/20 text-white ring-2 ring-white/30'
          : 'bg-[#2a2a2a] text-gray-300'
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

const RankingAtleta: React.FC = () => {
  const { user } = useAuthStore();
  const displayName = user?.nome || 'João Mateus';

  const [modalidade, setModalidade] = useState('Basquetebol');
  const [categoria, setCategoria] = useState('Senior');

  const classificacao = classificacaoGeral.map((a) =>
    a.nome === displayName || a.isCurrentUser ? { ...a, isCurrentUser: true, nome: displayName } : a
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">
              Posição Actual
            </p>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">#7</p>
          <p className="text-xs text-white/70 mt-1">Basquetebol Senior</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Pontuação
            </p>
            <Star className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">1.480</p>
          <p className="text-xs text-[#22C55E] mt-1">+35 este mês</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Evolução
            </p>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">+4</p>
          <p className="text-xs text-gray-500 mt-1">posições desde Jan</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Melhor Posição
            </p>
            <Medal className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">#5</p>
          <p className="text-xs text-gray-500 mt-1">Novembro 2025</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Ranking Table */}
        <div className="xl:col-span-2 bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#1a1a1a]">
            <h3 className="text-base font-semibold text-white">
              Classificação Geral - Senior Masculino
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 cursor-pointer"
                >
                  <option value="Basquetebol">Basquetebol</option>
                  <option value="Futebol">Futebol</option>
                  <option value="Voleibol">Voleibol</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 cursor-pointer"
                >
                  <option value="Senior">Senior</option>
                  <option value="Sub-20">Sub-20</option>
                  <option value="Sub-17">Sub-17</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#1a1a1a]">
            {classificacao.map((atleta) => (
              <div
                key={atleta.posicao}
                className={`flex items-center gap-4 px-5 py-3.5 transition ${
                  atleta.isCurrentUser
                    ? 'bg-[#E60000]'
                    : 'hover:bg-[#141414]'
                }`}
              >
                <span
                  className={`text-sm font-bold w-6 shrink-0 ${
                    atleta.isCurrentUser ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  #{atleta.posicao}
                </span>

                <Avatar name={atleta.nome} highlighted={atleta.isCurrentUser} />

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      atleta.isCurrentUser ? 'text-white' : 'text-white'
                    }`}
                  >
                    {atleta.nome}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      atleta.isCurrentUser ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {atleta.clube}
                  </p>
                </div>

                <span
                  className={`text-sm font-bold shrink-0 ${
                    atleta.isCurrentUser ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {atleta.pontos.toLocaleString('pt-PT')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panels */}
        <div className="space-y-4">
          {/* Composição da Pontuação */}
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h3 className="text-base font-semibold text-white">Composição da Pontuação</h3>
            </div>
            <div className="p-5 space-y-4">
              {composicaoPontuacao.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-white">{item.valor}</span>
                  </div>
                  <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.cor}`}
                      style={{ width: `${(item.valor / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Total</span>
                <span className="text-2xl font-bold text-white">1.480</span>
              </div>
            </div>
          </div>

          {/* Próximas Competições */}
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h3 className="text-base font-semibold text-white">Próximas Competições</h3>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {proximasCompeticoes.map((comp) => (
                <div key={comp.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="w-9 h-9 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{comp.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{comp.data}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E60000]/10 text-[#E60000] border border-[#E60000]/20 uppercase shrink-0">
                    {comp.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingAtleta;
