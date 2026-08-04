import type {
  BracketMatch,
  BracketParticipant,
  StandingsRow,
} from '../../core/types/bracket.types';

export function getParticipant(
  participantes: BracketParticipant[],
  id?: string | null
): BracketParticipant | undefined {
  if (!id) return undefined;
  return participantes.find((p) => p.id === id);
}

export function participantName(
  participantes: BracketParticipant[],
  id?: string | null
): string {
  const p = getParticipant(participantes, id);
  if (!p) return 'TBD';
  return p.nome ?? 'TBD';
}

export function computeStandings(matches: BracketMatch[]): StandingsRow[] {
  const map = new Map<string, StandingsRow>();

  for (const m of matches) {
    if (m.status !== 'FINALIZADA' && m.status !== 'WO' && m.status !== 'DESCLASSIFICADA') {
      continue;
    }
    if (!m.participantA || !m.participantB) continue;

    const a = m.participantA;
    const b = m.participantB;
    const sa = map.get(a) ?? { participanteId: a, pontos: 0, vitorias: 0, derrotas: 0, empates: 0, jogos: 0, golsPro: 0, golsContra: 0, saldoGols: 0 };
    const sb = map.get(b) ?? { participanteId: b, pontos: 0, vitorias: 0, derrotas: 0, empates: 0, jogos: 0, golsPro: 0, golsContra: 0, saldoGols: 0 };

    const pa = m.scoreA ?? 0;
    const pb = m.scoreB ?? 0;
    sa.golsPro += pa;
    sa.golsContra += pb;
    sb.golsPro += pb;
    sb.golsContra += pa;
    sa.jogos += 1;
    sb.jogos += 1;

    if (m.winnerId === a) {
      sa.vitorias += 1;
      sa.pontos += 3;
      sb.derrotas += 1;
    } else if (m.winnerId === b) {
      sb.vitorias += 1;
      sb.pontos += 3;
      sa.derrotas += 1;
    } else {
      sa.empates += 1;
      sb.empates += 1;
      sa.pontos += 1;
      sb.pontos += 1;
    }
    map.set(a, sa);
    map.set(b, sb);
  }

  const rows = Array.from(map.values());
  for (const row of rows) row.saldoGols = row.golsPro - row.golsContra;

  rows.sort((x, y) => {
    if (y.pontos !== x.pontos) return y.pontos - x.pontos;
    if (y.vitorias !== x.vitorias) return y.vitorias - x.vitorias;
    if (y.saldoGols !== x.saldoGols) return y.saldoGols - x.saldoGols;
    if (y.golsPro !== x.golsPro) return y.golsPro - x.golsPro;
    return x.participanteId.localeCompare(y.participanteId);
  });

  return rows;
}

export function groupByRound(matches: BracketMatch[]): Array<[number, BracketMatch[]]> {
  const grouped = new Map<number, BracketMatch[]>();
  for (const m of matches) {
    const existing = grouped.get(m.round) ?? [];
    existing.push(m);
    grouped.set(m.round, existing);
  }
  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([round, list]) => [
      round,
      list.sort((x, y) => x.matchNumber - y.matchNumber),
    ]) as Array<[number, BracketMatch[]]>;
}

export function roundLabel(round: number, totalRounds: number): string {
  const labels: Record<number, string> = {
    1: '1ª Ronda',
    2: '2ª Ronda',
    3: 'Quartos',
    4: 'Semi-Final',
    5: 'Final',
  };
  if (labels[round]) return labels[round];
  if (round === totalRounds) return 'Final';
  return `${round}ª Ronda`;
}
