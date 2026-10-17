import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  Calendar,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';
import { useArbitroStore } from '../../../store/arbitro.store';
import { CATEGORIA_ARBITRO_LABELS, FAIXA_ARBITRO_LABELS } from '@core/types/arbitro.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const FAIXA_STYLES: Record<string, string> = {
  BRANCA: 'bg-white text-gray-900 border border-gray-300',
  AZUL: 'bg-blue-600 text-white',
  ROXA: 'bg-purple-700 text-white',
  MARROM: 'bg-amber-800 text-white',
  PRETA: 'bg-gray-900 text-white',
  CORAL: 'bg-red-700 text-white',
  VERMELHA: 'bg-red-600 text-white',
};

function formatDate(value: string | null): string {
  if (!value) return 'N/D';
  try {
    return new Date(value).toLocaleDateString('pt-PT');
  } catch {
    return value;
  }
}

const ArbitroDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedArbitro, isLoading, fetchById } = useArbitroStore();

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex items-center justify-center">
        <SportLoadingScreen message="A carregar..." size="md" />
      </div>
    );
  }

  if (!selectedArbitro) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg">Árbitro não encontrado</p>
          <Link
            to="/arbitros"
            className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos árbitros
          </Link>
        </div>
      </div>
    );
  }

  const a = selectedArbitro;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO
        title={a.nome}
        description={`${CATEGORIA_ARBITRO_LABELS[a.categoria]} ${a.nome} — faixa ${FAIXA_ARBITRO_LABELS[a.faixa]}. Sport Data Angola.`}
        canonical={`/arbitros/${a.id}`}
      />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/arbitros"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-white/50 text-sm font-bold mb-8 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos árbitros
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-brand/20 flex items-center justify-center shrink-0 ring-4 ring-white/10 overflow-hidden">
              {a.imagemUrl ? (
                <img src={a.imagemUrl} alt={a.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-brand">
                  {a.nome.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{a.nome}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {CATEGORIA_ARBITRO_LABELS[a.categoria]}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${FAIXA_STYLES[a.faixa]}`}
                >
                  Faixa {FAIXA_ARBITRO_LABELS[a.faixa]}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-3">
                {a.federacao?.nome ? `Federação de ${a.federacao.nome}` : 'Federação não associada'}
              </p>
            </div>
          </div>

          {a.bio && (
            <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-4">{a.bio}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={UserCheck} label="Categoria" value={CATEGORIA_ARBITRO_LABELS[a.categoria]} />
          <InfoCard icon={Award} label="Faixa" value={FAIXA_ARBITRO_LABELS[a.faixa]} />
          {a.numeroLicenca && (
            <InfoCard icon={ShieldCheck} label="Nº de Licença" value={a.numeroLicenca} />
          )}
          {a.anosExperiencia != null && (
            <InfoCard icon={Award} label="Experiência" value={`${a.anosExperiencia} anos`} />
          )}
          {a.dataNascimento && (
            <InfoCard icon={Calendar} label="Nascimento" value={formatDate(a.dataNascimento)} />
          )}
          {a.telefone && <InfoCard icon={Phone} label="Telefone" value={a.telefone} />}
          {a.email && <InfoCard icon={Mail} label="Email" value={a.email} />}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4">
    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-brand" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-bold truncate">{value}</p>
    </div>
  </div>
);

export default ArbitroDetalhe;