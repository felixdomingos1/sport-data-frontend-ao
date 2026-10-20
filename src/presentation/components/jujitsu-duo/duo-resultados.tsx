import React, { useEffect, useState } from 'react';
import { Trophy, Swords, MapPin, Clock } from 'lucide-react';
import { jujitsuDuoService, type ConfrontoPublico, type DuoPublico, type DuplaPublica } from '@/infrastructure/services/jujitsu-duo.service';

const COR = {
  VERMELHO: { nome: 'Vermelha', borda: 'border-l-red-600', texto: 'text-red-500', fundo: 'bg-red-600/[0.06]' },
  AZUL: { nome: 'Azul', borda: 'border-l-blue-600', texto: 'text-blue-500', fundo: 'bg-blue-600/[0.06]' },
} as const;

function nomeDupla(d: DuplaPublica) {
  return d.dupla.designacao || `${d.atleta1.nomeCompleto} & ${d.atleta2.nomeCompleto}`;
}

function ConfrontoCard({ c, ataques }: { c: ConfrontoPublico; ataques: string[] }) {
  const resultado = new Map(c.resultados.map((r) => [r.inscricaoId, r]));
  const temResultado = c.resultados.length > 0;
  const homologado = temResultado && c.resultados.every((r) => r.estado === 'HOMOLOGADO');
  const linhas = [...c.participantes].sort((a, b) => (resultado.get(a.inscricao.id)?.posicao ?? a.ordem + 50) - (resultado.get(b.inscricao.id)?.posicao ?? b.ordem + 50));
  return (
    <article className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{c.serie ? `Série ${c.serie}` : `Tapete ${c.numero}`}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40">
          {c.area ? <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />Área {c.area}</span> : null}
          {c.agendadoPara ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(c.agendadoPara).toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : null}
          <span className={`px-2 py-0.5 rounded font-bold ${temResultado ? (homologado ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500') : 'bg-gray-500/10 text-gray-500 dark:text-white/40'}`}>
            {temResultado ? (homologado ? 'Resultado homologado' : 'Resultado validado (não homologado)') : 'Aguarda resultado'}
          </span>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          {temResultado && (
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30 text-left">
                <th className="py-1 pr-2">Pos.</th>
                <th className="py-1 pr-2">Dupla</th>
                {ataques.map((a) => <th key={a} className="py-1 px-1 text-center font-mono">{a}</th>)}
                <th className="py-1 pl-2 text-right">Total</th>
              </tr>
            </thead>
          )}
          <tbody>
            {linhas.map((p) => {
              const r = resultado.get(p.inscricao.id);
              const cor = p.cor ? COR[p.cor] : null;
              return (
                <tr key={p.inscricao.id} className={`border-l-4 ${cor ? `${cor.borda} ${cor.fundo}` : 'border-l-gray-300 dark:border-l-white/10'}`}>
                  {temResultado && <td className="py-2 px-2 font-black text-gray-900 dark:text-white">{r?.posicao ?? '—'}</td>}
                  <td className="py-2 px-2">
                    {cor && <span className={`text-[10px] font-black uppercase tracking-widest mr-2 ${cor.texto}`}>{cor.nome}</span>}
                    <span className="text-gray-900 dark:text-white font-semibold">{nomeDupla(p.inscricao)}</span>
                    {r?.vencedor && <Trophy className="inline w-3.5 h-3.5 ml-1.5 text-amber-500" aria-label="Vencedor" />}
                    <span className="block text-xs text-gray-500 dark:text-white/40">{[p.inscricao.clube?.nome, p.inscricao.provincia?.nome].filter(Boolean).join(' · ')}</span>
                  </td>
                  {temResultado && ataques.map((a) => <td key={a} className="py-2 px-1 text-center tabular-nums text-gray-700 dark:text-white/70">{r?.ataques.find((x) => x.codigo === a)?.subtotal ?? '—'}</td>)}
                  {temResultado && <td className="py-2 pl-2 pr-2 text-right font-black text-lg tabular-nums text-gray-900 dark:text-white">{r ? r.total.toLocaleString('pt-PT') : '—'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

/** Calendário, resultados e classificações publicados de um campeonato Ju-Jitsu Duo. */
export const DuoResultados: React.FC<{ campeonatoId: string }> = ({ campeonatoId }) => {
  const [dados, setDados] = useState<DuoPublico | null>(null);
  const [erro, setErro] = useState(false);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    jujitsuDuoService
      .publicoPorCampeonato(campeonatoId)
      .then((d) => {
        if (!ativo) return;
        setDados(d);
        setCategoriaId(d.categorias[0]?.id ?? null);
      })
      .catch(() => ativo && setErro(true));
    return () => {
      ativo = false;
    };
  }, [campeonatoId]);

  if (erro) return null;
  if (!dados) return <div className="h-24 rounded-xl bg-gray-100 dark:bg-white/[0.03] animate-pulse" aria-label="A carregar resultados" />;

  const categoria = dados.categorias.find((c) => c.id === categoriaId);

  return (
    <section aria-label="Ju-Jitsu Duo — tapetes e resultados" className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Swords className="w-4 h-4 text-brand" />
        <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Ju-Jitsu Duo — Tapetes e resultados</h2>
      </div>
      {['EM_CURSO', 'PRONTA_PARA_COMPETIR'].includes(dados.competicao.estado) && (
        <a
          href={`/display/duo/${campeonatoId}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand text-white text-xs font-bold"
        >
          <Swords className="w-3.5 h-3.5" /> Abrir display ao vivo
        </a>
      )}
      {dados.competicao.regulamento && dados.competicao.regulamento.estado !== 'OFICIAL' && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Regulamento provisório: os resultados publicados ainda não estão homologados.</p>
      )}

      {dados.categorias.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-white/30">Sem categorias publicadas.</p>
      ) : (
        <>
          <div role="tablist" aria-label="Categorias" className="flex gap-2 overflow-x-auto pb-1">
            {dados.categorias.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={c.id === categoriaId}
                onClick={() => setCategoriaId(c.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${
                  c.id === categoriaId ? 'bg-brand text-white border-brand' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-brand/50'
                }`}
              >
                {c.nome}
                {c.escalao ? ` · ${c.escalao}` : ''}
              </button>
            ))}
          </div>

          {categoria && (
            <div role="tabpanel" className="space-y-5">
              <p className="text-xs text-gray-500 dark:text-white/40">
                {categoria.formato === 'SERIE' ? 'Avaliação em séries' : 'Tapetes Vermelha × Azul'} · {categoria.duplasConfirmadas} duplas confirmadas
                {categoria.grupo ? ` · Grupo ${categoria.grupo}` : ''}
              </p>

              {categoria.classificacao && (
                <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> Classificação final
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{categoria.classificacao.estado === 'HOMOLOGADO' ? 'homologada' : 'validada'}</span>
                  </h3>
                  <ol className="space-y-1.5">
                    {categoria.classificacao.posicoes.map((p, k) => (
                      <li key={k} className="flex items-center gap-3 text-sm">
                        <span className="w-8 text-center font-black text-gray-900 dark:text-white">{p.posicao ?? '—'}</span>
                        <span className="flex-1 text-gray-800 dark:text-white/80">{p.inscricao ? nomeDupla(p.inscricao) : '—'}</span>
                        <span className="text-xs text-gray-500 dark:text-white/40">{p.inscricao?.provincia?.nome ?? p.inscricao?.clube?.nome ?? ''}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {categoria.rondas.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl py-8 text-center">
                  O calendário desta categoria ainda não foi publicado.
                </p>
              ) : (
                categoria.rondas.map((r) => (
                  <div key={r.id} className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {r.nome} <span className="text-xs font-mono text-gray-400 dark:text-white/30">{r.ataques.join(' · ')}</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {r.confrontos.map((c) => <ConfrontoCard key={c.id} c={c} ataques={r.ataques} />)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};
