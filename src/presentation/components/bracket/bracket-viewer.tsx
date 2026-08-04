import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Swords,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import type { BracketDto, BracketFormat } from '../../../core/types/bracket.types';
import { BRACKET_FORMATO_LABELS, BRACKET_STATUS_LABELS } from '../../../core/types/bracket.types';
import { getParticipant } from '../../utils/bracket.utils';
import BracketEliminacao from './bracket-eliminacao';
import BracketStandings from './bracket-standings';

const LEAGUE_FORMATS: BracketFormat[] = ['ROUND_ROBIN', 'LEAGUE', 'SWISS'];

interface BracketViewerProps {
  bracket: BracketDto;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest truncate">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function Podium({ bracket }: { bracket: BracketDto }) {
  const { statistics, participantes } = bracket;
  const campeao = statistics.campeaoId ? getParticipant(participantes, statistics.campeaoId) : undefined;
  const vice = statistics.viceCampeaoId ? getParticipant(participantes, statistics.viceCampeaoId) : undefined;
  const terceiro = statistics.terceiroId ? getParticipant(participantes, statistics.terceiroId) : undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: 'Campeão', p: campeao, cls: 'border-yellow-500/40', icon: '🥇' },
        { label: 'Vice-Campeão', p: vice, cls: 'border-white/20', icon: '🥈' },
        { label: '3º Lugar', p: terceiro, cls: 'border-orange-500/30', icon: '🥉' },
      ].map(({ label, p, cls, icon }) => (
        <div
          key={label}
          className={`flex items-center gap-3 bg-white/[0.03] border ${cls} rounded-xl px-4 py-3`}
        >
          <span className="text-2xl">{icon}</span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-white truncate">{p?.nome ?? '—'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const BracketViewer: React.FC<BracketViewerProps> = ({ bracket }) => {
  const [tab, setTab] = useState<'chaveamento' | 'estatisticas' | 'classificacao'>('chaveamento');
  const s = bracket.statistics;
  const isLeague = LEAGUE_FORMATS.includes(bracket.formato);

  const grupos = useMemo(() => {
    if (bracket.formato !== 'GROUPS_PLAYOFFS') return [];
    const groupMatches = bracket.state.matches.filter((m) => m.section === 'GRUPO');
    const names = Array.from(new Set(groupMatches.map((m) => m.group ?? 'Grupo')).values());
    return names.map((name) => ({ name, matches: groupMatches.filter((m) => m.group === name) }));
  }, [bracket]);

  const progress = Math.min(100, Math.round(s.percentualConclusao));

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-brand rounded-full" />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
            {BRACKET_FORMATO_LABELS[bracket.formato] ?? bracket.formato}
          </h3>
          <span className="text-white/25 text-xs">·</span>
          <span className="text-xs font-semibold text-white/50">
            {BRACKET_STATUS_LABELS[bracket.status] ?? bracket.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(
              [
                ['chaveamento', 'Chaveamento'],
                ['estatisticas', 'Estatísticas'],
                ...(isLeague ? ([['classificacao', 'Classificação']] as const) : []),
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  tab === value ? 'bg-brand text-white' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
          {progress}% concluído
        </span>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 md:p-6">
        {tab === 'chaveamento' && (
          <div className="space-y-8">
            {isLeague && <BracketStandings bracket={bracket} />}
            {!isLeague && <BracketEliminacao bracket={bracket} />}
            {grupos.length > 0 &&
              grupos.map((g) => (
                <div key={g.name}>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 block">
                    Grupo {g.name}
                  </span>
                  <BracketStandings bracket={bracket} grupo={g.name} />
                </div>
              ))}
          </div>
        )}

        {tab === 'estatisticas' && (
          <div className="space-y-5">
            <Podium bracket={bracket} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard icon={<Users className="w-4 h-4 text-brand" />} label="Participantes" value={s.totalAtletas} />
              <StatCard icon={<Swords className="w-4 h-4 text-brand" />} label="Lutas" value={s.totalLutas} />
              <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} label="Finalizadas" value={s.totalFinalizadas} />
              <StatCard icon={<Activity className="w-4 h-4 text-brand" />} label="Rondas" value={s.totalRounds} />
              <StatCard icon={<UserCheck className="w-4 h-4 text-amber-400" />} label="Byes" value={s.totalByes} />
              <StatCard icon={<XCircle className="w-4 h-4 text-red-400" />} label="W.O." value={s.totalWalkovers} />
              <StatCard icon={<XCircle className="w-4 h-4 text-red-400" />} label="Desclassificações" value={s.totalDesclassificacoes} />
              <StatCard icon={<Clock className="w-4 h-4 text-white/60" />} label="Tempo médio" value={s.tempoMedioMinutos ? `${s.tempoMedioMinutos} min` : '—'} />
            </div>
          </div>
        )}

        {tab === 'classificacao' && <BracketStandings bracket={bracket} />}
      </div>
    </div>
  );
};

export default BracketViewer;
