import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { BracketDto } from '../../../core/types/bracket.types';
import { computeStandings, getParticipant } from '../../utils/bracket.utils';

interface BracketStandingsProps {
  bracket: BracketDto;
  grupo?: string;
}

const BracketStandings: React.FC<BracketStandingsProps> = ({ bracket, grupo }) => {
  const standings = useMemo(() => {
    const matches = grupo
      ? bracket.state.matches.filter((m) => m.group === grupo)
      : bracket.state.matches;
    const rows = computeStandings(matches);
    const names = new Map<string, string>();
    for (const row of rows) {
      const p = getParticipant(bracket.participantes, row.participanteId);
      names.set(row.participanteId, p?.nome ?? 'Desconhecido');
    }
    return rows.map((row) => ({ ...row, nome: names.get(row.participanteId) ?? 'Desconhecido' }));
  }, [bracket, grupo]);

  if (standings.length === 0) {
    return (
      <div className="py-12 text-center text-white/30 text-sm">Sem resultados disponíveis</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">#</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Atleta / Equipa</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">J</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">V</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">E</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">D</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">GP</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">GC</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">DG</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => (
            <tr
              key={row.participanteId}
              className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                idx === 0 ? 'bg-brand/[0.04]' : ''
              }`}
            >
              <td className="py-3 px-4 text-xs font-bold text-white/40">
                {idx === 0 ? <Trophy className="w-4 h-4 text-brand" /> : idx + 1}
              </td>
              <td className="py-3 px-4">
                <span className={`text-sm font-bold ${idx === 0 ? 'text-brand' : 'text-white/80'}`}>
                  {row.nome}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-xs text-white/50">{row.jogos}</td>
              <td className="py-3 px-4 text-center text-xs text-emerald-400 font-bold">{row.vitorias}</td>
              <td className="py-3 px-4 text-center text-xs text-amber-400 font-bold">{row.empates}</td>
              <td className="py-3 px-4 text-center text-xs text-red-400 font-bold">{row.derrotas}</td>
              <td className="py-3 px-4 text-center text-xs text-white/50">{row.golsPro}</td>
              <td className="py-3 px-4 text-center text-xs text-white/50">{row.golsContra}</td>
              <td className="py-3 px-4 text-center text-xs text-white/40">
                {row.saldoGols > 0 ? `+${row.saldoGols}` : row.saldoGols}
              </td>
              <td className="py-3 px-4 text-center text-sm font-black text-white">{row.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BracketStandings;
