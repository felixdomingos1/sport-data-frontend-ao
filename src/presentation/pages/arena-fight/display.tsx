import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function penaltyName(shidos: number): { name: string; level: "shido" | "chui" | "hansoku" } {
  if (shidos >= 6) return { name: "HANSOKU-MAKE", level: "hansoku" };
  if (shidos >= 3) return { name: "CHUI", level: "chui" };
  if (shidos >= 1) return { name: "SHIDO", level: "shido" };
  return { name: "-", level: "shido" };
}

const AngolaFlag = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size * (2 / 3)} viewBox="0 0 900 600" className="inline-block shrink-0">
    <rect width="900" height="300" fill="#cc092f" />
    <rect y="300" width="900" height="300" fill="#000000" />
    <g transform="translate(450,300)">
      <circle r="100" fill="#fcdd09" />
      <g transform="translate(-50,0)">
        <path d="M0,-30 C-40,10 -10,80 0,100 C10,80 40,10 0,-30Z" fill="#cc092f" />
        <rect x="-20" y="-20" width="40" height="40" rx="2" fill="#000000" />
        <path d="M0,-50 L35,20 L-35,20 Z" fill="#fcdd09" />
      </g>
    </g>
  </svg>
);

const PenaltyDots = ({ count, color }: { count: number; color: string }) => (
  <div className="flex gap-1.5">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
          i < Math.min(count, 6)
            ? color === 'red'
              ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
              : 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
            : 'border-white/10 bg-transparent'
        }`}
      />
    ))}
  </div>
);

const AdvantageDots = ({ count, color }: { count: number; color: string }) => (
  <div className="flex gap-1.5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-sm rotate-45 border transition-all duration-300 ${
          i < count
            ? color === 'red'
              ? 'bg-red-500 border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
              : 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.5)]'
            : 'border-white/10 bg-transparent'
        }`}
      />
    ))}
  </div>
);

const IpponBox = ({ filled, color }: { filled: boolean; color: 'red' | 'blue' }) => (
  <div
    className={`w-8 h-8 border-2 transition-all duration-300 ${
      filled
        ? color === 'red'
          ? 'border-red-500 bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
          : 'border-cyan-400 bg-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
        : 'border-white/10 bg-transparent'
    }`}
  />
);

function ArenaFightDisplay() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [advantageA, setAdvantageA] = useState(0);
  const [advantageB, setAdvantageB] = useState(0);
  const [shidosA, setShidosA] = useState(0);
  const [shidosB, setShidosB] = useState(0);
  const [ipponsA, setIpponsA] = useState(0);
  const [ipponsB, setIpponsB] = useState(0);
  const [penaltyAlert, setPenaltyAlert] = useState<{ side: 'red' | 'blue'; name: string } | null>(null);
  const [osaeKomiActive, setOsaeKomiActive] = useState(false);
  const [osaeKomiSide, setOsaeKomiSide] = useState<'red' | 'blue' | null>(null);
  const [osaeKomiSeconds, setOsaeKomiSeconds] = useState(0);
  const [osaeAlert, setOsaeAlert] = useState<{ side: 'red' | 'blue'; label: string } | null>(null);
  const osaeAutoIppon = useRef(false);
  const osaeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const penA = penaltyName(shidosA);
  const penB = penaltyName(shidosB);
  const isDQ_A = penA.level === 'hansoku';
  const isDQ_B = penB.level === 'hansoku';

  useEffect(() => {
    if (timerRunning && timerSeconds > 0 && !osaeKomiActive) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) { setTimerRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning, timerSeconds, osaeKomiActive]);

  useEffect(() => {
    if (osaeKomiActive) {
      osaeIntervalRef.current = setInterval(() => {
        setOsaeKomiSeconds((prev) => {
          const next = prev + 1;
          if (next >= 20 && !osaeAutoIppon.current) {
            osaeAutoIppon.current = true;
            setOsaeKomiActive(false);
            if (osaeKomiSide === 'red') {
              setIpponsA(3);
              setScoreA(v => v + 10);
            } else if (osaeKomiSide === 'blue') {
              setIpponsB(3);
              setScoreB(v => v + 10);
            }
            setOsaeAlert({ side: osaeKomiSide!, label: 'IPPON' });
            setTimeout(() => setOsaeAlert(null), 3000);
          } else if (next === 15) {
            setOsaeAlert({ side: osaeKomiSide!, label: 'WAZARI' });
            setTimeout(() => setOsaeAlert(null), 2000);
          } else if (next === 10) {
            setOsaeAlert({ side: osaeKomiSide!, label: 'YUKO' });
            setTimeout(() => setOsaeAlert(null), 2000);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (osaeIntervalRef.current) clearInterval(osaeIntervalRef.current); };
  }, [osaeKomiActive, osaeKomiSide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setTimerRunning(prev => !prev); return; }
      if (e.key === 'r') { setTimerSeconds(120); setTimerRunning(false); return; }
      switch (e.key) {
        case 'a': setScoreA(v => v + 2); break;
        case 'q': setScoreA(v => Math.max(0, v - 2)); break;
        case 'k': setScoreB(v => v + 2); break;
        case 'j': setScoreB(v => Math.max(0, v - 2)); break;
        case '1': setAdvantageA(v => v + 1); break;
        case '2': setAdvantageB(v => v + 1); break;
        case '3':
          if (!isDQ_A) {
            const next = shidosA + 1;
            setShidosA(next);
            setScoreB(v => v + 1);
            const info = penaltyName(next);
            setPenaltyAlert({ side: 'red', name: info.name });
            setTimeout(() => setPenaltyAlert(null), 3500);
          }
          break;
        case '4':
          if (!isDQ_B) {
            const next = shidosB + 1;
            setShidosB(next);
            setScoreA(v => v + 1);
            const info = penaltyName(next);
            setPenaltyAlert({ side: 'blue', name: info.name });
            setTimeout(() => setPenaltyAlert(null), 3500);
          }
          break;
        case '7': setIpponsA(v => Math.min(3, v + 1)); break;
        case '8': setIpponsB(v => Math.min(3, v + 1)); break;
        case 'o':
          if (osaeKomiActive) { stopOsaeKomi(); } else { startOsaeKomi('red'); }
          break;
        case 'p':
          if (osaeKomiActive) { stopOsaeKomi(); } else { startOsaeKomi('blue'); }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [osaeKomiActive, shidosA, shidosB, isDQ_A, isDQ_B]);

  const startOsaeKomi = (side: 'red' | 'blue') => {
    if (osaeKomiActive) return;
    setOsaeKomiActive(true);
    setOsaeKomiSide(side);
    setOsaeKomiSeconds(0);
    setTimerRunning(false);
    osaeAutoIppon.current = false;
    setOsaeAlert({ side, label: 'OSAE-KOMI' });
    setTimeout(() => setOsaeAlert(null), 2500);
  };

  const stopOsaeKomi = () => {
    if (!osaeKomiActive) return;
    setOsaeKomiActive(false);
    const elapsed = osaeKomiSeconds;
    if (elapsed >= 20) return;
    if (elapsed >= 15) {
      if (osaeKomiSide === 'red') setScoreA(v => v + 7);
      else setScoreB(v => v + 7);
    } else if (elapsed >= 10) {
      if (osaeKomiSide === 'red') setScoreA(v => v + 5);
      else setScoreB(v => v + 5);
    }
    setOsaeKomiSide(null);
    setOsaeKomiSeconds(0);
  };

  return (
    <div className="w-screen h-screen bg-[#060b14] text-white overflow-hidden flex flex-col font-sans select-none">
      {/* Top info bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#0a0f1e] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">ANGOLA JIU-JITSU FEDERATION</span>
        </div>
        <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">
          Adulto &bull; Masculino &bull; -76 KG &bull; FINAL
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">ANGOLA JIU-JITSU CHAMPIONSHIP 2026</span>
      </div>

      {/* ARENA FIGHT Logo */}
      <div className="flex justify-center py-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border-2 border-white/80 flex items-center justify-center">
            <div className="w-4 h-4 border border-white/80 rotate-45" />
          </div>
          <span className="text-sm font-black text-white/60 tracking-[0.3em] uppercase">ARENA FIGHT</span>
        </div>
      </div>

      {/* Main Scoreboard */}
      <div className="flex-1 flex items-stretch min-h-0 px-4">
        {/* Athlete A - RED */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.03] to-transparent pointer-events-none" />
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />
          <AnimatePresence>
            {penaltyAlert?.side === 'red' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-red-500/10"
              >
                <motion.span
                  className="text-8xl font-black text-red-400 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  {penaltyAlert.name}
                </motion.span>
              </motion.div>
            )}
            {osaeAlert?.side === 'red' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-purple-500/10"
              >
                <motion.span className="text-7xl font-black text-purple-400 drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                  {osaeAlert.label}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-3">
            <div>
              <h2 className={`text-5xl font-black tracking-tight leading-none transition-colors ${isDQ_A ? 'text-red-500/70 line-through' : 'text-white'}`}>JOÃO SILVA</h2>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <AngolaFlag size={20} />
                <span className="text-xs font-bold text-white/30 uppercase tracking-[0.15em]">ANGOLA</span>
              </div>
            </div>

            {isDQ_A && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-[0.15em]">
                HANSOKU-MAKE
              </motion.div>
            )}

            <div className="space-y-4 mt-6">
              <div className="text-center">
                <span className="text-[10px] font-bold text-red-400/60 uppercase tracking-[0.2em] block mb-0.5">Pontos</span>
                <span className={`text-7xl font-black tabular-nums leading-none drop-shadow-[0_0_20px_rgba(248,113,113,0.3)] ${isDQ_A ? 'text-red-400/30' : 'text-red-400'}`}>
                  {scoreA}
                </span>
              </div>

              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-white/15 uppercase tracking-[0.15em] block mb-1">Vantagem</span>
                  <AdvantageDots count={advantageA} color="red" />
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-white/15 uppercase tracking-[0.15em] block mb-1">Penalidade</span>
                  <span className={`text-xs font-black uppercase ${
                    penA.level === 'hansoku' ? 'text-red-400' :
                    penA.level === 'chui' ? 'text-amber-400' :
                    penA.level === 'shido' ? 'text-yellow-400' :
                    'text-white/15'
                  }`}>
                    {penA.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Timer & VS */}
        <div className="flex flex-col items-center justify-center px-4 shrink-0">
          {osaeKomiActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center"
            >
              <span className="text-[10px] font-black text-purple-400/60 uppercase tracking-[0.2em] block">OSAE-KOMI</span>
              <span className="text-4xl font-black text-purple-400 tabular-nums drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                {osaeKomiSeconds}s
              </span>
              <div className="flex justify-center gap-1.5 mt-1">
                {osaeKomiSeconds >= 10 && <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">YUKO</span>}
                {osaeKomiSeconds >= 15 && <span className="text-[9px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">WAZARI</span>}
              </div>
            </motion.div>
          )}

          {/* Timer */}
          <div className="text-center">
            <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] block mb-1">Tempo</span>
            <div className={`text-8xl font-black tabular-nums leading-none tracking-tight ${timerRunning ? 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]' : timerSeconds === 0 ? 'text-red-400 drop-shadow-[0_0_30px_rgba(248,113,113,0.4)]' : 'text-white/90'}`}>
              {formatTime(timerSeconds)}
            </div>
          </div>

          {/* VS Divider */}
          <div className="w-full flex items-center justify-center gap-3 my-3">
            <div className="w-12 h-px bg-white/10" />
            <span className="text-sm font-black text-white/10 tracking-[0.3em]">VS</span>
            <div className="w-12 h-px bg-white/10" />
          </div>

          {/* Center footer info */}
          <div className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] text-center">
            FINAL
          </div>
        </div>

        {/* Athlete B - BLUE/CYAN */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/[0.03] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
          <AnimatePresence>
            {penaltyAlert?.side === 'blue' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-cyan-500/10"
              >
                <motion.span
                  className="text-8xl font-black text-cyan-400 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  {penaltyAlert.name}
                </motion.span>
              </motion.div>
            )}
            {osaeAlert?.side === 'blue' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none bg-purple-500/10"
              >
                <motion.span className="text-7xl font-black text-purple-400 drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                  {osaeAlert.label}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-3">
            <div>
              <h2 className={`text-5xl font-black tracking-tight leading-none transition-colors ${isDQ_B ? 'text-red-500/70 line-through' : 'text-white'}`}>CARLOS MANUEL</h2>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <AngolaFlag size={20} />
                <span className="text-xs font-bold text-white/30 uppercase tracking-[0.15em]">ANGOLA</span>
              </div>
            </div>

            {isDQ_B && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 uppercase tracking-[0.15em]">
                HANSOKU-MAKE
              </motion.div>
            )}

            <div className="space-y-4 mt-6">
              <div className="text-center">
                <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.2em] block mb-0.5">Pontos</span>
                <span className={`text-7xl font-black tabular-nums leading-none drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] ${isDQ_B ? 'text-cyan-400/30' : 'text-cyan-400'}`}>
                  {scoreB}
                </span>
              </div>

              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-white/15 uppercase tracking-[0.15em] block mb-1">Vantagem</span>
                  <AdvantageDots count={advantageB} color="blue" />
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-white/15 uppercase tracking-[0.15em] block mb-1">Penalidade</span>
                  <span className={`text-xs font-black uppercase ${
                    penB.level === 'hansoku' ? 'text-red-400' :
                    penB.level === 'chui' ? 'text-amber-400' :
                    penB.level === 'shido' ? 'text-yellow-400' :
                    'text-white/15'
                  }`}>
                    {penB.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Penalties & IP */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#080d18]">
        <div className="flex items-stretch">
          <div className="flex-1 flex items-center justify-center gap-6 py-3 border-r border-white/[0.04]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-red-400/50 uppercase tracking-[0.15em]">Penalidades</span>
              <div className="flex flex-col items-center">
                <span className={`text-sm font-black uppercase ${
                  penA.level === 'hansoku' ? 'text-red-400' :
                  penA.level === 'chui' ? 'text-amber-400' :
                  penA.level === 'shido' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{penA.name}</span>
                <span className="text-[9px] text-white/10">{shidosA} shido</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/15 uppercase tracking-[0.15em]">IP</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <IpponBox key={i} filled={i < ipponsA} color="red" />
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 flex items-center justify-center py-3">
            <div className="flex items-center gap-2">
              {osaeKomiActive ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                  <span className="text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.3em]">OSAE-KOMI</span>
                </>
              ) : timerRunning ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                  <span className="text-[10px] font-bold text-green-400/60 uppercase tracking-[0.3em]">LIVE</span>
                </>
              ) : timerSeconds === 0 ? (
                <span className="text-[10px] font-bold text-red-400/40 uppercase tracking-[0.3em]">FIM</span>
              ) : (
                <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">PRONTO</span>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6 py-3 border-l border-white/[0.04]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-cyan-400/50 uppercase tracking-[0.15em]">Penalidades</span>
              <div className="flex flex-col items-center">
                <span className={`text-sm font-black uppercase ${
                  penB.level === 'hansoku' ? 'text-red-400' :
                  penB.level === 'chui' ? 'text-amber-400' :
                  penB.level === 'shido' ? 'text-yellow-400' :
                  'text-cyan-400'
                }`}>{penB.name}</span>
                <span className="text-[9px] text-white/10">{shidosB} shido</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/15 uppercase tracking-[0.15em]">IP</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <IpponBox key={i} filled={i < ipponsB} color="blue" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="shrink-0 bg-[#0a0f1e] border-t border-white/[0.06] flex items-center px-6 py-1.5 gap-4 overflow-x-auto">
        <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] shrink-0">Teclas</span>
        <span className="text-[9px] text-white/10 shrink-0">Espaço: Pausar</span>
        <span className="text-white/[0.04]">|</span>
        <span className="text-[9px] text-white/10 shrink-0">R: Reset</span>
        <span className="text-white/[0.04]">|</span>
        <span className="text-[9px] text-white/10 shrink-0">A/Q: Pts Verm</span>
        <span className="text-white/[0.04]">|</span>
        <span className="text-[9px] text-white/10 shrink-0">K/J: Pts Azul</span>
        <span className="text-white/[0.04]">|</span>
        <span className="text-[9px] text-white/10 shrink-0">3/4: Shido</span>
        <span className="text-white/[0.04]">|</span>
        <span className="text-[9px] text-white/10 shrink-0">O/P: Osae-Komi</span>
        <div className="flex-1" />
        {timerRunning ? (
          <button onClick={() => setTimerRunning(false)} className="text-[10px] font-bold text-amber-400/50 hover:text-amber-400 uppercase tracking-[0.15em] px-2 py-0.5 rounded border border-amber-400/20 hover:border-amber-400/40 transition-colors">Pausar</button>
        ) : (
          <button onClick={() => setTimerRunning(true)} className="text-[10px] font-bold text-green-400/50 hover:text-green-400 uppercase tracking-[0.15em] px-2 py-0.5 rounded border border-green-400/20 hover:border-green-400/40 transition-colors">Iniciar</button>
        )}
        <button onClick={() => { setTimerSeconds(120); setTimerRunning(false); }} className="text-[10px] font-bold text-white/20 hover:text-white/50 uppercase tracking-[0.15em] px-2 py-0.5 rounded border border-white/[0.08] hover:border-white/20 transition-colors">Reset</button>
      </div>
    </div>
  );
}

export default ArenaFightDisplay;
