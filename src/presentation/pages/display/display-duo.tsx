import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { jujitsuDuoService, type DisplayDuo } from '@/infrastructure/services/jujitsu-duo.service';
import { atletasEquipa, nomeEquipa } from '@/presentation/components/jujitsu-duo/equipa';
import { joinCampeonato, leaveCampeonato, onDuoDisplay } from '@/infrastructure/services/socket.service';

/**
 * Ecrã da competição Ju-Jitsu Duo (projeção na arena), inspirado no placar Duo da JJIF:
 * área, categoria, bloco com a pontuação (cor da equipa) e posição, nomes da dupla,
 * linha A1…An / VRT / TOT e o detalhe por parte do último ataque pontuado.
 * Cada ataque só aparece quando todos os júris o pontuaram.
 */

const RECARGA_MS = 10_000;

const BLOCO = {
  VERMELHO: '#d65a63',
  AZUL: '#3b6fd6',
  SERIE: '#2a8f84',
};

function BandeiraAngola({ className = '' }: { className?: string }) {
  // Bandeira de Angola simplificada: meia roda dentada, catana e estrela
  const dentes = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI * (0.05 + (i * 0.9) / 8);
    return { x: 30 + Math.cos(a) * 9.5, y: 21 - Math.sin(a) * -9.5, r: (a * 180) / Math.PI };
  });
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Bandeira de Angola">
      <rect width="60" height="20" fill="#cc092f" />
      <rect y="20" width="60" height="20" fill="#000" />
      <g fill="none" stroke="#ffcb00">
        <path d="M21.5 21 A8.5 8.5 0 0 0 38.5 21" strokeWidth="2.6" />
        {dentes.map((d, k) => (
          <rect key={k} x={d.x - 0.9} y={d.y - 0.9} width="1.8" height="1.8" fill="#ffcb00" stroke="none" transform={`rotate(${d.r} ${d.x} ${d.y})`} />
        ))}
        <path d="M24 26.5 L36.5 14" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M36.5 14 q2 2.5 -0.5 4.5" strokeWidth="1.6" />
      </g>
      <polygon points="31,11 31.9,13.4 34.4,13.4 32.4,14.9 33.1,17.3 31,15.9 28.9,17.3 29.6,14.9 27.6,13.4 30.1,13.4" fill="#ffcb00" />
    </svg>
  );
}

function numero(v: number) {
  return Number.isInteger(v) ? v.toFixed(1) : String(v);
}

type Confronto = NonNullable<DisplayDuo['confronto']>;
type Participante = Confronto['participantes'][number];

const CEL_TOPO = 'bg-[#8798ad] border border-[#3d4654] text-base sm:text-3xl lg:text-[3.4vh] lg:leading-[1.25] font-black py-1 lg:py-[0.4vh]';
const CEL = 'bg-[#2f3640] border border-[#5b6675] text-base sm:text-3xl lg:text-[3.4vh] lg:leading-[1.25] font-black py-1 lg:py-[0.4vh] tabular-nums';
const CEL_PARTE = 'border border-[#3d4654] text-lg sm:text-3xl lg:text-[3vh] lg:leading-[1.25] font-bold py-0.5 lg:py-[0.3vh]';

/** Painel de uma dupla: pontuação + posição, nomes, A1…An / VRT / TOT e partes do último ataque. */
function PainelDupla({ conf, p, ativa }: { conf: Confronto; p: Participante; ativa: boolean }) {
  const placar = p.placar;
  const ultimo = [...placar.ataques].reverse().find((a) => a.revelado);
  const cor = p.cor ? BLOCO[p.cor] : BLOCO.SERIE;
  const colunasExtra = Math.max(0, 6 - conf.ataques.length);
  return (
    <section
      aria-label={p.cor === 'VERMELHO' ? 'Equipa vermelha' : p.cor === 'AZUL' ? 'Equipa azul' : nomeEquipa(p.inscricao)}
      className={`flex flex-col gap-2 lg:gap-[1vh] p-2 lg:p-[0.8vh] border-2 lg:flex-1 ${ativa ? 'border-white/80' : 'border-transparent'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-stretch lg:flex-1">
        <div className="relative flex items-center justify-center py-4 sm:py-6 lg:py-[1vh]" style={{ background: cor }}>
          {ativa && <span className="absolute top-1 left-2 text-xs sm:text-sm lg:text-[1.8vh] font-bold uppercase tracking-widest">Em atuação</span>}
          <p className="text-5xl sm:text-7xl lg:text-[10vh] leading-none font-black tabular-nums drop-shadow">
            {placar.ataquesRevelados > 0 ? numero(placar.total) : '—'}
            {placar.posicao ? <span className="ml-4">({placar.posicao})</span> : null}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-0.5 px-4 py-2 sm:pl-6">
          <p className="text-xl sm:text-3xl lg:text-[3.8vh] leading-tight lg:leading-[1.1] font-black uppercase line-clamp-2 break-words">{nomeEquipa(p.inscricao)}</p>
          <p className="text-sm sm:text-xl lg:text-[2.6vh] font-bold opacity-85 truncate">{atletasEquipa(p.inscricao)}</p>
          <p className="flex items-center gap-3 text-base sm:text-2xl lg:text-[3vh] font-black uppercase">
            <BandeiraAngola className="w-10 h-7 sm:w-16 sm:h-10 lg:w-[6.5vh] lg:h-[4.3vh] border border-white/40 shrink-0" />
            <span className="truncate">{p.inscricao.provincia?.nome ?? 'Angola'}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto shrink-0">
        <table className="w-full text-center border-collapse table-fixed">
          <thead>
            <tr>
              {conf.ataques.map((a) => <th key={a} className={CEL_TOPO}>{a}</th>)}
              {Array.from({ length: colunasExtra }, (_, i) => <th key={`x${i}`} className={CEL_TOPO}>-</th>)}
              {conf.variedadeAtiva && <th className={CEL_TOPO}>VRT</th>}
              <th className={CEL_TOPO}>TOT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {placar.ataques.map((a) => <td key={a.codigo} className={CEL}>{a.revelado ? a.total : '-'}</td>)}
              {Array.from({ length: colunasExtra }, (_, i) => <td key={`x${i}`} className={CEL}>-</td>)}
              {conf.variedadeAtiva && <td className={CEL}>{placar.variedade ?? '-'}</td>}
              <td className={CEL}>{placar.ataquesRevelados > 0 ? placar.total : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {ultimo ? (
        <table className="w-full shrink-0 bg-white text-[#3d4654] text-center border-collapse">
          <tbody>
            <tr>
              <th rowSpan={2} className="border border-[#3d4654] text-xl sm:text-3xl lg:text-[3.6vh] font-black w-[18%]">{ultimo.codigo}</th>
              {ultimo.partes.map((x) => <th key={x.codigo} className={CEL_PARTE} title={x.nome}>{x.codigo}</th>)}
            </tr>
            <tr>
              {ultimo.partes.map((x) => <td key={x.codigo} className={`${CEL_PARTE} tabular-nums`}>{x.valor ?? '-'}</td>)}
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="bg-white/10 text-center text-base sm:text-xl lg:text-[2.6vh] font-bold py-2 lg:py-[1.2vh]">
          A aguardar a pontuação dos júris ({conf.juris.comFolha}/{conf.juris.necessarios})
        </p>
      )}
    </section>
  );
}

const DisplayDuoPage: React.FC = () => {
  const { campeonatoId = '', confrontoId } = useParams<{ campeonatoId: string; confrontoId?: string }>();
  const [params, setParams] = useSearchParams();
  const area = Number(params.get('area')) || undefined;
  const [dados, setDados] = useState<DisplayDuo | null>(null);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(() => {
    jujitsuDuoService
      .display(campeonatoId, { area: confrontoId ? undefined : area, confrontoId })
      .then((d) => {
        setDados(d);
        setErro(false);
      })
      .catch(() => setErro(true));
  }, [campeonatoId, area, confrontoId]);

  // Tempo real: aviso por socket + recarga periódica como salvaguarda
  useEffect(() => {
    carregar();
    joinCampeonato(campeonatoId);
    const desligar = onDuoDisplay((p) => {
      if (confrontoId ? p.confrontoId === confrontoId : !area || p.area === area) carregar();
    });
    const t = setInterval(carregar, RECARGA_MS);
    return () => {
      desligar();
      clearInterval(t);
      leaveCampeonato(campeonatoId);
    };
  }, [campeonatoId, area, confrontoId, carregar]);

  const conf = dados?.confronto ?? null;

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#2b313b] text-white flex p-2 sm:p-3 lg:overflow-hidden" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <main className="relative w-full flex-1 min-h-0 mt-3 bg-[#3d4654] border-2 border-[#7fd3e6] px-3 sm:px-5 pt-8 lg:pt-[4vh] pb-3 flex flex-col gap-3 lg:gap-[1.2vh]">
        {/* Título da área ("RING") */}
        <h1 className="absolute -top-0 left-4 -translate-y-1/2 bg-[#3d4654] px-2 text-xl sm:text-3xl lg:text-[4vh] lg:leading-[1.2] font-black tracking-wide">
          ÁREA {conf?.area ?? area ?? '—'}
        </h1>
        {confrontoId && (
          <Link
            to={`/display/${campeonatoId}`}
            className="absolute top-2 right-3 px-2 py-0.5 text-xs font-bold border border-white/60 opacity-40 hover:opacity-100 transition-opacity"
          >
            ← Batalhas
          </Link>
        )}
        {!confrontoId && dados && dados.areas.length > 1 && (
          <nav aria-label="Área" className="absolute top-2 right-3 flex gap-1 opacity-30 hover:opacity-100 transition-opacity">
            {dados.areas.map((a) => (
              <button
                key={a}
                onClick={() => setParams({ area: String(a) })}
                className={`px-2 py-0.5 text-xs font-bold border ${a === (area ?? conf?.area) ? 'bg-white text-black' : 'border-white/60'}`}
              >
                {a}
              </button>
            ))}
          </nav>
        )}

        {erro && !dados ? (
          <p className="m-auto text-2xl font-bold">Sem ligação ao servidor…</p>
        ) : !dados ? (
          <p className="m-auto text-2xl font-bold opacity-70">A carregar…</p>
        ) : !conf || conf.participantes.length === 0 ? (
          <div className="m-auto text-center space-y-2">
            <p className="text-3xl sm:text-5xl font-black uppercase">{dados.competicao.nome}</p>
            <p className="text-xl opacity-80">{confrontoId ? 'Ju-Jitsu Duo — batalha não encontrada' : 'Ju-Jitsu Duo — sem tapetes em curso nesta área'}</p>
          </div>
        ) : (
          <>
            {/* Categoria */}
            <div className="bg-[#b4c0cd]/40 px-3 py-1.5 lg:py-[0.6vh]">
              <p className="text-xl sm:text-4xl lg:text-[4vh] lg:leading-[1.25] font-black uppercase tracking-wide truncate">
                Duo System {conf.categoria} · {conf.ronda}
                {conf.serie ? ` · Série ${conf.serie}` : ''}
              </p>
            </div>

            {/* Um painel completo por dupla (vermelha em cima, azul em baixo) */}
            <div className="flex flex-col gap-3 lg:gap-[1.2vh] flex-1 min-h-0" aria-live="polite">
              {conf.participantes.map((p) => (
                <PainelDupla key={p.inscricao.id} conf={conf} p={p} ativa={conf.participantes.length > 1 && p.inscricao.id === conf.emAtuacao} />
              ))}
            </div>

            <footer className="shrink-0 text-center leading-tight lg:[@media(max-height:820px)]:hidden">
              <span className="text-lg sm:text-2xl lg:text-[2.2vh] font-black italic tracking-wide">SPORT DATA</span>
              <span className="block text-xs sm:text-sm lg:text-[1.5vh] opacity-80">Angola · {dados.competicao.nome}</span>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default DisplayDuoPage;
