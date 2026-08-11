import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Calendar, User, Flag, Award, Shield } from 'lucide-react';
import { useAtletaStore } from '../../../store/atleta.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const AtletaDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedAtleta, isLoading, fetchById } = useAtletaStore();

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

  if (isLoading) return <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex items-center justify-center"><SportLoadingScreen message="A carregar..." size="md" /></div>;
  if (!selectedAtleta) return <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">🔍</p><p className="text-lg">Atleta não encontrado</p><Link to="/atletas" className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline"><ArrowLeft className="w-4 h-4" />Voltar aos atletas</Link></div></div>;

  const a = selectedAtleta;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title={a.nomeCompleto} description={`Perfil do atleta ${a.nomeCompleto} — Sport Data Angola.`} canonical={`/atletas/${a.id}`} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/atletas" className="inline-flex items-center gap-2 text-gray-500 dark:text-white/50 text-sm font-bold mb-8 hover:text-gray-900 dark:hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" />Voltar aos atletas</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-brand/20 flex items-center justify-center shrink-0 ring-2 ring-white/10 text-4xl font-black text-brand">
              {a.imagemUrl ? <img src={a.imagemUrl} alt={a.nomeCompleto} className="w-full h-full object-cover rounded-2xl" /> : a.nomeCompleto.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{a.nomeCompleto}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-white/40">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{a.genero === 'M' ? 'Masculino' : 'Feminino'}</span>
                <span className="flex items-center gap-1.5"><Flag className="w-4 h-4" />{a.nacionalidade || 'Angola'}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{a.dataNascimento ? new Date(a.dataNascimento).toLocaleDateString('pt-PT') : 'N/D'}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {a.bi && <InfoCard icon={Shield} label="BI" value={a.bi} />}
            {a.passaporte && <InfoCard icon={Shield} label="Passaporte" value={a.passaporte} />}
            {a.email && <InfoCard icon={Mail} label="Email" value={a.email} />}
            {a.morada && <InfoCard icon={MapPin} label="Morada" value={a.morada} />}
            {a.peso != null && <InfoCard icon={Award} label="Peso" value={`${a.peso} kg`} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-4">
    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center"><Icon className="w-5 h-5 text-brand" /></div>
    <div><p className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">{label}</p><p className="text-sm font-bold">{value}</p></div>
  </div>
);

export default AtletaDetalhe;
