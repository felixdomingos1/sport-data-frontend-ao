import React from 'react';
import { useLoadingStore } from '@/store/loading.store';
import SportLoadingScreen from './sport-loading-screen';

const GlobalLoadingOverlay: React.FC = () => {
  const { visible, message } = useLoadingStore();

  if (!visible) return null;

  return <SportLoadingScreen message={message} fullscreen />;
};

export default GlobalLoadingOverlay;
