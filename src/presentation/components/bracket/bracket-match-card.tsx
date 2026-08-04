import React from 'react';
import { Shield, User } from 'lucide-react';
import type {
  BracketMatch,
  BracketMatchStatus,
  BracketParticipant,
} from '../../../core/types/bracket.types';
import { getParticipant, participantName } from '../../utils/bracket.utils';

const STATUS_STYLE: Record<BracketMatchStatus, { label: string; cls: string }> = {
  AGENDADA: { label: 'Agendada', cls: 'bg-white/10 text-white/60' },
  EM_ESPERA: { label: 'Em Espera', cls: 'bg-white/5 text-white/30' },
  CHAMANDO: { label: 'Chamando', cls: 'bg-amber-500/20 text-amber-400' },
  EM_ANDAMENTO: { label: 'Ao Vivo', cls: 'bg-brand text-white' },
  FINALIZADA: { label: 'Finalizada', cls: 'bg-white/20 text-white/70' },
  CANCELADA: { label: 'Cancelada', cls: 'bg-red-500/20 text-red-400' },
  WO: { label: 'W.O.', cls: 'bg-red-500/20 text-red-400' },
  BYE: { label: 'Bye', cls: 'bg-white/5 text-white/40' },
  DESCLASSIFICADA: { label: 'Desclassificada', cls: 'bg-red-500/20 text-red-400' },
};

function ParticipantRow({
  label,
  participant,
  score,
  isWinner,
  isTop,
  showBye,
}: {
  label: string;
  participant?: BracketParticipant;
  score?: number | null;
  isWinner: boolean;
  isTop: boolean;
  showBye: boolean;
}) {
  const isByeSlot = !participant;
  const hasScore = score !== undefined && score !== null;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 ${
        isTop ? 'border-b border-white/5' : ''
      } ${isWinner ? 'bg-brand/5' : ''}`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span className="text-white/20 shrink-0">
          {isTop ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
        </span>
        <span
          className={`text-xs font-semibold truncate ${
            isByeSlot
              ? 'text-white/20 italic'
              : isWinner
                ? 'text-brand font-bold'
                : 'text-white/80'
          }`}
        >
          {isByeSlot ? (showBye ? 'BYE' : 'TBD') : label}
        </span>
      </span>
      {hasScore && (
        <span
          className={`text-sm font-black tabular-nums shrink-0 ${
            isWinner ? 'text-brand' : 'text-white/40'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

interface BracketMatchCardProps {
  match: BracketMatch;
  participantes: BracketParticipant[];
  compact?: boolean;
}

const BracketMatchCard: React.FC<BracketMatchCardProps> = ({ match, participantes, compact }) => {
  const statusInfo = STATUS_STYLE[match.status] ?? STATUS_STYLE.AGENDADA;
  const a = getParticipant(participantes, match.participantA);
  const b = getParticipant(participantes, match.participantB);
  const isWinnerA = !!match.winnerId && match.winnerId === match.participantA;
  const isWinnerB = !!match.winnerId && match.winnerId === match.participantB;
  const isLive = match.status === 'EM_ANDAMENTO' || match.status === 'CHAMANDO';
  const isFinished = match.status === 'FINALIZADA';

  const sectionLabel =
    match.section === 'BRONZE'
      ? 'Disputa 3º Lugar'
      : match.section === 'FINAL'
        ? 'Final'
        : match.section === 'PERDEDORES'
          ? 'Perdedores'
          : match.section === 'REPESCAGEM'
            ? 'Repescagem'
            : match.isFinal
              ? 'Final'
              : undefined;

  return (
    <div
      className={`flex flex-col h-[112px] bg-white/[0.03] border rounded-lg overflow-hidden w-[210px] transition-all ${
        isFinished
          ? 'border-white/10'
          : isLive
            ? 'border-brand/50 shadow-[0_0_14px_rgba(230,0,0,0.15)]'
            : 'border-white/5'
      }`}
    >
      {(isLive || sectionLabel) && (
        <div
          className={`flex items-center justify-center gap-1.5 py-1 shrink-0 ${
            isLive ? 'bg-brand/10' : 'bg-white/[0.02]'
          }`}
        >
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-brand/70" />
              <span className="relative rounded-full bg-brand w-full h-full" />
            </span>
          )}
          <span
            className={`text-[9px] font-bold uppercase tracking-widest ${
              isLive ? 'text-brand' : 'text-white/30'
            }`}
          >
            {isLive ? 'Ao Vivo' : sectionLabel}
          </span>
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <ParticipantRow
          label={participantName(participantes, match.participantA)}
          participant={a}
          score={match.scoreA}
          isWinner={isWinnerA}
          isTop
          showBye={match.isBye}
        />
        <ParticipantRow
          label={participantName(participantes, match.participantB)}
          participant={b}
          score={match.scoreB}
          isWinner={isWinnerB}
          isTop={false}
          showBye={match.isBye}
        />
      </div>
      {!compact && (
        <div className="flex items-center justify-between px-3 py-1 border-t border-white/5 shrink-0">
          <span className="text-[9px] text-white/25 uppercase tracking-widest">{statusInfo.label}</span>
          {match.group && (
            <span className="text-[9px] text-white/25 uppercase tracking-widest">{match.group}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BracketMatchCard;
