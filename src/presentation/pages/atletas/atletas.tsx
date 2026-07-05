import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Medal, Search } from 'lucide-react';
import { useAtletaStore } from '../../../store/atleta.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Atletas: React.FC = () => {
  const { atletas, fetchAll, isLoading } = useAtletaStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll(1, 50);
  }, [fetchAll]);

  const filtered = search
    ? atletas.filter(a =>
        a.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
        a.bi.toLowerCase().includes(search.toLowerCase())
      )
    : atletas;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SEO title="Atletas" description="Perfil dos atletas angolanos registados na plataforma Sport Data Angola." canonical="/atletas" />
      <div className="relative h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1920&h=400&fit=crop"
          alt="Hero atletas"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-center px-8 max-w-5xl mx-auto">
          <p className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Angola · Atletas
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
            Atletas Registados
          </h1>
          <p className="text-white/60 text-base max-w-lg">
            Conheça os atletas registados na plataforma nacional de gestão desportiva.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar atleta..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-brand/50 transition text-sm"
          />
        </div>

        {isLoading ? (
          <SportLoadingScreen message="A carregar atletas..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum atleta encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((atleta, index) => (
              <motion.div
                key={atleta.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-full bg-brand/20 mx-auto mb-3 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-brand/30 transition-all">
                  {atleta.imagemUrl ? (
                    <img src={atleta.imagemUrl} alt={atleta.nomeCompleto} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-brand">{getInitials(atleta.nomeCompleto)}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate">{atleta.nomeCompleto}</h3>
                <p className="text-xs text-white/40 mt-0.5">{atleta.nacionalidade || 'Angola'}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-white/30">
                  <Medal className="w-3 h-3" />
                  <span>Atleta</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Atletas;
