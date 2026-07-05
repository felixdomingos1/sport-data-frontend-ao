import React, { useEffect, useState } from 'react';
import {
  Building2,
  Users,
  Trophy,
  Layers,
  CreditCard,
  Pencil,
  Upload,
  Download,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import {
  formatDateLongPt,
  formatDatePt,
  getDocumentoLabel,
  getGeneroLabel,
  getInscricaoAtiva,
  getInitials,
  getStatusInscricaoLabel,
} from '@/presentation/utils/atleta.utils';
import type { StatusDocumento } from '@/core/types/atleta-me.types';

function StatusBadge({ status }: { status: StatusDocumento }) {
  if (status === 'APROVADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
        Aprovado
      </span>
    );
  }
  if (status === 'REJEITADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand-light border border-brand/20 uppercase tracking-wide">
        Rejeitado
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-[#F59E0B] border border-orange-500/20 uppercase tracking-wide">
      Pendente
    </span>
  );
}

const Perfil: React.FC = () => {
  const { user } = useAuthStore();
  const { profile, documentos, isLoading, isSaving, fetchMe, updateMe } = useAtletaMeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nomeCompleto: '',
    nacionalidade: '',
    genero: 'M' as 'M' | 'F',
    dataNascimento: '',
  });

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (profile) {
      setForm({
        nomeCompleto: profile.nomeCompleto,
        nacionalidade: profile.nacionalidade,
        genero: profile.genero,
        dataNascimento: profile.dataNascimento?.slice(0, 10) ?? '',
      });
    }
  }, [profile]);

  const inscricao = getInscricaoAtiva(profile?.inscricoes);
  const displayName = profile?.nomeCompleto || user?.nome || 'Atleta';
  const athleteId = inscricao?.numeroRegistro ?? '—';
  const avatarUrl = profile?.usuario?.perfis?.[0]?.avatar ?? profile?.imagemUrl;

  const handleSave = async () => {
    try {
      await updateMe(form);
      toast.success('Perfil actualizado com sucesso');
      setIsEditing(false);
    } catch {
      toast.error('Erro ao actualizar perfil');
    }
  };

  if (isLoading && !profile) {
    return <SportLoadingScreen message="A carregar perfil..." fullscreen={false} size="md" />;
  }

  const perfilDetalhes = [
    { label: 'Federação', value: inscricao?.federacao?.nome ?? '—', icon: Building2 },
    { label: 'Clube', value: inscricao?.clube?.nome ?? '—', icon: Users },
    { label: 'Modalidade', value: inscricao?.federacao?.nome ?? '—', icon: Trophy },
    { label: 'Plano', value: inscricao?.plano?.nome ?? '—', icon: Layers },
    {
      label: 'Validade',
      value: inscricao ? `${formatDatePt(inscricao.dataInicio)}- ${formatDatePt(inscricao.dataFim)}` : '—',
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#E60000] to-[#990000] flex items-center justify-center ring-4 ring-[#E60000]/20 mb-4 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">{getInitials(displayName)}</span>
            )}
          </div>

          <h2 className="text-lg font-bold text-[var(--text-primary)] text-center">{displayName}</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{athleteId}</p>

          <span className="mt-3 text-[10px] font-bold px-3 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
            {getStatusInscricaoLabel(inscricao?.status)}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-[var(--card-border)] space-y-4">
            {perfilDetalhes.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm text-[var(--text-primary)] mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Dados Pessoais</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-sm font-medium hover:bg-[#E60000]/10 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nome Completo', key: 'nomeCompleto' as const, editable: true },
              { label: 'Data de Nascimento', key: 'dataNascimento' as const, editable: true, type: 'date' },
              { label: 'Género', key: 'genero' as const, editable: true, select: true },
              { label: 'Nacionalidade', key: 'nacionalidade' as const, editable: true },
              { label: 'Número de BI', value: profile?.bi ?? '—', editable: false },
              { label: 'Telefone', value: profile?.usuario?.telefone ?? user?.telefone ?? '—', editable: false },
              { label: 'E-mail', value: profile?.usuario?.email ?? user?.email ?? '—', editable: false },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                  {field.label}
                </label>
                {isEditing && field.editable && field.key ? (
                  field.select ? (
                    <select
                      value={form.genero}
                      onChange={(e) => setForm((p) => ({ ...p, genero: e.target.value as 'M' | 'F' }))}
                      className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E60000]/50"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  ) : (
                    <input
                      type={field.type ?? 'text'}
                      value={form[field.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [field.key!]: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E60000]/50 transition"
                    />
                  )
                ) : (
                  <div className="px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--text-primary)]">
                    {field.key === 'genero'
                      ? getGeneroLabel(form.genero)
                      : field.key === 'dataNascimento'
                        ? formatDateLongPt(form.dataNascimento)
                        : field.key
                          ? form[field.key]
                          : field.value}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
              >
                {isSaving ? 'A guardar...' : 'Guardar alterações'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-[var(--hover-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--card-border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Documentos</h3>
            <Link
              to="/documentos"
              className="flex items-center gap-2 px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl text-sm font-medium transition"
            >
              <Upload className="w-4 h-4" />
              Enviar Documento
            </Link>
          </div>

          <div className="divide-y divide-[var(--card-border)]">
            {documentos.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--text-muted)] text-center">Nenhum documento enviado.</p>
            ) : (
              documentos.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--hover-bg)] transition">
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{getDocumentoLabel(doc)}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Enviado em {formatDatePt(doc.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={doc.status} />
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#2a2a2a] transition"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
