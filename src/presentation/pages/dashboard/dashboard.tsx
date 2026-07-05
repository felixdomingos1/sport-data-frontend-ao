import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Star,
  Calendar,
  Hash,
  Building2,
  Users,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import {
  formatDatePt,
  getDocumentoLabel,
  getInscricaoAtiva,
  getInitials,
  getStatusInscricaoLabel,
} from '@/presentation/utils/atleta.utils';
import type { StatusDocumento } from '@/core/types/atleta-me.types';
import { SEO } from '../../components/seo/seo';

function StatusBadge({ status }: { status: StatusDocumento }) {
  if (status === 'APROVADO') {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-500/10 text-[#22C55E] border border-green-500/20">
        APROVADO
      </span>
    );
  }
  if (status === 'REJEITADO') {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand-light border border-brand/20">
        REJEITADO
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-[#F59E0B] border border-orange-500/20">
      PENDENTE
    </span>
  );
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { profile, dashboard, rankingGeral, isLoading, fetchDashboard, fetchRankings } = useAtletaMeStore();

  useEffect(() => {
    if (!dashboard) fetchDashboard();
    fetchRankings();
  }, [dashboard, fetchDashboard, fetchRankings]);

  if (isLoading && !dashboard) {
    return <SportLoadingScreen message="A carregar o painel..." fullscreen={false} size="md" />;
  }

  const atleta = dashboard?.atleta;
  const metricas = dashboard?.metricas;
  const inscricao = getInscricaoAtiva(dashboard?.ultimasInscricoes);
  const displayName = atleta?.nomeCompleto || user?.nome || 'Atleta';
  const avatarUrl = profile?.usuario?.perfis?.[0]?.avatar ?? user?.perfis?.[0]?.avatar ?? atleta?.imagemUrl;
  const athleteId = inscricao?.numeroRegistro || dashboard?.ultimasInscricoes?.[0]?.numeroRegistro || '—';
  const rankingPos = metricas?.rankingGeral ?? rankingGeral.find((r) => r.atletaId === atleta?.id)?.posicao;
  const rankingItem = rankingGeral.find((r) => r.atletaId === atleta?.id);
  const documentos = dashboard?.documentos?.slice(0, 3) ?? [];
  const competicoes = dashboard?.ultimasCompeticoes ?? [];

  return (
    <div className="space-y-6">
      <SEO title="Painel" description="Painel do atleta — Sport Data Angola." />
      <div className="bg-[var(--card-bg)] rounded-2xl p-5 lg:p-6 border border-[var(--card-border)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#E60000] to-[#990000] flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[#E60000]/30">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xl font-bold">{getInitials(displayName)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-lg lg:text-xl font-bold text-[var(--text-primary)]">{displayName}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20">
                {getStatusInscricaoLabel(inscricao?.status).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {athleteId}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {inscricao?.federacao?.nome ?? 'Sem federação'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {inscricao?.clube?.nome ?? 'Sem clube'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <p className="text-xs text-[var(--text-muted)]">{inscricao?.plano?.nome ?? 'Plano'}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Expira: {formatDatePt(inscricao?.dataFim)}
            </p>
            <Link
              to="/pagamentos"
              className="px-5 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
            >
              Renovar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">Ranking</p>
            <Trophy className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{rankingPos ? `#${rankingPos}` : '—'}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{rankingItem?.modalidade ?? 'Nacional'}</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">Pontuação</p>
            <Star className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {(rankingItem?.pontos ?? 0).toLocaleString('pt-PT')}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{metricas?.inscricoesAtivas ?? 0} inscrições activas</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">Competições</p>
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{metricas?.totalCompeticoes ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{metricas?.totalInscricoes ?? 0} inscrições</p>
        </div>

        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">Documentos</p>
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{metricas?.documentosAprovados ?? 0}</p>
          <p className="text-xs text-white/70 mt-1">{metricas?.documentosPendentes ?? 0} pendentes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Histórico de Competições</h3>
            <Link to="/meus-campeonatos" className="text-sm text-[#E60000] hover:text-[#ff1a1a] font-medium transition">
              Ver tudo
            </Link>
          </div>
          <div className="divide-y divide-[var(--card-border)]">
            {competicoes.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--text-muted)] text-center">Nenhuma competição registada.</p>
            ) : (
              competicoes.map((comp) => (
                <div key={comp.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--hover-bg)] transition">
                  <div className="w-9 h-9 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{comp.campeonato?.nome ?? 'Competição'}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{comp.categoria?.nome ?? comp.campeonato?.modalidade}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{comp.status}</p>
                    <p className="text-sm font-semibold text-[#22C55E] mt-0.5">{comp.pontos} pts</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--card-border)]">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Documentos</h3>
            </div>
            <div className="divide-y divide-[var(--card-border)]">
              {documentos.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--text-muted)] text-center">Sem documentos enviados.</p>
              ) : (
                documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-[var(--text-secondary)]">{getDocumentoLabel(doc)}</span>
                    <StatusBadge status={doc.status} />
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-4 border-t border-[var(--card-border)]">
              <Link
                to="/documentos"
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#3a3a3a] rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-500 transition"
              >
                <Upload className="w-4 h-4" />
                Enviar documento
              </Link>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--card-border)]">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">Ranking Geral</p>
            </div>
            <div className="divide-y divide-[var(--card-border)]">
              {rankingGeral.slice(0, 5).length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--text-muted)] text-center">Ranking indisponível.</p>
              ) : (
                rankingGeral.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      item.atletaId === atleta?.id ? 'bg-[#E60000]/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-5 ${item.atletaId === atleta?.id ? 'text-[#E60000]' : 'text-[var(--text-muted)]'}`}>
                        #{item.posicao}
                      </span>
                      <span className={`text-sm ${item.atletaId === atleta?.id ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {item.atleta?.nomeCompleto ?? 'Atleta'}
                      </span>
                    </div>
                    <span className={`text-sm ${item.atletaId === atleta?.id ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {item.pontos.toLocaleString('pt-PT')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
