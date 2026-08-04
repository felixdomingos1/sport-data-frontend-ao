import React from 'react';
import HeroSlider from '../../components/home/hero-slider';
import FeaturesSection from '../../components/home/features-section';
import LiveEvents from '../../components/home/live-events';
import DestaqueCampeonatos from '../../components/home/destaque-campeonatos';
import ModalitiesSection from '../../components/home/modalities-section';
import CtaSection from '../../components/home/cta-section';
import { SEO } from '../../components/seo/seo';

const Home: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a]">
      <SEO title="Início" description="Sport Data Angola — Plataforma angolana de gestão desportiva. Federações, atletas, clubes, competições e rankings." canonical="/" />
      <HeroSlider />
      <FeaturesSection />
      <LiveEvents />
      <DestaqueCampeonatos />
      <ModalitiesSection />
      <CtaSection />
    </div>
  );
};

export default Home;
