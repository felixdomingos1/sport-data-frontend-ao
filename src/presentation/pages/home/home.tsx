import React from 'react';
import AngolaFlagBar from '../../components/home/angola-flag-bar';
import HeroSlider from '../../components/home/hero-slider';
import LiveEvents from '../../components/home/live-events';
import ModalitiesSection from '../../components/home/modalities-section';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSlider />
      <LiveEvents />
      <ModalitiesSection />
      <AngolaFlagBar height="h-1" />
    </div>
  );
};

export default Home;
