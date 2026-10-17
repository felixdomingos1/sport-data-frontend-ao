import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { competicaoService } from '../../../infrastructure/services/competicao.service';
import { bracketService } from '../../../infrastructure/services/bracket.service';
import type { Campeonato } from '../../../core/types/api.types';
import type { BracketDto, BracketSummary, BracketMatch } from '../../../core/types/bracket.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const WS = API.replace(/\/api\/v1\/?$/, '');
const LAST_DISPLAY_KEY = 'arena:last-match-context';

function np(id?: string | null, p?: BracketDto['participantes']): string { if (!id) return 'TBD'; return p?.find(x => x.id === id)?.nome ?? id }
function rl(tr: number, m: BracketMatch): string { if (m.isBronze) return '3° Lugar'; if (m.isFinal) return 'Final'; return `R${m.round}` }
function formatTime(sec: number) { const m = Math.floor(sec / 60); const s = sec % 60; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` }
function penaltyName(s: number, c: number): { name: string; level: 'shido' | 'chui' | 'hansoku' | 'none' } { if (c >= 2 || s >= 6) return { name: 'HANSOKU-MAKE', level: 'hansoku' }; if (c >= 1) return { name: 'CHUI', level: 'chui' }; if (s >= 1) return { name: 'SHIDO', level: 'shido' }; return { name: '-', level: 'none' } }
const PARTE_LABEL: Record<number, string> = { 1: 'ATEMI', 2: 'PROJEÇÕES', 3: 'SOLO' };

const AngolaFlag = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size * (2 / 3)} viewBox="0 0 900 600" className="inline-block shrink-0">
    <rect width="900" height="300" fill="#cc092f" /><rect y="300" width="900" height="300" fill="#000000" />
    <g transform="translate(450,300)"><circle r="100" fill="#fcdd09" /><g transform="translate(-50,0)"><path d="M0,-30 C-40,10 -10,80 0,100 C10,80 40,10 0,-30Z" fill="#cc092f" /><rect x="-20" y="-20" width="40" height="40" rx="2" fill="#000000" /><path d="M0,-50 L35,20 L-35,20 Z" fill="#fcdd09" /></g></g>
  </svg>
);

const DisplayAoVivo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationState = (useLocation().state as any) ?? null;
  const [campeonato, setCampeonato] = useState<Campeonato | null>(null);
  const [brackets, setBrackets] = useState<BracketSummary[]>([]);
  const [bracketsMap, setBracketsMap] = useState<Record<string, BracketDto>>({});
  const [mode, setMode] = useState<'loading' | 'board' | 'match' | 'unknown'>('loading');
  const [bracketId, setBracketId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [liveScores, setLiveScores] = useState<Record<string, any>>({});
  const [localTimer, setLocalTimer] = useState<number | null>(null);
  const [centerAlert, setCenterAlert] = useState<{ text: string; color: string; side?: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const neededRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!id) { setMode('board'); return }
    let dead = false;
    competicaoService.getCampeonatoById(id)
      .then(c => { if (dead) return; setCampeonato(c); setMode('board') })
      .catch(() => {
        if (dead) return;
        let ctx: any = locationState ?? null;
        if (!ctx?.matchId) { try { const raw = sessionStorage.getItem(LAST_DISPLAY_KEY); if (raw) ctx = JSON.parse(raw) } catch { /* ignore */ } }
        if (ctx && ctx.matchId === id) {
          if (ctx.campeonatoId) competicaoService.getCampeonatoById(ctx.campeonatoId).then(c => { if (!dead) setCampeonato(c) }).catch(() => {});
          setBracketId(ctx.bracketId ?? null);
          setMode('match');
        } else setMode('unknown');
      });
    return () => { dead = true };
  }, [id]);

  useEffect(() => {
    if (!bracketId) return;
    let dead = false;
    bracketService.obter(bracketId)
      .then(dto => { if (dead) return; setBracketsMap(prev => ({ ...prev, [dto.id]: dto })) })
      .catch(() => { if (!dead) setMode('unknown') });
    return () => { dead = true };
  }, [bracketId]);

  useEffect(() => {
    if (mode !== 'board' || !campeonato) return;
    let dead = false;
    bracketService.listarPorCampeonato(campeonato.id).then(brs => {
      if (dead) return;
      setBrackets(brs);
      Promise.all(brs.map(b => bracketService.obter(b.id).catch(() => null as any))).then(dtos => {
        if (dead) return;
        const m: Record<string, BracketDto> = {};
        for (const d of dtos) if (d) m[d.id] = d;
        setBracketsMap(m);
      });
    }).catch(() => {});
    return () => { dead = true };
  }, [mode, campeonato]);

  useEffect(() => {
    if (mode !== 'board' || brackets.length === 0) return;
    const i = setInterval(() => {
      for (const b of brackets) bracketService.obter(b.id).then(d => setBracketsMap(prev => (prev[d.id] ? { ...prev, [d.id]: d } : prev))).catch(() => {});
    }, 10000);
    return () => clearInterval(i);
  }, [mode, brackets]);

  useEffect(() => {
    const s = io(WS, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 50, reconnectionDelay: 500 });
    socketRef.current = s;
    s.on('connect', () => { setConnected(true); for (const k of neededRef.current) s.emit('join_bracket', { bracketId: k }) });
    s.on('disconnect', () => setConnected(false));
    s.on('fight:update', (p: any) => {
      setLiveScores(prev => ({ ...prev, [p.matchId]: p }));
      if (p.actionAlert) { setCenterAlert({ text: p.actionAlert.text, color: p.actionAlert.color, side: p.actionAlert.side }); setTimeout(() => setCenterAlert(null), 4000) }
    });
    s.on('bracket:atualizado', (p: any) => {
      setBracketsMap(prev => {
        const cur = prev[p.bracketId];
        if (!cur) return prev;
        return { ...prev, [p.bracketId]: { ...cur, state: p.state, statistics: p.statistics, status: p.state.status } };
      });
    });
    return () => { s.disconnect() };
  }, []);

  useEffect(() => {
    const set = new Set<string>();
    if (mode === 'match' && bracketId) set.add(bracketId);
    if (mode === 'board') for (const k of Object.keys(bracketsMap)) set.add(k);
    neededRef.current = set;
    const s = socketRef.current;
    if (s?.connected) for (const k of set) s.emit('join_bracket', { bracketId: k });
  }, [mode, bracketId, bracketsMap, connected]);

  useEffect(() => { const i = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(i) }, []);
  const toggleFS = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {}); setFullscreen(true) } else { document.exitFullscreen().catch(() => {}); setFullscreen(false) } };
  useEffect(() => { const h = () => { if (!document.fullscreenElement) setFullscreen(false) }; document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h) }, []);

  const bracket = mode === 'match' && bracketId ? (bracketsMap[bracketId] ?? null) : null;
  const currentMatch = bracket && id ? bracket.state.matches.find(m => m.id === id) ?? null : null;

  const live = currentMatch ? liveScores[currentMatch.id] : null;

  useEffect(() => {
    if (!currentMatch || currentMatch.status === 'FINALIZADA') { setLocalTimer(null); return }
    if (live?.osaeKomiActive) return
    const provided = live?.timerSeconds;
    const running = live?.timerRunning;
    const meta = (currentMatch.metadata ?? {}) as any;
    if (provided !== undefined) {
      setLocalTimer(provided);
      if (running === false || provided <= 0) return;
      const i = setInterval(() => setLocalTimer(prev => { if (prev === null || prev <= 0) { clearInterval(i); return 0 } return prev - 1 }), 1000);
      return () => clearInterval(i);
    }
    if (currentMatch.status === 'EM_ANDAMENTO' && meta.startTime && meta.duracao) {
      const elapsed = Math.floor((Date.now() - meta.startTime) / 1000);
      const remaining = Math.max(0, meta.duracao - elapsed);
      setLocalTimer(remaining);
      if (remaining <= 0) return;
      const i = setInterval(() => setLocalTimer(prev => { if (prev === null || prev <= 0) { clearInterval(i); return 0 } return prev - 1 }), 1000);
      return () => clearInterval(i);
    }
    setLocalTimer(null);
  }, [currentMatch?.id, currentMatch?.status, live?.osaeKomiActive, live?.timerRunning, live?.timerSeconds]);

  const activeMatches = useMemo(() => {
    const arr: Array<{ bracket: BracketDto; match: BracketMatch }> = [];
    for (const b of Object.values(bracketsMap)) {
      for (const m of b.state.matches) {
        if (m.isBye || m.status === 'FINALIZADA' || m.status === 'WO' || m.status === 'DESCLASSIFICADA' || m.status === 'CANCELADA') continue;
        if (!m.participantA || !m.participantB) continue;
        const l = liveScores[m.id];
        if (l?.started === true || m.status === 'EM_ANDAMENTO') arr.push({ bracket: b, match: m });
      }
    }
    arr.sort((x, y) => x.bracket.id.localeCompare(y.bracket.id) || x.match.matchNumber - y.match.matchNumber);
    return arr;
  }, [bracketsMap, liveScores]);

  const openMatch = (bid: string, m: BracketMatch) => {
    const ctx = { campeonatoId: campeonato?.id ?? (mode === 'match' && bracket ? bracket.campeonatoId : null), bracketId: bid, matchId: m.id };
    try { sessionStorage.setItem(LAST_DISPLAY_KEY, JSON.stringify(ctx)) } catch { /* ignore */ }
    navigate(`/display/${m.id}`, { state: ctx });
  };

  const backToCampeonato = () => {
    const cid = campeonato?.id ?? (mode === 'match' && bracket ? bracket.campeonatoId : null);
    if (cid) navigate(`/display/${cid}`);
  };

  if (mode === 'loading') return <div className="h-screen bg-[#060b14] flex items-center justify-center"><SportLoadingScreen message="A carregar..." size="md" /></div>;

  if (mode === 'unknown') {
    return (
      <div className="h-screen bg-[#060b14] text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-16 sm:w-24 h-16 sm:h-24 border-2 border-white/[0.06] flex items-center justify-center"><div className="w-8 sm:w-12 h-8 sm:h-12 border border-white/[0.06] rotate-45" /></div>
        <p className="text-white/30 text-center">Não foi possível identificar esta luta.</p>
        <Link to="/display" className="px-5 py-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-black uppercase tracking-widest hover:bg-cyan-400/20 transition-colors">Escolher campeonato</Link>
      </div>
    );
  }

  if (mode === 'board') {
    return (
      <div className="h-screen bg-[#060b14] text-white overflow-hidden flex flex-col font-sans select-none">
        <div className="flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 bg-[#0a0f1e] border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0"><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/60 flex items-center justify-center"><div className="w-2 sm:w-2.5 h-2 sm:h-2.5 border border-white/60 rotate-45" /></div><span className="text-[9px] sm:text-xs font-black text-white/40 tracking-[0.2em] uppercase hidden sm:inline">ARENA FIGHT</span></div>
            <span className="text-[8px] sm:text-[10px] font-bold text-white/15 uppercase tracking-[0.15em] truncate max-w-[220px] sm:max-w-[420px]">{campeonato?.nome ?? ''}</span>
            {activeMatches.length > 1 && <span className="text-[8px] sm:text-[10px] font-black text-green-400/70 uppercase tracking-[0.15em] shrink-0">{activeMatches.length} ao vivo</span>}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-[9px] sm:text-xs text-white/15 font-mono tabular-nums">{clock.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
            <Link to="/display" className="text-[8px] sm:text-[10px] font-bold text-white/25 hover:text-white/50 uppercase tracking-widest transition-colors">Sair</Link>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
            <button onClick={toggleFS} className="text-white/20 hover:text-white/50 transition-colors p-0.5">{fullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8 text-center">
              <p className="text-[10px] sm:text-xs font-black text-white/25 uppercase tracking-[0.3em] mb-2">Seleciona a partida a decorrer</p>
              <h1 className="text-2xl sm:text-4xl font-black text-white truncate">{campeonato?.nome ?? 'Ecrã de Resultados'}</h1>
            </div>
            {activeMatches.length === 0 ? (
              <div className="py-16 text-center text-white/[0.06]">
                <div className="w-16 sm:w-28 h-16 sm:h-28 mx-auto mb-4 border-2 border-white/[0.04] flex items-center justify-center"><div className="w-8 sm:w-14 h-8 sm:h-14 border border-white/[0.04] rotate-45" /></div>
                <p className="text-base sm:text-xl font-black uppercase">A aguardar lutas ao vivo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {activeMatches.map(({ bracket: b, match: m }) => {
                  const l = liveScores[m.id];
                  const isRunning = l?.timerRunning === true || (l?.timerRunning === undefined && m.status === 'EM_ANDAMENTO');
                  const tempo = l?.timerSeconds !== undefined ? formatTime(l.timerSeconds) : null;
                  return (
                    <motion.button
                      key={`${b.id}:${m.id}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => openMatch(b.id, m)}
                      className="group text-left rounded-2xl border-2 border-white/[0.08] bg-white/[0.03] hover:border-cyan-400/40 hover:bg-white/[0.05] transition-all p-4 sm:p-6 active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                        <span className="text-[8px] sm:text-[10px] font-black text-white/25 uppercase tracking-[0.15em] truncate">{b.nome} · {rl(b.state?.rounds ?? b.rounds, m)} · M{m.matchNumber}</span>
                        <span className={`flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 ${isRunning ? 'text-green-400' : 'text-white/25'}`}>{isRunning ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Ao vivo</> : 'Pausado'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-base sm:text-2xl font-black text-red-400 truncate">{np(m.participantA, b.participantes)}</p>
                          <p className="text-2xl sm:text-4xl font-black tabular-nums mt-1">{l?.scoreA ?? m.scoreA ?? 0} <span className="text-white/15 font-bold text-xs sm:text-sm">PTS</span></p>
                        </div>
                        <div className="flex flex-col items-center px-1 sm:px-2">
                          <span className="text-[8px] sm:text-[10px] text-white/15 font-black uppercase">Tempo</span>
                          <span className={`text-2xl sm:text-4xl font-black tabular-nums ${isRunning ? 'text-white' : 'text-white/50'}`}>{tempo ?? '--:--'}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-base sm:text-2xl font-black text-cyan-400 truncate">{np(m.participantB, b.participantes)}</p>
                          <p className="text-2xl sm:text-4xl font-black tabular-nums mt-1">{l?.scoreB ?? m.scoreB ?? 0} <span className="text-white/15 font-bold text-xs sm:text-sm">PTS</span></p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/[0.05] text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400/60 group-hover:text-cyan-400">Abrir no ecrã →</div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const meta = (currentMatch?.metadata ?? {}) as any;
  const p = bracket?.participantes ?? [];
  const ipponsArrA = (live?.ipponsA) ?? (meta?.ipponsA as number[]) ?? [0, 0, 0];
  const ipponsArrB = (live?.ipponsB) ?? (meta?.ipponsB as number[]) ?? [0, 0, 0];
  const wazaariA = live?.wazaariA ?? meta?.wazaariA ?? 0; const wazaariB = live?.wazaariB ?? meta?.wazaariB ?? 0;
  const shidosA = live?.shidosA ?? meta?.shidosA ?? 0; const shidosB = live?.shidosB ?? meta?.shidosB ?? 0;
  const chuisA = live?.chuisA ?? meta?.chuisA ?? 0; const chuisB = live?.chuisB ?? meta?.chuisB ?? 0;
  const parteAtual: 1 | 2 | 3 = live?.parteAtual ?? meta?.parteAtual ?? 1;
  const parteNome = PARTE_LABEL[parteAtual];
  const medActive = live?.medicalActive ?? false;
  const penA = penaltyName(shidosA, chuisA); const penB = penaltyName(shidosB, chuisB);
  const done = currentMatch?.status === 'FINALIZADA' || currentMatch?.status === 'WO' || currentMatch?.status === 'DESCLASSIFICADA';
  const isWA = currentMatch?.winnerId === currentMatch?.participantA; const isWB = currentMatch?.winnerId === currentMatch?.participantB;
  const isRunning = !done && (live?.timerRunning ?? currentMatch?.status === 'EM_ANDAMENTO');
  const isStarted = live?.started ?? currentMatch?.status === 'EM_ANDAMENTO';
  const isDQ_A = penA.level === 'hansoku'; const isDQ_B = penB.level === 'hansoku';
  const osaeActive = live?.osaeKomiActive ?? false; const osaeSecs = live?.osaeKomiSeconds ?? 0;
  const scoreA = live?.scoreA ?? currentMatch?.scoreA ?? 0; const scoreB = live?.scoreB ?? currentMatch?.scoreB ?? 0;
  const winnerReason = meta?.pontoTipo ?? 'PONTOS';
  const displayTempo = currentMatch?.tempo && currentMatch.tempo !== '--:--' ? currentMatch.tempo : localTimer !== null ? formatTime(localTimer) : (currentMatch?.tempo ?? '--:--');

  return (
    <div className="h-screen bg-[#060b14] text-white overflow-hidden flex flex-col font-sans select-none">
      <div className="flex items-center justify-between px-3 sm:px-6 py-1 sm:py-1.5 bg-[#0a0f1e] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={backToCampeonato} className="flex items-center gap-1.5 text-white/25 hover:text-white/60 transition-colors p-1 -ml-1"><ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /><span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Lutas</span></button>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0"><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/60 flex items-center justify-center"><div className="w-2 sm:w-2.5 h-2 sm:h-2.5 border border-white/60 rotate-45" /></div><span className="text-[9px] sm:text-xs font-black text-white/40 tracking-[0.2em] uppercase hidden sm:inline">ARENA FIGHT</span></div>
          <span className="text-[8px] sm:text-[10px] font-bold text-white/15 uppercase tracking-[0.15em] truncate max-w-[200px] sm:max-w-[400px]">{campeonato?.nome ?? bracket?.nome ?? ''}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span className="text-[9px] sm:text-xs text-white/15 font-mono tabular-nums">{clock.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
          <button onClick={toggleFS} className="text-white/20 hover:text-white/50 transition-colors p-0.5">{fullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}</button>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-3 sm:p-6 lg:p-8 relative overflow-hidden">
        <AnimatePresence>
          {centerAlert && (
            <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <motion.span className={`text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tight drop-shadow-[0_0_60px_rgba(255,255,255,0.3)] ${centerAlert.color}`}>{centerAlert.text}</motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {!bracket || !currentMatch ? (
          <div className="h-full flex items-center justify-center"><SportLoadingScreen message="A abrir a luta..." size="sm" /></div>
        ) : (
          <div className="flex-1 flex items-stretch min-h-0 h-full">
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.03] to-transparent pointer-events-none" />
              <div className="text-center space-y-2 sm:space-y-4">
                <div>
                  <h2 className={`text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight px-2 text-center ${isDQ_A ? 'text-red-500/70 line-through' : isWA ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]' : done && currentMatch.winnerId ? 'text-white/15' : 'text-white'}`}>{isWA && !isDQ_A ? '🏆 ' : ''}{np(currentMatch.participantA, p)}</h2>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1"><AngolaFlag size={14} /><span className="text-[8px] sm:text-xs font-bold text-white/20 uppercase tracking-[0.15em]">ANGOLA</span></div>
                </div>
                {isDQ_A && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-xs sm:text-base font-black text-red-400 bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-[0.15em]">HANSOKU-MAKE</motion.div>}
                <div>
                  <span className="text-[9px] sm:text-xs font-bold text-red-400/50 uppercase tracking-[0.2em] block mb-0.5">PONTOS</span>
                  <span className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tabular-nums leading-none ${isDQ_A ? 'text-red-400/30' : isWA ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]'}`}>{scoreA}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-2 sm:px-4 lg:px-6 shrink-0">
              {osaeActive && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 sm:mb-2 p-1.5 sm:p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                  <span className="text-[9px] sm:text-xs font-black text-purple-400/60 uppercase tracking-[0.2em] block">OSAE-KOMI</span>
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-400 tabular-nums drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">{osaeSecs}s</span>
                  <div className="flex justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">{osaeSecs >= 10 && <span className="text-[7px] sm:text-[9px] font-bold text-orange-400 bg-orange-400/10 px-1 sm:px-1.5 py-0.5 rounded">WAZA-ARI</span>}{osaeSecs >= 15 && <span className="text-[7px] sm:text-[9px] font-bold text-red-400 bg-red-400/10 px-1 sm:px-1.5 py-0.5 rounded animate-pulse">IPPON</span>}</div>
                </motion.div>
              )}
              {medActive && !osaeActive && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1 sm:mb-2 p-1.5 sm:p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <span className="text-[9px] sm:text-xs font-black text-blue-400 uppercase tracking-[0.2em]">TEMPO MÉDICO</span>
                </motion.div>
              )}
              {done ? (
                <div className="text-center space-y-2 sm:space-y-3">
                  <span className="text-[10px] sm:text-sm font-bold text-white/30 uppercase tracking-[0.3em] block">TEMPO FINAL</span>
                  <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/15 tabular-nums leading-none">{displayTempo}</div>
                  <div className="text-base sm:text-xl md:text-2xl font-black text-green-500/60 uppercase tracking-[0.2em]">{winnerReason === 'FUSEN_GACHI' ? 'FUSEN-GACHI' : winnerReason === 'KIKEN_GACHI' ? 'KIKEN-GACHI' : winnerReason === 'HANSOKU_MAKE' ? 'DESCLASSIFICADO' : winnerReason === 'FULL_IPPON' ? 'FULL IPPON' : 'FINALIZADO'}</div>
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
              {!done && isStarted && (
                <div className="mb-1 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                  <span className="text-[8px] sm:text-[11px] font-black text-cyan-400 uppercase tracking-[0.15em]">PARTE {parteAtual} · {parteNome}</span>
                </div>
              )}
              <div className="text-[8px] sm:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] text-center">{bracket.nome} · {rl(bracket.state.rounds, currentMatch)}</div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/[0.03] to-transparent pointer-events-none" />
              <div className="text-center space-y-2 sm:space-y-4">
                <div>
                  <h2 className={`text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight px-2 text-center ${isDQ_B ? 'text-red-500/70 line-through' : isWB ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]' : done && currentMatch.winnerId ? 'text-white/15' : 'text-white'}`}>{isWB && !isDQ_B ? '🏆 ' : ''}{np(currentMatch.participantB, p)}</h2>
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
        )}
      </div>

      {bracket && currentMatch && (
        <>
          <div className="shrink-0 border-t border-white/[0.06] bg-[#080d18]">
            <div className="flex items-stretch">
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-3 sm:py-4 border-r border-white/[0.04]">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em]">WAZA-ARI</span>
                  <span className="text-lg sm:text-2xl md:text-3xl font-black text-orange-400 tabular-nums mt-0.5">{wazaariA}</span>
                </div>
                <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
                <div className="flex flex-col items-center">
                  <span className={`text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider ${penA.level === 'hansoku' ? 'text-red-400' : penA.level === 'chui' ? 'text-amber-400' : penA.level === 'shido' ? 'text-yellow-400' : 'text-white/10'}`}>{penA.name}</span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase mt-0.5">PENALIDADE {shidosA > 0 && `· ${shidosA} SHIDO`}</span>
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
              <div className="px-3 sm:px-6 flex items-center justify-center py-3 sm:py-4">
                {osaeActive ? <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]" /><span className="text-xs sm:text-sm md:text-base font-black text-purple-400 uppercase tracking-[0.3em]">OSAE-KOMI</span></div>
                  : medActive ? <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.6)]" /><span className="text-xs sm:text-sm md:text-base font-black text-blue-400 uppercase tracking-[0.3em]">MÉDICO</span></div>
                  : isRunning ? <div className="flex items-center gap-1.5 sm:gap-2"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" /><span className="text-xs sm:text-sm md:text-base font-black text-green-400 uppercase tracking-[0.3em]">LIVE</span></div>
                  : done ? <span className="text-xs sm:text-sm md:text-base font-black text-white/10 uppercase tracking-[0.3em]">FIM</span>
                  : <span className="text-xs sm:text-sm md:text-base font-black text-white/10 uppercase tracking-[0.3em]">PRONTO</span>}
              </div>
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
                  <span className={`text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider ${penB.level === 'hansoku' ? 'text-red-400' : penB.level === 'chui' ? 'text-amber-400' : penB.level === 'shido' ? 'text-yellow-400' : 'text-white/10'}`}>{penB.name}</span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase mt-0.5">PENALIDADE {shidosB > 0 && `· ${shidosB} SHIDO`}</span>
                </div>
                <div className="h-10 sm:h-14 w-px bg-white/[0.04]" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.15em]">WAZA-ARI</span>
                  <span className="text-lg sm:text-2xl md:text-3xl font-black text-orange-400 tabular-nums mt-0.5">{wazaariB}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 bg-[#0a0f1e] border-t border-white/[0.04] flex items-center justify-center py-1 sm:py-1.5 gap-3 sm:gap-4">
            <span className="text-[9px] sm:text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">{rl(bracket?.state?.rounds ?? 0, currentMatch)} · MATCH {currentMatch.matchNumber}</span>
            {winnerReason && done && <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${winnerReason === 'FUSEN_GACHI' ? 'text-amber-400' : winnerReason === 'KIKEN_GACHI' ? 'text-amber-400' : winnerReason === 'HANSOKU_MAKE' ? 'text-red-400' : winnerReason === 'FULL_IPPON' ? 'text-green-400' : 'text-white/30'}`}>{winnerReason === 'FUSEN_GACHI' ? 'FUSEN-GACHI' : winnerReason === 'KIKEN_GACHI' ? 'KIKEN-GACHI' : winnerReason === 'HANSOKU_MAKE' ? 'HANSOKU-MAKE' : winnerReason === 'FULL_IPPON' ? 'FULL IPPON' : winnerReason}</span>}
          </div>
        </>
      )}
    </div>
  );
};
export default DisplayAoVivo;