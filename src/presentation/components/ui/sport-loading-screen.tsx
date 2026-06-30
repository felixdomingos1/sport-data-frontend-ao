import React from 'react';
import SportLoading3D from './sport-loading-3d';

interface SportLoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SportLoadingScreen: React.FC<SportLoadingScreenProps> = ({
  message = 'A carregar...',
  fullscreen = true,
  size = 'lg',
}) => {
  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E6000012_0%,_transparent_70%)]" />
        <SportLoading3D message={message} size={size} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-16 min-h-[280px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <SportLoading3D message={message} size={size} />
    </div>
  );
};

export default SportLoadingScreen;
