import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { jujitsuDuoService, type BatalhaDuo, type BatalhasDuo } from '@/infrastructure/services/jujitsu-duo.service';
import { atletasEquipa, nomeEquipa } from '@/presentation/components/jujitsu-duo/equipa';
import { joinCampeonato, leaveCampeonato, onDuoDisplay } from '@/infrastructure/services/socket.service';

/**
 * Lista das batalhas (confrontos/séries) de uma competição Ju-Jitsu Duo no display.
 * Cada batalha abre o ecrã da competição (placar Duo) fixado nesse confronto.
 */

const RECARGA_MS = 15_000;

const COR = { VERMELHO: '#d65a63', AZUL: '#3b6fd6', SERIE: '#2a8f84' } as const;

const ESTADO: Record<string, { label: string; cor: string }> = {
  AGENDADO: { label: 'Agendada', cor: '#8798ad' },
  EM_CURSO: { label: 'Em curso', cor: '#f59e0b' },
  EM_AVALIACAO: { label: 'Em avaliação', cor: '#f59e0b' },
  CONCLUIDO: { label: 'Concluída', cor: '#22c55e' },
  VALIDADO: { label: 'Validada', cor: '#22c55e' },
  HOMOLOGADO: { label: 'Homologada', cor: '#22c55e' },
};

function CartaoBatalha({ campeonatoId, b }: { campeonatoId: string; b: BatalhaDuo }) {
  const estado = ESTADO[b.estado] ?? { label: b.estado.replace(/_/g, ' ').toLowerCase(), cor: '#8798ad' };
  return (
    <li>
      <Link
        to={`/display/duo/${campeonatoId}/${b.id}`}
        className="block h-full bg-[#3d4654] border-2 border-transparent hover:border-[#7fd3e6] focus-visible:border-[#7fd3e6] outline-none transition-colors"
      >
        <div className="flex items-center justify-between gap-2 bg-[#8798ad] px-3 py-1.5">
          <span className="font-black uppercase truncate">
            {b.formato === 'SERIE' ? `Série ${b.serie ?? b.numero}` : `Tapete ${b.numero}`}
            {b.area ? ` · Área ${b.area}` : ''}
          </span>
          <span className="shrink-0 text-xs font-bold uppercase px-2 py-0.5 text-[#1f2937]" style={{ background: estado.cor }}>
            {estado.label}
          </span>
        </div>
        <ul className="p-2 space-y-1.5">
          {b.participantes.map((p) => (
            <li key={p.inscricao.id} className="flex items-center gap-2 bg-[#2f3640]">
              <span className="w-2.5 self-stretch" style={{ background: p.cor ? COR[p.cor] : COR.SERIE }} aria-hidden="true" />
              <span className="flex-1 min-w-0 py-1.5">
                <span className="block font-bold uppercase leading-tight line-clamp-2 break-words">{nomeEquipa(p.inscricao)}</span>
                <span className="block truncate text-xs opacity-70">
                  {p.cor ? (p.cor === 'VERMELHO' ? 'Vermelha · ' : 'Azul · ') : ''}
                  {atletasEquipa(p.inscricao)}
                </span>
              </span>
              <span className="px-3 text-2xl font-black tabular-nums">
                {p.placar.ataquesRevelados > 0 ? p.placar.total : '-'}
                {p.placar.posicao ? <span className="text-sm ml-1">({p.placar.posicao})</span> : null}
              </span>
            </li>
          ))}
          {b.participantes.length === 0 && <li className="text-sm opacity-70 px-2 py-1.5">Equipas por sortear</li>}
        </ul>
      </Link>
    </li>
  );
}

const DisplayDuoBatalhas: React.FC<{ campeonatoId: string }> = ({ campeonatoId }) => {
  const [dados, setDados] = useState<BatalhasDuo | null>(null);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(() => {
    jujitsuDuoService
      .batalhas(campeonatoId)
      .then((d) => {
        setDados(d);
        setErro(false);
      })
      .catch(() => setErro(true));
  }, [campeonatoId]);

  useEffect(() => {
    carregar();
    joinCampeonato(campeonatoId);
    const desligar = onDuoDisplay(() => carregar());
    const t = setInterval(carregar, RECARGA_MS);
    return () => {
      desligar();
      clearInterval(t);
      leaveCampeonato(campeonatoId);
    };
  }, [campeonatoId, carregar]);

  // Agrupa por categoria e ronda, mantendo a ordem do servidor
  const grupos = useMemo(() => {
    const m = new Map<string, { titulo: string; batalhas: BatalhaDuo[] }>();
    for (const b of dados?.batalhas ?? []) {
      const chave = `${b.categoria}|${b.ronda}`;
      if (!m.has(chave)) m.set(chave, { titulo: `${b.categoria} · ${b.ronda}`, batalhas: [] });
      m.get(chave)!.batalhas.push(b);
    }
    return [...m.values()];
  }, [dados]);

  return (
    <div className="min-h-screen w-full bg-[#2b313b] text-white p-4 sm:p-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="max-w-[1400px] mx-auto flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#7fd3e6] pb-3 mb-6">
        <div className="min-w-0">
          <Link to="/display" className="text-xs font-bold uppercase opacity-60 hover:opacity-100">← Competições</Link>
          <h1 className="text-2xl sm:text-4xl font-black uppercase truncate">{dados?.competicao.nome ?? 'Ju-Jitsu Duo'}</h1>
          <p className="text-sm sm:text-base opacity-80">
            Ju-Jitsu Duo · Batalhas{dados?.competicao.local ? ` · ${dados.competicao.local}` : ''}
          </p>
        </div>
        <span className="text-lg sm:text-2xl font-black italic tracking-wide">SPORT DATA</span>
      </header>

      <main className="max-w-[1400px] mx-auto space-y-8">
        {erro && !dados ? (
          <p className="text-center text-xl font-bold py-20">
            Não foi possível carregar as batalhas. A competição Duo pode ainda não estar pronta para competir.
          </p>
        ) : !dados ? (
          <p className="text-center text-xl font-bold opacity-70 py-20">A carregar…</p>
        ) : grupos.length === 0 ? (
          <p className="text-center text-xl font-bold opacity-80 py-20">Ainda não há batalhas sorteadas nesta competição.</p>
        ) : (
          grupos.map((g) => (
            <section key={g.titulo} aria-label={g.titulo}>
              <h2 className="bg-[#b4c0cd]/40 px-3 py-1.5 text-lg sm:text-2xl font-black uppercase mb-3">Duo System {g.titulo}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {g.batalhas.map((b) => (
                  <CartaoBatalha key={b.id} campeonatoId={campeonatoId} b={b} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default DisplayDuoBatalhas;
