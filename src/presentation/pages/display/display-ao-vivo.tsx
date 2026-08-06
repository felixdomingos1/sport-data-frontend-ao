import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Maximize2, Minimize2, Trophy, Swords, ChevronLeft, ChevronRight } from 'lucide-react';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import { bracketService } from '../../../infrastructure/services/bracket.service';
import type { Campeonato } from '../../../core/types/api.types';
import type { BracketDto, BracketSummary, BracketMatch, BracketState, BracketStatistics } from '../../../core/types/bracket.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const WS = API.replace(/\/api\/v1\/?$/, '');

function np(id?: string | null, p?: BracketDto['participantes']): string {
  if (!id) return 'TBD';
  return p?.find(x => x.id === id)?.nome ?? id;
}
function rl(tr: number, m: BracketMatch): string {
  if (m.isBronze) return '3º Lugar';
  if (m.isFinal) return 'Final';
  return `R${m.round}`;
}

const DisplayAoVivo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campeonato, setCampeonato] = useState<Campeonato | null>(null);
  const [brackets, setBrackets] = useState<BracketSummary[]>([]);
  const [sBid, setSBid] = useState('');
  const [bracket, setBracket] = useState<BracketDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const sBidRef = useRef('');

  useEffect(() => { sBidRef.current = sBid; }, [sBid]);

  useEffect(() => {
    const s = io(WS, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 50, reconnectionDelay: 500 });
    socketRef.current = s;
    s.on('connect', () => {
      setConnected(true);
      if (id) { s.emit('join_campeonato', { campeonatoId: id }); }
      if (sBidRef.current) { s.emit('join_bracket', { bracketId: sBidRef.current }); }
    });
    s.on('disconnect', () => setConnected(false));
    s.on('connect_error', (err) => console.error('[Display] Socket erro:', err.message));
    s.on('bracket:atualizado', (payload: any) => {
      if (payload.campeonatoId !== id) return;
      setBracket(prev => prev?.id === payload.bracketId ? { ...prev, state: payload.state, statistics: payload.statistics, status: payload.state.status } : prev);
    });
    s.on('fight:update', (payload: any) => {
      const bid = sBidRef.current;
      if (!bid || payload.bracketId !== bid) return;
      setBracket(prev => {
        if (!prev) return prev;
        const ns = { ...prev.state, matches: prev.state.matches.map(m => m.id !== payload.matchId ? m : {
          ...m, scoreA: payload.scoreA, scoreB: payload.scoreB,
          winnerId: payload.winner || m.winnerId,
          status: payload.timerRunning ? 'EM_ANDAMENTO' as any : m.status,
          tempo: `${Math.floor(payload.timerSeconds / 60)}:${String(payload.timerSeconds % 60).padStart(2, '0')}`,
          metadata: { ...m.metadata, pontoTipo: payload.pontoTipo || undefined },
        }) };
        return { ...prev, state: ns };
      });
    });
    return () => { s.disconnect(); };
  }, [id]);

  useEffect(() => {
    if (!sBid) return;
    const s = socketRef.current;
    if (!s?.connected) return;
    s.emit('join_bracket', { bracketId: sBid });
  }, [sBid, connected]);

  useEffect(() => { const i = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (!id) return; setLoading(true);
    Promise.all([competicaoService.getCampeonatoById(id).catch(() => null as any), bracketService.listarPorCampeonato(id).catch(() => [] as BracketSummary[])])
      .then(([c, brs]) => { setCampeonato(c); setBrackets(brs); if (brs.length > 0) setSBid(brs[0].id); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { if (sBid) bracketService.obter(sBid).then(setBracket).catch(() => {}); }, [sBid]);

  const toggleFS = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.catch(() => {}); setFullscreen(true); }
    else { document.exitFullscreen?.catch(() => {}); setFullscreen(false); }
  };
  useEffect(() => { const h = () => { if (!document.fullscreenElement) setFullscreen(false); }; document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h); }, []);

  const currentMatch = useMemo(() => {
    if (!bracket) return null;
    if (selectedMatchId) return bracket.state.matches.find(m => m.id === selectedMatchId) ?? null;
    const first = bracket.state.matches.find(m => m.status !== 'FINALIZADA' && m.status !== 'WO' && m.status !== 'DESCLASSIFICADA' && m.status !== 'BYE' && m.participantA && m.participantB);
    if (first) return first;
    return [...bracket.state.matches].filter(m => m.status === 'FINALIZADA').pop() ?? bracket.state.matches[0] ?? null;
  }, [bracket, selectedMatchId]);

  const done = currentMatch?.status === 'FINALIZADA' || currentMatch?.status === 'WO' || currentMatch?.status === 'DESCLASSIFICADA';
  const isWA = currentMatch?.winnerId === currentMatch?.participantA;
  const isWB = currentMatch?.winnerId === currentMatch?.participantB;

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><SportLoadingScreen message="A carregar..." size="md" /></div>;
  if (!campeonato) return <div className="h-screen bg-black text-white flex items-center justify-center"><p className="text-white/30">Não encontrado</p></div>;

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col font-sans">
      {/* Top bar — ultra compacta */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#0a0a0a] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <h1 className="text-[10px] sm:text-xs font-black uppercase tracking-wider truncate max-w-[200px] sm:max-w-[400px]">{campeonato.nome}</h1>
          {bracket && <span className="text-[9px] sm:text-[10px] text-white/20 hidden sm:inline">{bracket.statistics.totalFinalizadas}/{bracket.statistics.totalLutas}</span>}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[10px] sm:text-xs text-white/20 font-mono tabular-nums">{clock.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
          {brackets.length > 1 && (
            <select value={sBid} onChange={e => setSBid(e.target.value)} className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[9px] sm:text-[10px] text-white/50 max-w-[120px]">
              {brackets.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          )}
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <button onClick={toggleFS} className="text-white/30 hover:text-white p-0.5">{fullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
        </div>
      </div>

      {/* Corpo principal */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Toggle sidebar button — fixo no canto esquerdo */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#111] border border-white/10 rounded-r-lg p-1.5 sm:p-2 text-white/30 hover:text-white hover:bg-[#222] transition-colors shadow-lg"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Sidebar — oculta por default */}
        <div className={`${sidebarOpen ? 'w-56 sm:w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-white/5 shrink-0 flex flex-col`}>
          <div className="p-2 overflow-y-auto flex-1">
            {bracket && Array.from(new Map(bracket.state.matches.map(m => [m.round, m.round])).entries()).sort((a,b) => a[0]-b[0]).map(([r]) => {
              const rm = bracket.state.matches.filter(m => m.round === r);
              return (
                <div key={r} className="mb-3">
                  <div className="text-[9px] font-bold text-white/15 uppercase tracking-wider mb-1 px-1">{rl(bracket.state.rounds, rm[0])}</div>
                  {rm.map(m => {
                    const isSel = m.id === selectedMatchId;
                    const isDone = m.status === 'FINALIZADA' || m.status === 'WO' || m.status === 'DESCLASSIFICADA';
                    return (
                      <button key={m.id} onClick={() => { setSelectedMatchId(isSel ? null : m.id); setSidebarOpen(false); }}
                        className={`block w-full text-left px-2 py-1 rounded text-[10px] font-bold transition whitespace-nowrap ${isSel ? 'bg-brand/30 text-brand' : isDone ? 'text-green-500/60' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                        M{m.matchNumber} {isDone ? `${m.scoreA ?? 0}-${m.scoreB ?? 0}` : `${np(m.participantA, bracket.participantes).split(' ')[0]}`}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-w-0">
          {!bracket ? <SportLoadingScreen message="A aguardar..." size="sm" /> : currentMatch ? (
            <div className="w-full max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] h-full flex flex-col justify-center gap-6 sm:gap-8 lg:gap-10">
              {/* Timer — gigante */}
              <div className="text-center">
                {done ? (
                  <>
                    <div className="text-[10px] sm:text-xs font-bold text-white/10 uppercase tracking-[0.4em] mb-2">Tempo Final</div>
                    <div className="text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-black text-white/10 tabular-nums leading-none">{currentMatch.tempo ?? '--:--'}</div>
                    <div className="mt-3 sm:mt-4 text-lg sm:text-2xl md:text-3xl font-black text-green-500 uppercase tracking-[0.2em]">Finalizado</div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] sm:text-xs font-bold text-white/10 uppercase tracking-[0.4em] mb-2">Tempo</div>
                    <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-amber-400 tabular-nums leading-none drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">{currentMatch.tempo ?? '--:--'}</div>
                  </>
                )}
              </div>

              {/* Lutador A */}
              <div className={`px-6 sm:px-10 py-4 sm:py-6 rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all ${isWA ? 'border-green-500 bg-green-500/10 shadow-[0_0_60px_rgba(34,197,94,0.2)]' : done && currentMatch.winnerId ? 'border-white/5 bg-white/[0.02] opacity-30' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight truncate ${isWA ? 'text-green-400' : done && currentMatch.winnerId ? 'text-white/20' : 'text-white'}`}>
                    {isWA && '🏆 '}{np(currentMatch.participantA, bracket.participantes)}
                  </p>
                  <span className={`text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black tabular-nums ml-4 sm:ml-8 leading-none ${isWA ? 'text-green-400' : done && currentMatch.winnerId ? 'text-white/10' : 'text-white'}`}>
                    {currentMatch.scoreA ?? 0}
                  </span>
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center gap-3 sm:gap-4 py-1">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs sm:text-sm font-black text-white/10 uppercase tracking-[0.3em]">VS</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Lutador B */}
              <div className={`px-6 sm:px-10 py-4 sm:py-6 rounded-2xl sm:rounded-3xl border-2 sm:border-4 transition-all ${isWB ? 'border-green-500 bg-green-500/10 shadow-[0_0_60px_rgba(34,197,94,0.2)]' : done && currentMatch.winnerId ? 'border-white/5 bg-white/[0.02] opacity-30' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight truncate ${isWB ? 'text-green-400' : done && currentMatch.winnerId ? 'text-white/20' : 'text-white'}`}>
                    {isWB && '🏆 '}{np(currentMatch.participantB, bracket.participantes)}
                  </p>
                  <span className={`text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-black tabular-nums ml-4 sm:ml-8 leading-none ${isWB ? 'text-green-400' : done && currentMatch.winnerId ? 'text-white/10' : 'text-white'}`}>
                    {currentMatch.scoreB ?? 0}
                  </span>
                </div>
              </div>

              {/* Info da ronda */}
              <div className="text-center text-[10px] sm:text-xs font-bold text-white/10 uppercase tracking-[0.3em]">
                {rl(bracket.state.rounds, currentMatch)} · Match {currentMatch.matchNumber}
                {currentMatch.metadata?.pontoTipo && <> · {String(currentMatch.metadata.pontoTipo)}</>}
              </div>
            </div>
          ) : (
            <div className="text-center text-white/10"><Trophy className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-4 opacity-10" /><p className="text-xl sm:text-2xl font-black">Nenhuma luta</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayAoVivo;
