import React, { useMemo } from 'react';
import type { BracketDto, BracketMatch } from '../../../core/types/bracket.types';
import { groupByRound, roundLabel } from '../../utils/bracket.utils';
import BracketMatchCard from './bracket-match-card';

const CARD_W = 210;
const CARD_H = 112;
const H_GAP = 48;
const BASE_GAP = 32;

interface TreeProps {
  bracket: BracketDto;
  matches: BracketMatch[];
  startRound?: number;
}

function Connector({ width, height, top, left }: { width: number; height: number; top: number; left: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ top, left, width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d={`M 0 0 H ${width / 2} V ${height} H 0`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <path
          d={`M ${width / 2} ${height / 2} H ${width}`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}

function RoundColumns({ bracket, matches, startRound = 0 }: TreeProps) {
  const rounds = useMemo(() => groupByRound(matches), [matches]);
  const totalRounds = rounds.length;

  if (rounds.length === 0) {
    return (
      <div className="py-12 text-center text-white/30 text-sm">Sem confrontos nesta secção</div>
    );
  }

  const slot0 = CARD_H + BASE_GAP;
  const totalHeight = rounds[0][1].length * slot0;
  const columns = rounds.map(([round, list]) => ({ round, list }));

  return (
    <div className="flex items-start min-w-max pb-4" style={{ gap: H_GAP }}>
      {columns.map(({ round, list }, colIdx) => {
        const slotR = totalHeight / list.length;
        const isBronzeCol = list.every((m) => m.section === 'BRONZE');
        const feederIdx = isBronzeCol
          ? columns.findIndex((c) => c.list.length === 2)
          : colIdx - 1;
        const hasConnector = colIdx > 0 && feederIdx >= 0;
        const slotPrev = hasConnector ? totalHeight / columns[feederIdx].list.length : 0;
        const connWidth = hasConnector
          ? colIdx * (CARD_W + H_GAP) - (feederIdx * (CARD_W + H_GAP) + CARD_W)
          : 0;
        const connTop = hasConnector ? (CARD_H - slotPrev) / 2 : 0;
        const connLeft = hasConnector ? -connWidth : 0;

        return (
          <div key={round} className="flex flex-col">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 whitespace-nowrap">
              {roundLabel(round, totalRounds + startRound)}
            </span>
            <div className="flex flex-col" style={{ height: totalHeight }}>
              {list.map((m) => (
                <div key={m.id} className="relative flex flex-col justify-center" style={{ height: slotR }}>
                  <div className="relative" style={{ width: CARD_W }}>
                    <BracketMatchCard match={m} participantes={bracket.participantes} />
                    {hasConnector && (
                      <Connector width={connWidth} height={slotPrev} top={connTop} left={connLeft} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const BracketEliminacao: React.FC<{ bracket: BracketDto }> = ({ bracket }) => {
  const principal = useMemo(
    () =>
      bracket.state.matches.filter(
        (m) => m.section === 'PRINCIPAL' || m.section === 'FINAL' || m.section === 'BRONZE'
      ),
    [bracket]
  );

  const perdedores = useMemo(
    () => bracket.state.matches.filter((m) => m.section === 'PERDEDORES'),
    [bracket]
  );

  const grupos = useMemo(() => {
    const groupMatches = bracket.state.matches.filter((m) => m.section === 'GRUPO');
    const names = Array.from(new Set(groupMatches.map((m) => m.group ?? 'Grupo')).values());
    return names.map((name) => ({
      name,
      matches: groupMatches.filter((m) => m.group === name),
    }));
  }, [bracket]);

  const isDoubleElim = bracket.formato === 'DOUBLE_ELIMINATION';
  const hasPerdedores = perdedores.length > 0;

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-10 min-w-max">
        {grupos.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
              Fase de Grupos
            </span>
            <RoundColumns bracket={bracket} matches={grupos.flatMap((g) => g.matches)} />
          </div>
        )}

        {grupos.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
              Playoffs
            </span>
            <RoundColumns bracket={bracket} matches={principal} />
          </div>
        )}

        {grupos.length === 0 && !hasPerdedores && (
          <RoundColumns bracket={bracket} matches={principal} />
        )}

        {hasPerdedores && (
          <div className="flex gap-16">
            <div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
                Chave Principal
              </span>
              <RoundColumns
                bracket={bracket}
                matches={principal.filter((m) => m.section !== 'PERDEDORES')}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
                Chave de Perdedores
              </span>
              <RoundColumns bracket={bracket} matches={perdedores} />
            </div>
          </div>
        )}

        {isDoubleElim && hasPerdedores && principal.some((m) => m.section === 'FINAL') && (
          <div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
              Grande Final
            </span>
            <RoundColumns
              bracket={bracket}
              matches={principal.filter((m) => m.section === 'FINAL' || m.section === 'BRONZE')}
              startRound={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BracketEliminacao;
