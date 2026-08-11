import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Calendar, Shield, Users } from 'lucide-react';
import { useClubeStore } from '../../../store/clube.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const ClubeDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedClube, isLoading, fetchById } = useClubeStore();

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

  if (isLoading) return <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex items-center justify-center"><SportLoadingScreen message="A carregar..." size="md" /></div>;
  if (!selectedClube) return <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">🔍</p><p className="text-lg">Clube não encontrado</p><Link to="/clubes" className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline"><ArrowLeft className="w-4 h-4" />Voltar aos clubes</Link></div></div>;

  const c = selectedClube;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title={c.nome} description={c.cidade ? `Clube ${c.nome} — ${c.cidade}, Angola.` : `Clube ${c.nome} — Sport Data Angola.`} canonical={`/clubes/${c.id}`} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/clubes" className="inline-flex items-center gap-2 text-gray-500 dark:text-white/50 text-sm font-bold mb-8 hover:text-gray-900 dark:hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" />Voltar aos clubes</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-brand/20 flex items-center justify-center shrink-0 text-4xl font-black text-brand overflow-hidden">
              {c.logo ? <img src={c.logo} alt={c.nome} className="w-full h-full object-cover" /> : <Shield className="w-12 h-12" />}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{c.nome}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-white/40">
                {c.cidade && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{c.cidade}</span>}
                {c.anoFundacao && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Fundado em {c.anoFundacao}</span>}
                <span className={`flex items-center gap-1.5 font-bold uppercase px-2 py-0.5 rounded text-xs ${c.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-400' : c.status === 'SUSPENSO' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{c.status}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.telefone && <InfoCard icon={Phone} label="Telefone" value={c.telefone} />}
            {c.email && <InfoCard icon={Mail} label="Email" value={c.email} />}
            {c.website && <InfoCard icon={Globe} label="Website" value={c.website} />}
            {c.endereco && <InfoCard icon={MapPin} label="Endereço" value={c.endereco} />}
            {c.federacao && <InfoCard icon={Shield} label="Federação" value={c.federacao.nome || c.federacaoId} />}
            {c.atletas && <InfoCard icon={Users} label="Atletas" value={`${c.atletas.length} registados`} />}
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

export default ClubeDetalhe;
