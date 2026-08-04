import React, { useMemo } from 'react';

export interface Participante {
  id: string;
  nome?: string;
}

export interface PartidaInfo {
  placarA?: number;
  placarB?: number;
  status?: 'AGENDADA' | 'EM_ANDAMENTO' | 'INTERVALO' | 'FINALIZADA' | 'CANCELADA' | 'ADIADA';
}

export interface Confronto {
  id: string;
  rodada: number;
  ordemNaRodada: number;
  participanteA?: Participante;
  participanteB?: Participante;
  vencedorId?: string;
  partida?: PartidaInfo;
  isBye: boolean;
  isFinal?: boolean;
  bracket?: string;
}

export interface BracketTreeProps {
  confrontos: Confronto[];
  tipo: 'KNOCKOUT' | 'GRUPOS' | 'LIGA' | 'DOUBLE_ELIM';
}

const RODADA_LABELS: Record<number, string> = {
  1: '1ª Rodada',
  2: '2ª Rodada',
  3: 'Quartos',
  4: 'Semi-Final',
  5: 'Final',
};

function getRodadaLabel(rodada: number): string {
  if (RODADA_LABELS[rodada]) return RODADA_LABELS[rodada];
  return `${rodada}ª Rodada`;
}

function MatchCard({ confronto }: { confronto: Confronto }) {
  const a = confronto.participanteA;
  const b = confronto.participanteB;
  const placarA = confronto.partida?.placarA;
  const placarB = confronto.partida?.placarB;
  const status = confronto.partida?.status;
  const vencedorId = confronto.vencedorId;

  const isFinished = status === 'FINALIZADA';
  const isLive = status === 'EM_ANDAMENTO';

  const isWinnerA = vencedorId && a && vencedorId === a.id;
  const isWinnerB = vencedorId && b && vencedorId === b.id;
  const isLoserA = vencedorId && a && vencedorId !== a.id;
  const isLoserB = vencedorId && b && vencedorId !== b.id;

  function renderParticipant(
    participant: Participante | undefined,
    score: number | undefined,
    isWinner: boolean,
    isLoser: boolean,
    isTop: boolean
  ) {
    const isByeSlot = !participant;
    const name = participant?.nome ?? 'TBD';

    return (
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          isTop ? 'border-b border-white/5' : ''
        } ${isWinner ? 'bg-brand/5' : ''} transition-colors`}
      >
        <span
          className={`text-xs font-bold truncate ${
            isByeSlot
              ? 'text-white/20 italic'
              : isWinner
              ? 'text-brand'
              : isLoser
              ? 'text-white/30'
              : 'text-white/80'
          }`}
        >
          {isByeSlot ? 'BYE' : name}
        </span>
        {score !== undefined && (
          <span
            className={`text-xs font-black ml-3 min-w-[20px] text-center ${
              isWinner ? 'text-brand' : isLoser ? 'text-white/30' : 'text-white/70'
            }`}
          >
            {score}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white/[0.03] border rounded-xl overflow-hidden min-w-[180px] w-[200px] transition-all ${
        isFinished
          ? 'border-white/10'
          : isLive
          ? 'border-brand/40 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
          : 'border-white/5'
      }`}
    >
      {isLive && (
        <div className="flex items-center justify-center gap-1.5 py-1 bg-brand/10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-brand/70" />
            <span className="relative rounded-full bg-brand w-full h-full" />
          </span>
          <span className="text-[9px] font-bold text-brand uppercase tracking-widest">Ao Vivo</span>
        </div>
      )}
      {confronto.isFinal && !isLive && (
        <div className="flex items-center justify-center py-1 bg-white/[0.03]">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Final</span>
        </div>
      )}
      {renderParticipant(a, placarA, !!isWinnerA, !!isLoserA, true)}
      {renderParticipant(b, placarB, !!isWinnerB, !!isLoserB, false)}
      {confronto.isBye && (
        <div className="flex items-center justify-center py-1 border-t border-white/5">
          <span className="text-[9px] text-white/20 uppercase tracking-widest">Bye</span>
        </div>
      )}
    </div>
  );
}

function KnockoutBracket({ confrontos }: { confrontos: Confronto[] }) {
  const rounds = useMemo(() => {
    const grouped = new Map<number, Confronto[]>();
    for (const c of confrontos) {
      const existing = grouped.get(c.rodada) ?? [];
      existing.push(c);
      grouped.set(c.rodada, existing);
    }
    const sorted = Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
    for (const [, matches] of sorted) {
      matches.sort((a, b) => a.ordemNaRodada - b.ordemNaRodada);
    }
    return sorted;
  }, [confrontos]);

  const totalRounds = rounds.length;

  if (totalRounds === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-white/30 text-sm">
        Nenhum confronto encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-0 items-center min-w-max" style={{ minHeight: 400 }}>
        {rounds.map(([rodada, matches], roundIdx) => {
          const gapMultiplier = Math.pow(2, roundIdx);

          return (
            <div key={rodada} className="flex flex-col items-center relative">
              <div
                className="text-center mb-4"
              >
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {getRodadaLabel(rodada)}
                </span>
              </div>

              <div
                className="flex flex-col items-center"
                style={{
                  gap: `${gapMultiplier * 32}px`,
                }}
              >
                {matches.map((confronto) => (
                  <div key={confronto.id} className="relative">
                    <MatchCard confronto={confronto} />
                    {roundIdx < totalRounds - 1 && (
                      <div className="absolute top-1/2 -right-[1px] w-6 border-t border-white/10" />
                    )}
                    {roundIdx > 0 && (
                      <div className="absolute top-1/2 -left-[1px] w-6 border-t border-white/10 -translate-x-full" />
                    )}
                  </div>
                ))}
              </div>

              {roundIdx < totalRounds - 1 && (
                <div className="absolute right-0 top-0 h-full flex items-center">
                  <div className="absolute -right-3 top-0 bottom-0 w-px bg-white/10" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeagueStandings({ confrontos }: { confrontos: Confronto[] }) {
  const standings = useMemo(() => {
    const map = new Map<string, { nome: string; vitorias: number; derrotas: number; empates: number; golsPro: number; golsContra: number; pontos: number; jogos: number }>();

    for (const c of confrontos) {
      if (!c.partida || c.partida.status !== 'FINALIZADA') continue;
      if (!c.participanteA || !c.participanteB) continue;
      if (c.isBye) continue;

      const placarA = c.partida.placarA ?? 0;
      const placarB = c.partida.placarB ?? 0;

      for (const p of [c.participanteA, c.participanteB]) {
        if (!map.has(p.id)) {
          map.set(p.id, {
            nome: p.nome ?? 'Desconhecido',
            vitorias: 0,
            derrotas: 0,
            empates: 0,
            golsPro: 0,
            golsContra: 0,
            pontos: 0,
            jogos: 0,
          });
        }
      }

      const statsA = map.get(c.participanteA.id)!;
      const statsB = map.get(c.participanteB.id)!;

      statsA.golsPro += placarA;
      statsA.golsContra += placarB;
      statsA.jogos += 1;

      statsB.golsPro += placarB;
      statsB.golsContra += placarA;
      statsB.jogos += 1;

      if (placarA > placarB) {
        statsA.vitorias += 1;
        statsA.pontos += 3;
        statsB.derrotas += 1;
      } else if (placarB > placarA) {
        statsB.vitorias += 1;
        statsB.pontos += 3;
        statsA.derrotas += 1;
      } else {
        statsA.empates += 1;
        statsB.empates += 1;
        statsA.pontos += 1;
        statsB.pontos += 1;
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      const diffA = a.golsPro - a.golsContra;
      const diffB = b.golsPro - b.golsContra;
      if (diffB !== diffA) return diffB - diffA;
      return b.golsPro - a.golsPro;
    });
  }, [confrontos]);

  if (standings.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-white/30 text-sm">
        Nenhum resultado disponível
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">#</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Equipa</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">J</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">V</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">E</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">D</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">GM</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">GS</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">DG</th>
            <th className="text-center py-3 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => (
            <tr
              key={idx}
              className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                idx === 0 ? 'bg-brand/[0.03]' : ''
              }`}
            >
              <td className="py-3 px-4 text-xs font-bold text-white/50">{idx + 1}</td>
              <td className="py-3 px-4">
                <span className={`text-sm font-bold ${idx === 0 ? 'text-brand' : 'text-white/80'}`}>
                  {s.nome}
                </span>
              </td>
              <td className="py-3 px-4 text-center text-xs text-white/60">{s.jogos}</td>
              <td className="py-3 px-4 text-center text-xs text-emerald-400 font-bold">{s.vitorias}</td>
              <td className="py-3 px-4 text-center text-xs text-yellow-400 font-bold">{s.empates}</td>
              <td className="py-3 px-4 text-center text-xs text-red-400 font-bold">{s.derrotas}</td>
              <td className="py-3 px-4 text-center text-xs text-white/60">{s.golsPro}</td>
              <td className="py-3 px-4 text-center text-xs text-white/60">{s.golsContra}</td>
              <td className="py-3 px-4 text-center text-xs text-white/50">
                {s.golsPro - s.golsContra > 0 ? '+' : ''}{s.golsPro - s.golsContra}
              </td>
              <td className="py-3 px-4 text-center text-sm font-black text-white">{s.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BracketTree({ confrontos, tipo }: BracketTreeProps) {
  const isKnockout = tipo === 'KNOCKOUT' || tipo === 'DOUBLE_ELIM';

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-brand rounded-full" />
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {isKnockout ? 'Chaveamento' : tipo === 'GRUPOS' ? 'Classificação' : 'Classificação'}
        </h3>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 md:p-6">
        {isKnockout ? (
          <KnockoutBracket confrontos={confrontos} />
        ) : (
          <LeagueStandings confrontos={confrontos} />
        )}
      </div>
    </div>
  );
}
