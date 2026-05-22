import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import {
  Trophy,
  Shield,
  Dumbbell,
  Activity,
  Timer,
  Medal,
} from 'lucide-react';

import { useFederacaoStore } from '../../../store/federacao.store';
import { useAtletaStore } from '../../../store/atleta.store';
import AngolaFlagBar from './angola-flag-bar';

const HeroSlider: React.FC = () => {
  const { federacoes, fetchAll: fetchFederacoes } = useFederacaoStore();
  const { atletas, fetchAll: fetchAtletas } = useAtletaStore();

  useEffect(() => {
    fetchFederacoes(1, 100);
    fetchAtletas(1, 100);
  }, []);

  const federacoesCount = Array.isArray(federacoes) ? federacoes.length : 0;
  const atletasCount = Array.isArray(atletas) ? atletas.length : 0;

  const slides = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1600&auto=format&fit=crop',
      title: 'Jiu-Jitsu Nacional & Internacional',
      subtitle:
        'Acompanhe os melhores atletas angolanos em competições de alto nível.',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-yellow-500/40 to-black/80',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop',
      title: 'Futebol Angolano em Destaque',
      subtitle:
        'Campeonatos, clubes, rankings e talentos do futebol nacional.',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-red-600/40 to-black/80',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop',
      title: 'Basquetebol Nacional',
      subtitle: 'Resultados e estatísticas do basquetebol em Angola.',
      icon: <Medal className="w-8 h-8" />,
      color: 'from-orange-500/40 to-black/80',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop',
      title: 'Ginástica & Performance',
      subtitle: 'Precisão, disciplina e excelência desportiva.',
      icon: <Activity className="w-8 h-8" />,
      color: 'from-pink-500/40 to-black/80',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop',
      title: 'Atletismo & Corridas',
      subtitle: 'Velocidade, resistência e superação.',
      icon: <Timer className="w-8 h-8" />,
      color: 'from-green-500/40 to-black/80',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
      title: 'Treino & Condicionamento',
      subtitle: 'Força e preparação de atletas de elite.',
      icon: <Dumbbell className="w-8 h-8" />,
      color: 'from-blue-500/40 to-black/80',
    },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden">

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        slidesPerView={1}
        loop
        speed={1200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full h-screen"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-screen overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              <div
                className={`absolute inset-0 bg-linear-to-r ${slide.color}`}
              />
              <div className="absolute inset-0 bg-black/20" />
              <AngolaFlagBar height="h-1" />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">

                  {/* BADGE */}
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white mb-6 shadow-2xl">
                    {slide.icon}
                    <span className="text-sm md:text-base font-medium tracking-wide">
                      SPORT DATA ANGOLA
                    </span>
                  </div>

                  {/* TITLE */}
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  {/* SUBTITLE */}
                  <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl">
                    {slide.subtitle}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-10 flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-red-600 hover:bg-red-700 transition rounded-2xl text-white font-bold shadow-2xl hover:scale-105">
                      Explorar Competições
                    </button>

                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition rounded-2xl text-white font-semibold">
                      Ver Rankings
                    </button>
                  </div>

                  <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Federações', value: federacoesCount },
                      { label: 'Atletas', value: atletasCount },
                      { label: 'Províncias', value: 21 },
                      { label: 'Competições', value: 300 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4"
                      >
                        <h3 className="text-2xl md:text-3xl font-black text-white">
                          {item.value}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <AngolaFlagBar bottom height="h-1" />
    </section>
  );
};

export default HeroSlider;
