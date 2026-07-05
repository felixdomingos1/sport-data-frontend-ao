import React, { useEffect } from 'react';
import { Trophy, Star, TrendingUp, Medal, Calendar } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import { formatDatePt, getInitials } from '@/presentation/utils/atleta.utils';
import { SEO } from '../../components/seo/seo';

function Avatar({ name, highlighted }: { name: string; highlighted?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
        highlighted ? 'bg-white/20 text-white ring-2 ring-white/30' : 'bg-[#2a2a2a] text-[var(--text-secondary)]'
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

const RankingAtletaPage: React.FC = () => {
  const { user } = useAuthStore();
  const { profile, rankingAtleta, rankingGeral, dashboard, isLoading, fetchRankings, fetchMe } =
    useAtletaMeStore();

  useEffect(() => {
    fetchMe();
    fetchRankings();
  }, [fetchMe, fetchRankings]);

  const displayName = profile?.nomeCompleto || user?.nome || 'Atleta';
  const meuRanking = rankingAtleta[0] ?? rankingGeral.find((r) => r.atletaId === profile?.id);
  const atletaId = profile?.id;

  const classificacao = rankingGeral.map((item) => ({
    ...item,
    isCurrentUser: item.atletaId === atletaId,
    nome: item.atleta?.nomeCompleto ?? 'Atleta',
  }));

  if (isLoading && rankingGeral.length === 0) {
    return <SportLoadingScreen message="A carregar ranking..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-6">
      <SEO title="Ranking" description="Meu ranking nacional no desporto angolano." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <Trophy className="w-4 h-4 text-white mb-3" />
          <p className="text-3xl font-bold text-white">{meuRanking ? `#${meuRanking.posicao}` : '—'}</p>
          <p className="text-xs text-white/70 mt-1">Posição actual</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Star className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{(meuRanking?.pontos ?? 0).toLocaleString('pt-PT')}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Pontuação total</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Medal className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{meuRanking?.vitorias ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Vitórias</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <TrendingUp className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{meuRanking?.partidas ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Partidas disputadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--card-border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Classificação Geral</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{meuRanking?.modalidade ?? 'Modalidade'}</p>
          </div>
          <div className="divide-y divide-[var(--card-border)]">
            {classificacao.length === 0 ? (
              <p className="px-5 py-12 text-sm text-[var(--text-muted)] text-center">Ranking indisponível.</p>
            ) : (
              classificacao.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${item.isCurrentUser ? 'bg-[#E60000]/10' : ''}`}
                >
                  <span className={`text-sm font-bold w-8 ${item.isCurrentUser ? 'text-[#E60000]' : 'text-[var(--text-muted)]'}`}>
                    #{item.posicao}
                  </span>
                  <Avatar name={item.nome} highlighted={item.isCurrentUser} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${item.isCurrentUser ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {item.isCurrentUser ? displayName : item.nome}
                    </p>
                  </div>
                  <span className={`text-sm ${item.isCurrentUser ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {item.pontos.toLocaleString('pt-PT')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Composição da Pontuação</h3>
            <div className="space-y-3">
              {[
                { label: 'Vitórias', valor: meuRanking?.vitorias ?? 0, max: meuRanking?.partidas ?? 1 },
                { label: 'Empates', valor: meuRanking?.empates ?? 0, max: meuRanking?.partidas ?? 1 },
                { label: 'Derrotas', valor: meuRanking?.derrotas ?? 0, max: meuRanking?.partidas ?? 1 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>{item.label}</span>
                    <span>{item.valor}</span>
                  </div>
                  <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E60000] rounded-full"
                      style={{ width: `${item.max ? (item.valor / item.max) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--card-border)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Últimas Competições</h3>
            </div>
            <div className="divide-y divide-[var(--card-border)]">
              {(dashboard?.ultimasCompeticoes ?? []).slice(0, 3).map((comp) => (
                <div key={comp.id} className="px-5 py-3.5">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{comp.campeonato?.nome}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDatePt(comp.createdAt)} • {comp.pontos} pts
                  </p>
                </div>
              ))}
              {(dashboard?.ultimasCompeticoes ?? []).length === 0 && (
                <p className="px-5 py-8 text-sm text-[var(--text-muted)] text-center">Sem competições recentes.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingAtletaPage;
