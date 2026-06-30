import React from 'react';

interface AngolaFlagBarProps {
  className?: string;
  height?: string;
  rounded?: boolean;
  bottom?: boolean;
}

const AngolaFlagBar: React.FC<AngolaFlagBarProps> = ({
  className = '',
  height = 'h-1',
  rounded = false,
  bottom = false,
}) => {
  return (
    <div
      className={`
        fixed left-0 flex w-full z-30 overflow-hidden
        ${height}
        ${rounded ? 'rounded-full' : ''}
        ${bottom ? 'bottom-0' : 'top-0'}
        ${className}
      `}
    >
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-yellow-400" />
      <div className="flex-1 bg-brand" />
    </div>
  );
};

export default AngolaFlagBar;
