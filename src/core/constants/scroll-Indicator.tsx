import React from 'react';
import { useScrollProgress } from './scroll-progress';

const AngolaScrollBar: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed right-0 top-0 h-full w-1 z-50 bg-gray-200 dark:bg-gray-800">
      <div
        className="bg-black w-full transition-all duration-150"
        style={{
          height: `${Math.min(progress, 33)}%`,
        }}
      />
      <div
        className="bg-yellow-400 w-full transition-all duration-150"
        style={{
          height:
            progress > 33
              ? `${Math.min(progress - 33, 33)}%`
              : '0%',
        }}
      />
      <div
        className="bg-brand w-full transition-all duration-150"
        style={{
          height:
            progress > 66
              ? `${Math.min(progress - 66, 34)}%`
              : '0%',
        }}
      />
    </div>
  );
};

export default AngolaScrollBar;
