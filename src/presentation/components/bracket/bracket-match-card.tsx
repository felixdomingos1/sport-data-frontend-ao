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

function Avatar({ participant, isWinner }: { participant?: BracketParticipant; isWinner: boolean }) {
  return (
    <div
      className={`relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-white/[0.06] ${
        isWinner
          ? 'ring-2 ring-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.35)]'
          : 'ring-1 ring-white/10'
      }`}
    >
      {participant?.foto ? (
        <img
          src={participant.foto}
          alt={participant.nome ?? 'Atleta'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-white/40">
          <User className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );
}

function ParticipantInfo({
  participant,
  isWinner,
}: {
  participant?: BracketParticipant;
  isWinner: boolean;
}) {
  const hasMeta = participant?.peso != null || participant?.pontos != null;
  return (
    <div className="flex-1 min-w-0">
      <p
        className={`text-[11px] font-semibold truncate leading-tight ${
          isWinner ? 'text-amber-400' : 'text-white/85'
        }`}
      >
        {participant ? participant.nome ?? 'TBD' : 'TBD'}
      </p>
      {hasMeta && (
        <p className="text-[8px] text-white/40 truncate leading-tight">
          {participant?.peso != null && `${participant.peso} kg`}
          {participant?.peso != null && participant?.pontos != null && ' · '}
          {participant?.pontos != null && `${participant.pontos} pts`}
          {participant?.clube && ` · ${participant.clube}`}
        </p>
      )}
    </div>
  );
}

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
      className={`flex items-center gap-2 px-2.5 py-1.5 ${
        isTop ? 'border-b border-white/5' : ''
      } ${isWinner ? 'bg-amber-400/[0.06]' : ''} transition-colors`}
    >
      <Avatar participant={participant} isWinner={isWinner} />
      {isByeSlot ? (
        <span className="flex-1 min-w-0 text-[11px] font-semibold italic text-white/25">
          {showBye ? 'BYE' : 'TBD'}
        </span>
      ) : (
        <ParticipantInfo participant={participant} isWinner={isWinner} />
      )}
      {hasScore && (
        <span
          className={`text-sm font-black tabular-nums shrink-0 ${
            isWinner ? 'text-amber-400' : 'text-white/40'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

function AthleteTooltip({ participant }: { participant?: BracketParticipant }) {
  if (!participant || !participant.nome) return null;
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white/[0.06] ring-1 ring-white/10">
        {participant.foto ? (
          <img src={participant.foto} alt={participant.nome} className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-white/40">
            <User className="w-4 h-4" />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-white truncate">{participant.nome}</p>
        <p className="text-[9px] text-white/40 truncate">
          {participant.clube ?? 'Sem clube'}
          {participant.seed != null && ` · Seed ${participant.seed}`}
        </p>
        <p className="text-[9px] text-white/50">
          {participant.peso != null && `${participant.peso} kg`}
          {participant.peso != null && participant.pontos != null && ' · '}
          {participant.pontos != null && `${participant.pontos} pts`}
        </p>
      </div>
    </div>
  );
}

interface BracketMatchCardProps {
  match: BracketMatch;
  participantes: BracketParticipant[];
  compact?: boolean;
  placeAbove?: boolean;
}

const BracketMatchCard: React.FC<BracketMatchCardProps> = ({
  match,
  participantes,
  compact,
  placeAbove,
}) => {
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
      className={`group relative z-0 flex flex-col h-[112px] bg-white/[0.03] border rounded-lg w-[210px] transition-all group-hover:z-40 ${
        isFinished
          ? 'border-white/10'
          : isLive
            ? 'border-brand/50 shadow-[0_0_14px_rgba(230,0,0,0.15)]'
            : 'border-white/5'
      }`}
    >
      {(isLive || sectionLabel) && (
        <div
          className={`flex items-center justify-center gap-1.5 py-1 rounded-t-lg shrink-0 ${
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
        <div className="flex items-center justify-between px-3 py-1 rounded-b-lg border-t border-white/5 shrink-0">
          <span className="text-[9px] text-white/25 uppercase tracking-widest">{statusInfo.label}</span>
          {match.group && (
            <span className="text-[9px] text-white/25 uppercase tracking-widest">{match.group}</span>
          )}
        </div>
      )}

      {(a || b) && (
        <div
          className={`absolute left-0 right-0 z-50 hidden group-hover:block pointer-events-none ${
            placeAbove ? 'bottom-full mb-2' : 'top-full mt-2'
          } bg-[#171717] border border-white/10 rounded-xl px-3 py-2 shadow-2xl`}
        >
          <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 uppercase tracking-widest pb-1">
            <Shield className="w-3 h-3" />
            Dados do atleta
          </div>
          {a && <AthleteTooltip participant={a} />}
          {b && <AthleteTooltip participant={b} />}
        </div>
      )}
    </div>
  );
};

export default BracketMatchCard;
