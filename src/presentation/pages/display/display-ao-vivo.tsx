import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import { bracketService } from '../../../infrastructure/services/bracket.service';
import type { Campeonato } from '../../../core/types/api.types';
import type { BracketDto, BracketSummary, BracketMatch } from '../../../core/types/bracket.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const WS = API.replace(/\/api\/v1\/?$/, '');

function np(id?: string | null, p?: BracketDto['participantes']): string { if (!id) return 'TBD'; return p?.find(x => x.id === id)?.nome ?? id }
function rl(tr: number, m: BracketMatch): string { if (m.isBronze) return '3° Lugar'; if (m.isFinal) return 'Final'; return `R${m.round}` }
function formatTime(sec: number) { const m = Math.floor(sec / 60); const s = sec % 60; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` }
function penaltyName(s: number): { name: string; level: "shido" | "chui" | "hansoku" } { if (s >= 6) return { name: "HANSOKU-MAKE", level: "hansoku" }; if (s >= 3) return { name: "CHUI", level: "chui" }; if (s >= 1) return { name: "SHIDO", level: "shido" }; return { name: "-", level: "shido" } }

const AngolaFlag = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size * (2 / 3)} viewBox="0 0 900 600" className="inline-block shrink-0">
    <rect width="900" height="300" fill="#cc092f" /><rect y="300" width="900" height="300" fill="#000000" />
    <g transform="translate(450,300)"><circle r="100" fill="#fcdd09" /><g transform="translate(-50,0)"><path d="M0,-30 C-40,10 -10,80 0,100 C10,80 40,10 0,-30Z" fill="#cc092f" /><rect x="-20" y="-20" width="40" height="40" rx="2" fill="#000000" /><path d="M0,-50 L35,20 L-35,20 Z" fill="#fcdd09" /></g></g>
  </svg>
);

const DisplayAoVivo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campeonato, setCampeonato] = useState<Campeonato | null>(null);
  const [brackets, setBrackets] = useState<BracketSummary[]>([]);
  const [sBid, setSBid] = useState(''); const [bracket, setBracket] = useState<BracketDto | null>(null);
  const [loading, setLoading] = useState(true); const [fullscreen, setFullscreen] = useState(false);
  const [clock, setClock] = useState(new Date()); const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false); const [sidebarOpen, setSidebarOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null); const sBidRef = useRef('');
  const [liveScores, setLiveScores] = useState<Record<string, any>>({});
  const [centerAlert, setCenterAlert] = useState<{ text: string; color: string; side?: string } | null>(null);

  useEffect(() => { sBidRef.current = sBid }, [sBid]);
  useEffect(() => {
    const s = io(WS, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 50, reconnectionDelay: 500 }); socketRef.current = s;
    s.on('connect', () => { setConnected(true); if (id) s.emit('join_campeonato', { campeonatoId: id }); if (sBidRef.current) s.emit('join_bracket', { bracketId: sBidRef.current }) });
    s.on('disconnect', () => setConnected(false));
    s.on('bracket:atualizado', (p: any) => { if (p.campeonatoId !== id) return; setBracket(prev => prev?.id === p.bracketId ? { ...prev, state: p.state, statistics: p.statistics, status: p.state.status } : prev) });
    s.on('fight:update', (p: any) => {
      setLiveScores(prev => ({ ...prev, [p.matchId]: p }));
      if (p.actionAlert) { setCenterAlert({ text: p.actionAlert.text, color: p.actionAlert.color, side: p.actionAlert.side }); setTimeout(() => setCenterAlert(null), 4000) }
    });
    return () => { s.disconnect() }
  }, [id]);
  useEffect(() => { if (!sBid) return; const s = socketRef.current; if (!s?.connected) return; s.emit('join_bracket', { bracketId: sBid }) }, [sBid, connected]);
  useEffect(() => { const i = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(i) }, []);
  useEffect(() => { if (!id) return; setLoading(true); Promise.all([competicaoService.getCampeonatoById(id).catch(() => null as any), bracketService.listarPorCampeonato(id).catch(() => [] as BracketSummary[])]).then(([c, brs]) => { setCampeonato(c); setBrackets(brs); if (brs.length > 0) setSBid(brs[0].id) }).finally(() => setLoading(false)) }, [id]);
  useEffect(() => { if (sBid) bracketService.obter(sBid).then(setBracket).catch(() => {}) }, [sBid]);
  const toggleFS = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.catch(() => {}); setFullscreen(true) } else { document.exitFullscreen?.catch(() => {}); setFullscreen(false) } };
  useEffect(() => { const h = () => { if (!document.fullscreenElement) setFullscreen(false) }; document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h) }, []);

  const currentMatch = useMemo(() => { if (!bracket) return null; if (selectedMatchId) return bracket.state.matches.find(m => m.id === selectedMatchId) ?? null; const first = bracket.state.matches.find(m => m.status !== 'FINALIZADA' && m.status !== 'WO' && m.status !== 'DESCLASSIFICADA' && m.status !== 'BYE' && m.participantA && m.participantB); if (first) return first; return [...bracket.state.matches].filter(m => m.status === 'FINALIZADA').pop() ?? bracket.state.matches[0] ?? null }, [bracket, selectedMatchId]);
  const done = currentMatch?.status === 'FINALIZADA' || currentMatch?.status === 'WO' || currentMatch?.status === 'DESCLASSIFICADA';
  const isWA = currentMatch?.winnerId === currentMatch?.participantA; const isWB = currentMatch?.winnerId === currentMatch?.participantB;
  const live = currentMatch ? liveScores[currentMatch.id] : null;

  const [localTimer, setLocalTimer] = useState<number | null>(null);
  useEffect(() => { if (!currentMatch || currentMatch.status === 'FINALIZADA') { setLocalTimer(null); return } if (live?.osaeKomiActive) { return }; const meta = (currentMatch.metadata ?? {}) as any; if (currentMatch.status === 'EM_ANDAMENTO' && meta.startTime && meta.duracao) { const elapsed = Math.floor((Date.now() - meta.startTime) / 1000); const remaining = Math.max(0, meta.duracao - elapsed); setLocalTimer(remaining); if (remaining <= 0) return; const i = setInterval(() => { setLocalTimer(prev => { if (prev === null || prev <= 0) { clearInterval(i); return 0 } return prev - 1 }) }, 1000); return () => clearInterval(i) } setLocalTimer(null) }, [currentMatch?.id, currentMatch?.status, live?.osaeKomiActive]);

  const displayTempo = currentMatch?.tempo && currentMatch.tempo !== '--:--' ? currentMatch.tempo : localTimer !== null ? formatTime(localTimer) : (currentMatch?.tempo ?? '--:--');
  const meta = (currentMatch?.metadata ?? {}) as any;
  const ipponsArrA = (live?.ipponsA) ?? (meta?.ipponsA as number[]) ?? [0, 0, 0];
  const ipponsArrB = (live?.ipponsB) ?? (meta?.ipponsB as number[]) ?? [0, 0, 0];
  const advantageA = live?.advantageA ?? meta?.advantageA ?? 0; const advantageB = live?.advantageB ?? meta?.advantageB ?? 0;
  const shidosA = live?.shidosA ?? meta?.shidosA ?? 0; const shidosB = live?.shidosB ?? meta?.shidosB ?? 0;
  const penA = penaltyName(shidosA); const penB = penaltyName(shidosB);
  const isRunning = (currentMatch?.status === 'EM_ANDAMENTO' && !done) || live?.timerRunning;
  const isStarted = live?.started ?? false;
  const isDQ_A = penA.level === 'hansoku'; const isDQ_B = penB.level === 'hansoku';
  const osaeActive = live?.osaeKomiActive ?? false; const osaeSecs = live?.osaeKomiSeconds ?? 0;
  const scoreA = live?.scoreA ?? currentMatch?.scoreA ?? 0; const scoreB = live?.scoreB ?? currentMatch?.scoreB ?? 0;
  const winnerReason = (currentMatch?.metadata as any)?.pontoTipo ?? 'PONTOS';

  if (loading) return <div className="h-screen bg-[#060b14] flex items-center justify-center"><SportLoadingScreen message="A carregar..." size="md" /></div>;
  if (!campeonato) return <div className="h-screen bg-[#060b14] text-white flex items-center justify-center"><p className="text-white/30">Não encontrado</p></div>;

  return (
    <div className="h-screen bg-[#060b14] text-white overflow-hidden flex flex-col font-sans select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-1 sm:py-1.5 bg-[#0a0f1e] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0"><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/60 flex items-center justify-center"><div className="w-2 sm:w-2.5 h-2 sm:h-2.5 border border-white/60 rotate-45" /></div><span className="text-[9px] sm:text-xs font-black text-white/40 tracking-[0.2em] uppercase hidden sm:inline">ARENA FIGHT</span></div>
          <span className="text-[8px] sm:text-[10px] font-bold text-white/15 uppercase tracking-[0.15em] truncate max-w-[200px] sm:max-w-[400px]">{campeonato.nome}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span className="text-[9px] sm:text-xs text-white/15 font-mono tabular-nums">{clock.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
          {brackets.length > 1 && <select value={sBid} onChange={e => setSBid(e.target.value)} className="bg-white/5 border border-white/[0.08] rounded px-1.5 py-0.5 text-[8px] sm:text-[10px] text-white/40 max-w-[100px] sm:max-w-[120px] focus:outline-none">{brackets.map(b => <option key={b.id} value={b.id} className="bg-[#0a0f1e]">{b.nome}</option>)}</select>}
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
          <button onClick={toggleFS} className="text-white/20 hover:text-white/50 transition-colors p-0.5">{fullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#0a0f1e]/90 border border-white/[0.06] rounded-r-lg p-1 sm:p-1.5 text-white/20 hover:text-white/50 transition-colors">{sidebarOpen ? <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
        <div className={`${sidebarOpen ? 'w-48 sm:w-60' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-white/[0.04] bg-[#080d18] shrink-0 flex flex-col`}>
          <div className="p-2 overflow-y-auto flex-1">
            {bracket && Array.from(new Map(bracket.state.matches.map(m => [m.round, m.round])).entries()).sort((a,b)=>a[0]-b[0]).map(([r]) => { const rm = bracket.state.matches.filter(m => m.round === r); return (<div key={r} className="mb-3"><div className="text-[8px] font-bold text-white/10 uppercase tracking-wider mb-1 px-1">{rl(bracket.state.rounds, rm[0])}</div>{rm.map(m => { const s = m.id === selectedMatchId; const d = m.status === 'FINALIZADA' || m.status === 'WO' || m.status === 'DESCLASSIFICADA'; return (<button key={m.id} onClick={() => { setSelectedMatchId(s ? null : m.id); setSidebarOpen(false) }} className={`block w-full text-left px-2 py-1 rounded text-[9px] font-bold transition whitespace-nowrap ${s ? 'bg-cyan-400/10 text-cyan-400' : d ? 'text-green-500/50' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'}`}>M{m.matchNumber} {d ? `${m.scoreA ?? 0}-${m.scoreB ?? 0}` : np(m.participantA, bracket.participantes).split(' ')[0]}</button>) })}</div>) })}
          </div>
        </div>

        <div className="flex-1 flex min-w-0 p-3 sm:p-6 lg:p-8 relative">
          {/* Center Alert Overlay */}
          <AnimatePresence>
            {centerAlert && (
              <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <motion.span className={`text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tight drop-shadow-[0_0_60px_rgba(255,255,255,0.3)] ${centerAlert.color}`}>{centerAlert.text}</motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {!bracket ? <div className="flex-1 flex items-center justify-center"><SportLoadingScreen message="A aguardar..." size="sm" /></div> : currentMatch ? (
            <div className="flex-1 flex items-stretch min-h-0">
              {/* RED */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.03] to-transparent pointer-events-none" />
                <div className="text-center space-y-2 sm:space-y-4">
                  <div>
                    <h2 className={`text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight px-2 text-center ${isDQ_A ? 'text-red-500/70 line-through' : isWA ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]' : done && currentMatch.winnerId ? 'text-white/15' : 'text-white'}`}>{isWA && !isDQ_A ? '🏆 ' : ''}{np(currentMatch.participantA, bracket.participantes)}</h2>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1"><AngolaFlag size={14} /><span className="text-[8px] sm:text-xs font-bold text-white/20 uppercase tracking-[0.15em]">ANGOLA</span></div>
                  </div>
                  {isDQ_A && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-xs sm:text-base font-black text-red-400 bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-[0.15em]">HANSOKU-MAKE</motion.div>}
                  <div>
                    <span className="text-[9px] sm:text-xs font-bold text-red-400/50 uppercase tracking-[0.2em] block mb-0.5">PONTOS</span>
                    <span className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tabular-nums leading-none ${isDQ_A ? 'text-red-400/30' : isWA ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]'}`}>{scoreA}</span>
                  </div>
                </div>
              </div>

              {/* CENTER Timer */}
              <div className="flex flex-col items-center justify-center px-2 sm:px-4 lg:px-6 shrink-0">
                {osaeActive && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 sm:mb-2 p-1.5 sm:p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                    <span className="text-[9px] sm:text-xs font-black text-purple-400/60 uppercase tracking-[0.2em] block">OSAE-KOMI</span>
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-400 tabular-nums drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">{osaeSecs}s</span>
                    <div className="flex justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">{osaeSecs>=10&&<span className="text-[7px] sm:text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1 sm:px-1.5 py-0.5 rounded">YUKO</span>}{osaeSecs>=15&&<span className="text-[7px] sm:text-[9px] font-bold text-orange-400 bg-orange-400/10 px-1 sm:px-1.5 py-0.5 rounded">WAZARI</span>}{osaeSecs>=20&&<span className="text-[7px] sm:text-[9px] font-bold text-red-400 bg-red-400/10 px-1 sm:px-1.5 py-0.5 rounded animate-pulse">IPPON</span>}</div>
                  </motion.div>
                )}
                {done ? (
                  <div className="text-center space-y-2 sm:space-y-3">
                    <span className="text-[10px] sm:text-sm font-bold text-white/30 uppercase tracking-[0.3em] block">TEMPO FINAL</span>
                    <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/15 tabular-nums leading-none">{displayTempo}</div>
                    <div className="text-base sm:text-xl md:text-2xl font-black text-green-500/60 uppercase tracking-[0.2em]">{winnerReason === 'FUSEN_GACHI' ? 'FUSEN-GACHI' : winnerReason === 'KIKEN_GACHI' ? 'KIKEN-GACHI' : winnerReason === 'HANSOKU_MAKE' ? 'DESCLASSIFICADO' : 'FINALIZADO'}</div>
                  </div>
                ) : !isStarted ? (
                  <div className="text-center space-y-2 sm:space-y-3">
                    <span className="text-[10px] sm:text-sm font-bold text-white/25 uppercase tracking-[0.3em] block">AGUARDANDO</span>
                    <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white/10 tabular-nums leading-none">--:--</div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 sm:space-y-3">
                    <span className="text-[10px] sm:text-sm font-bold text-white/30 uppercase tracking-[0.3em] block">TEMPO</span>
                    <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tabular-nums leading-none tracking-tight ${isRunning ? 'text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]' : 'text-white/70'}`}>{displayTempo}</div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 sm:gap-3 my-2 sm:my-4 w-full"><div className="w-8 sm:w-12 h-px bg-white/[0.04]" /><span className="text-xs sm:text-sm font-black text-white/10 tracking-[0.3em]">VS</span><div className="w-8 sm:w-12 h-px bg-white/[0.04]" /></div>
                <div className="text-[8px] sm:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] text-center">{rl(bracket.state.rounds, currentMatch)}</div>
              </div>

              {/* BLUE */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/[0.03] to-transparent pointer-events-none" />
                <div className="text-center space-y-2 sm:space-y-4">
                  <div>
                    <h2 className={`text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight px-2 text-center ${isDQ_B ? 'text-red-500/70 line-through' : isWB ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]' : done && currentMatch.winnerId ? 'text-white/15' : 'text-white'}`}>{isWB && !isDQ_B ? '🏆 ' : ''}{np(currentMatch.participantB, bracket.participantes)}</h2>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1"><AngolaFlag size={14} /><span className="text-[8px] sm:text-xs font-bold text-white/20 uppercase tracking-[0.15em]">ANGOLA</span></div>
                  </div>
                  {isDQ_B && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-xs sm:text-base font-black text-red-400 bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-[0.15em]">HANSOKU-MAKE</motion.div>}
                  <div>
                    <span className="text-[9px] sm:text-xs font-bold text-cyan-400/50 uppercase tracking-[0.2em] block mb-0.5">PONTOS</span>
                    <span className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tabular-nums leading-none ${isDQ_B ? 'text-cyan-400/30' : isWB ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}>{scoreB}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/[0.04]"><div className="text-center"><div className="w-16 sm:w-28 h-16 sm:h-28 mx-auto mb-4 border-2 border-white/[0.04] flex items-center justify-center"><div className="w-8 sm:w-14 h-8 sm:h-14 border border-white/[0.04] rotate-45" /></div><p className="text-base sm:text-xl font-black text-white/[0.04]">Nenhuma luta</p></div></div>
          )}
        </div>
      </div>

      {/* GIANT FOOTER — IPPON with separator | Advantage | Penalty */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#080d18]">
        <div className="flex items-stretch">
          {/* RED side stats */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-3 sm:py-4 border-r border-white/[0.04]">
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em]">VANTAGEM</span>
              <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums mt-0.5">{advantageA}</span>
            </div>
            <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
            <div className="flex flex-col items-center">
              <span className={`text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider ${penA.level==='hansoku'?'text-red-400':penA.level==='chui'?'text-amber-400':penA.level==='shido'?'text-yellow-400':'text-white/10'}`}>{penA.name}</span>
              <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase mt-0.5">PENALIDADE</span>
            </div>
            <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-1.5">IPPON</span>
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrA[0]}</span>
                <span className="h-6 sm:h-8 w-px bg-white/[0.06]" />
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrA[1]}</span>
                <span className="h-6 sm:h-8 w-px bg-white/[0.06]" />
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrA[2]}</span>
              </div>
            </div>
          </div>

          {/* CENTER status */}
          <div className="px-3 sm:px-6 flex items-center justify-center py-3 sm:py-4">
            {osaeActive ? <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]" /><span className="text-xs sm:text-sm md:text-base font-black text-purple-400 uppercase tracking-[0.3em]">OSAE-KOMI</span></div>
            : isRunning ? <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" /><span className="text-xs sm:text-sm md:text-base font-black text-green-400 uppercase tracking-[0.3em]">LIVE</span></div>
            : done ? <span className="text-xs sm:text-sm md:text-base font-black text-white/10 uppercase tracking-[0.3em]">FIM</span>
            : <span className="text-xs sm:text-sm md:text-base font-black text-white/10 uppercase tracking-[0.3em]">PRONTO</span>}
          </div>

          {/* BLUE side stats */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-3 sm:py-4 border-l border-white/[0.04]">
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-1.5">IPPON</span>
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrB[0]}</span>
                <span className="h-6 sm:h-8 w-px bg-white/[0.06]" />
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrB[1]}</span>
                <span className="h-6 sm:h-8 w-px bg-white/[0.06]" />
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{ipponsArrB[2]}</span>
              </div>
            </div>
            <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
            <div className="flex flex-col items-center">
              <span className={`text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider ${penB.level==='hansoku'?'text-red-400':penB.level==='chui'?'text-amber-400':penB.level==='shido'?'text-yellow-400':'text-white/10'}`}>{penB.name}</span>
              <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase mt-0.5">PENALIDADE</span>
            </div>
            <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em]">VANTAGEM</span>
              <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums mt-0.5">{advantageB}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match info */}
      {currentMatch && (
        <div className="shrink-0 bg-[#0a0f1e] border-t border-white/[0.04] flex items-center justify-center py-1 sm:py-1.5 gap-3 sm:gap-4">
          <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">{rl(bracket?.state?.rounds ?? 0, currentMatch)} · MATCH {currentMatch.matchNumber}</span>
          {winnerReason && done && <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${winnerReason==='FUSEN_GACHI'?'text-amber-400':winnerReason==='KIKEN_GACHI'?'text-amber-400':winnerReason==='HANSOKU_MAKE'?'text-red-400':'text-white/30'}`}>{winnerReason==='FUSEN_GACHI'?'FUSEN-GACHI':winnerReason==='KIKEN_GACHI'?'KIKEN-GACHI':winnerReason==='HANSOKU_MAKE'?'HANSOKU-MAKE':winnerReason}</span>}
        </div>
      )}
    </div>
  );
};
export default DisplayAoVivo;
