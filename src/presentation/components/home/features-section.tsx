import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Trophy,
  FileText,
  BarChart3,
  Shield,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: User,
    title: 'Perfil do Atleta',
    description: 'Gerencie dados pessoais, documentos e filiação desportiva num painel dedicado.',
    link: '/register',
  },
  {
    icon: Trophy,
    title: 'Competições',
    description: 'Acompanhe inscrições, resultados e histórico de participações em tempo real.',
    link: '/eventos',
  },
  {
    icon: BarChart3,
    title: 'Rankings Nacionais',
    description: 'Consulte classificações por modalidade, categoria e época desportiva.',
    link: '/rankings',
  },
  {
    icon: FileText,
    title: 'Documentos Digitais',
    description: 'Envie e acompanhe a validação de documentos exigidos pelas federações.',
    link: '/register',
  },
  {
    icon: Shield,
    title: 'Federações & Clubes',
    description: 'Ecossistema integrado entre entidades desportivas em todo o território nacional.',
    link: '/federacoes',
  },
  {
    icon: Calendar,
    title: 'Calendário Desportivo',
    description: 'Fique a par dos próximos eventos, campeonatos e competições oficiais.',
    link: '/eventos',
  },
];

const FeaturesSection: React.FC = () => (
  <section className="py-20 lg:py-28 bg-[#0a0a0a] border-t border-[#1a1a1a]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-[10px] font-semibold text-[#E60000] uppercase tracking-widest mb-3">
          Funcionalidades
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Tudo o que o desporto angolano precisa
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Uma plataforma completa para atletas, técnicos, federações e fãs do desporto nacional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="group bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#E60000]/30 transition"
            >
              <div className="w-11 h-11 bg-[#E60000]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E60000]/20 transition">
                <Icon className="w-5 h-5 text-[#E60000]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{feature.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#E60000] font-medium group-hover:gap-2 transition-all">
                Saber mais
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
