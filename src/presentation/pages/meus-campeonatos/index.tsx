import React, { useEffect, useState } from 'react';
import { Calendar, Trophy, Star, Medal, MapPin, Eye } from 'lucide-react';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import { campeonatoService } from '@/infrastructure/services/campeonato.service';
import type { Campeonato } from '@/core/types/api.types';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import { formatDatePt } from '@/presentation/utils/atleta.utils';
import { SEO } from '../../components/seo/seo';

type FiltroHistorico = 'todas' | 'nacional' | 'regional';

const MeusCampeonatos: React.FC = () => {
  const { dashboard, isLoading, fetchDashboard } = useAtletaMeStore();
  const [proximos, setProximos] = useState<Campeonato[]>([]);
  const [filtro, setFiltro] = useState<FiltroHistorico>('todas');

  useEffect(() => {
    fetchDashboard();
    campeonatoService.getActive({ limit: 10 }).then((res) => setProximos(res.data)).catch(() => setProximos([]));
  }, [fetchDashboard]);

  const historico = dashboard?.ultimasCompeticoes ?? [];
  const metricas = dashboard?.metricas;

  const historicoFiltrado = historico.filter((item) => {
    const modalidade = item.campeonato?.modalidade?.toLowerCase() ?? '';
    if (filtro === 'nacional') return modalidade.includes('nacional') || item.campeonato?.nome?.toLowerCase().includes('nacional');
    if (filtro === 'regional') return modalidade.includes('regional') || modalidade.includes('provincial');
    return true;
  });

  if (isLoading && !dashboard) {
    return <SportLoadingScreen message="A carregar competições..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-6">
      <SEO title="Competições" description="Minhas competições e campeonatos." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{proximos.length}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Próximas competições</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Trophy className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{metricas?.totalCompeticoes ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Total participações</p>
        </div>
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <Star className="w-4 h-4 text-[var(--text-muted)] mb-3" />
          <p className="text-3xl font-bold text-[var(--text-primary)]">{metricas?.inscricoesAtivas ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Inscrições activas</p>
        </div>
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <Medal className="w-4 h-4 text-white mb-3" />
          <p className="text-3xl font-bold text-white">{metricas?.rankingGeral ? `#${metricas.rankingGeral}` : '—'}</p>
          <p className="text-xs text-white/70 mt-1">Posição no ranking</p>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Próximas Competições</h3>
        </div>
        <div className="divide-y divide-[var(--card-border)]">
          {proximos.length === 0 ? (
            <p className="px-5 py-10 text-sm text-[var(--text-muted)] text-center">Nenhuma competição activa disponível.</p>
          ) : (
            proximos.map((comp) => (
              <div key={comp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="w-10 h-10 bg-[#E60000]/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#E60000]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{comp.nome}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDatePt(comp.dataInicio)}- {formatDatePt(comp.dataFim)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {comp.modalidade} • {comp.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#2a2a2a]">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['todas', 'nacional', 'regional'] as FiltroHistorico[]).map((item) => (
          <button
            key={item}
            onClick={() => setFiltro(item)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
              filtro === item
                ? 'bg-[#E60000] text-white'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--card-border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Histórico de Participações</h3>
        </div>
        <div className="divide-y divide-[var(--card-border)]">
          {historicoFiltrado.length === 0 ? (
            <p className="px-5 py-12 text-sm text-[var(--text-muted)] text-center">Nenhuma participação registada.</p>
          ) : (
            historicoFiltrado.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-[var(--hover-bg)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.campeonato?.nome ?? 'Competição'}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {item.campeonato?.modalidade} • {item.categoria?.nome ?? 'Categoria'} • {item.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#22C55E]">{item.pontos} pts</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.vitorias}V / {item.derrotas}D / {item.empates}E</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusCampeonatos;
