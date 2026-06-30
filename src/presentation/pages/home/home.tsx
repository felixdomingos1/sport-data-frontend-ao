import React from 'react';
import HeroSlider from '../../components/home/hero-slider';
import FeaturesSection from '../../components/home/features-section';
import LiveEvents from '../../components/home/live-events';
import ModalitiesSection from '../../components/home/modalities-section';
import CtaSection from '../../components/home/cta-section';

const Home: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a]">
      <HeroSlider />
      <FeaturesSection />
      <LiveEvents />
      <ModalitiesSection />
      <CtaSection />
    </div>
  );
};

export default Home;
