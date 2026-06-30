import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Star,
  Calendar,
  Hash,
  Building2,
  Users,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const historicoCompeticoes = [
  {
    id: 1,
    nome: 'Campeonato Nacional de Basquetebol',
    data: '15 Jun 2026',
    posicao: '1º Lugar',
    pontos: '+120',
  },
  {
    id: 2,
    nome: 'Taça de Angola',
    data: '28 Mai 2026',
    posicao: '2º Lugar',
    pontos: '+85',
  },
  {
    id: 3,
    nome: 'Liga Provincial de Luanda',
    data: '10 Mai 2026',
    posicao: '1º Lugar',
    pontos: '+95',
  },
];

const documentos = [
  { id: 1, nome: 'Foto 3x4', status: 'APROVADO' as const },
  { id: 2, nome: 'Bilhete de Identidade', status: 'APROVADO' as const },
  { id: 3, nome: 'Declaração do Clube', status: 'PENDENTE' as const },
];

const rankingBasquetebol = [
  { posicao: 1, nome: 'Miguel Santos', pontos: 1820 },
  { posicao: 2, nome: 'Armando Lopes', pontos: 1710 },
  { posicao: 7, nome: 'João Mateus', pontos: 1480, isCurrentUser: true },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'AT';
}

function StatusBadge({ status }: { status: 'APROVADO' | 'PENDENTE' }) {
  if (status === 'APROVADO') {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-500/10 text-[#22C55E] border border-green-500/20">
        APROVADO
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-[#F59E0B] border border-orange-500/20">
      PENDENTE
    </span>
  );
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const displayName = user?.nome || 'João Mateus';
  const athleteId = 'ANG-2024-00482';

  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-[#0f0f0f] rounded-2xl p-5 lg:p-6 border border-[#1a1a1a]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#E60000] to-[#990000] flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[#E60000]/30">
            <span className="text-white text-xl font-bold">{getInitials(displayName)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-lg lg:text-xl font-bold text-white">{displayName}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20">
                ATIVO
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-gray-500" />
                {athleteId}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-500" />
                Federação Angolana de Basquetebol
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                Petro de Luanda
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <p className="text-xs text-gray-500">Plano Anual</p>
            <p className="text-sm font-semibold text-white">Expira: 31 Dez 2026</p>
            <button className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition">
              Renovar
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Ranking Nacional
            </p>
            <Trophy className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">#7</p>
          <p className="text-xs text-gray-500 mt-1">Basquetebol / Senior</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Pontuação Total
            </p>
            <Star className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">1.480</p>
          <p className="text-xs text-gray-500 mt-1">+120 na última competição</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Competições
            </p>
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">14</p>
          <p className="text-xs text-gray-500 mt-1">em 2025-2026</p>
        </div>

        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">
              Vitórias
            </p>
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">9</p>
          <p className="text-xs text-white/70 mt-1">64% de taxa de vitória</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Competition History */}
        <div className="xl:col-span-2 bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h3 className="text-base font-semibold text-white">Histórico de Competições</h3>
            <Link
              to="/meus-campeonatos"
              className="text-sm text-[#E60000] hover:text-[#ff1a1a] font-medium transition"
            >
              Ver tudo
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {historicoCompeticoes.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#141414] transition"
              >
                <div className="w-9 h-9 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{comp.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{comp.data}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">{comp.posicao}</p>
                  <p className="text-sm font-semibold text-[#22C55E] mt-0.5">{comp.pontos}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Widgets */}
        <div className="space-y-4">
          {/* Documentos */}
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h3 className="text-base font-semibold text-white">Documentos</h3>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <span className="text-sm text-gray-300">{doc.nome}</span>
                  <StatusBadge status={doc.status} />
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#1a1a1a]">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#3a3a3a] rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-500 transition">
                <Upload className="w-4 h-4" />
                Enviar documento
              </button>
            </div>
          </div>

          {/* Ranking */}
          <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
                Ranking Basquetebol Senior
              </p>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {rankingBasquetebol.map((item) => (
                <div
                  key={item.posicao}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    item.isCurrentUser ? 'bg-[#E60000]/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold w-5 ${
                        item.isCurrentUser ? 'text-[#E60000]' : 'text-gray-500'
                      }`}
                    >
                      #{item.posicao}
                    </span>
                    <span
                      className={`text-sm ${
                        item.isCurrentUser ? 'font-bold text-white' : 'text-gray-300'
                      }`}
                    >
                      {item.nome}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      item.isCurrentUser ? 'font-bold text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.pontos.toLocaleString('pt-PT')}
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

export default Dashboard;
