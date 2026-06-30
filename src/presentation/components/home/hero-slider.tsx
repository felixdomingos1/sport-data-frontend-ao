import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Trophy, Users, Building2 } from 'lucide-react';
import { useFederacaoStore } from '../../../store/federacao.store';
import { useAtletaStore } from '../../../store/atleta.store';

const HERO_BG =
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80';

const HeroSlider: React.FC = () => {
  const { federacoes, fetchAll: fetchFederacoes } = useFederacaoStore();
  const { atletas, fetchAll: fetchAtletas } = useAtletaStore();

  useEffect(() => {
    fetchFederacoes(1, 100);
    fetchAtletas(1, 100);
  }, [fetchFederacoes, fetchAtletas]);

  const federacoesCount = Array.isArray(federacoes) ? federacoes.length : 18;
  const atletasCount = Array.isArray(atletas) ? atletas.length : 1000;

  const stats = [
    { label: 'Atletas registados', value: `${atletasCount}+`, icon: Users },
    { label: 'Federações activas', value: federacoesCount || 18, icon: Building2 },
    { label: 'Competições', value: '7+', icon: Trophy },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black pt-16 lg:pt-[72px]">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E60000]/10 border border-[#E60000]/20 text-[#E60000] text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield className="w-3.5 h-3.5" />
            Plataforma Nacional
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Gestão Desportiva
            <span className="block text-[#E60000]">de Angola</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
            A plataforma oficial que conecta atletas, federações, associações e academias.
            Rankings, competições e documentos num só lugar.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#E60000] hover:bg-[#cc0000] text-white font-semibold rounded-xl transition"
            >
              Criar conta gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/rankings"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#0f0f0f]/60 text-white font-medium rounded-xl transition"
            >
              Ver Rankings
            </Link>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#0f0f0f]/80 backdrop-blur-sm border border-[#1a1a1a] rounded-2xl p-5"
              >
                <Icon className="w-5 h-5 text-[#E60000] mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
