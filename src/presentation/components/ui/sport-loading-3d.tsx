import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import {
  FaFutbol,
  FaBasketballBall,
  FaSwimmer,
  FaRunning,
} from 'react-icons/fa';
import {
  GiBoxingGlove,
  GiKimono,
  GiTennisRacket,
} from 'react-icons/gi';
import { TbKarate } from 'react-icons/tb';

const SPORTS = [
  { Icon: FaFutbol, label: 'Futebol', color: '#22c55e' },
  { Icon: GiBoxingGlove, label: 'Boxe', color: '#E60000' },
  { Icon: GiKimono, label: 'Judô', color: '#3b82f6' },
  { Icon: TbKarate, label: 'Karaté', color: '#f59e0b' },
  { Icon: FaBasketballBall, label: 'Basquete', color: '#f97316' },
  { Icon: GiTennisRacket, label: 'Ténis', color: '#a3e635' },
  { Icon: FaSwimmer, label: 'Natação', color: '#06b6d4' },
  { Icon: FaRunning, label: 'Atletismo', color: '#ec4899' },
] as const;

interface SportLoading3DProps {
  message?: string;
  showSportLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { scene: 'sport-loader-scene--sm', core: 'sport-loader-core--sm' },
  md: { scene: 'sport-loader-scene--md', core: 'sport-loader-core--md' },
  lg: { scene: 'sport-loader-scene--lg', core: 'sport-loader-core--lg' },
};

const SportLoading3D: React.FC<SportLoading3DProps> = ({
  message = 'A carregar...',
  showSportLabel = true,
  size = 'lg',
}) => {
  const [activeSport, setActiveSport] = useState(0);
  const classes = sizeMap[size];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSport((prev) => (prev + 1) % SPORTS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const ringA = SPORTS.slice(0, 4);
  const ringB = SPORTS.slice(4, 8);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div className={`sport-loader-scene ${classes.scene}`}>
        <div className={`sport-loader-core ${classes.core}`}>
          <div className="sport-loader-sphere" aria-hidden />

          <div className="sport-loader-ring sport-loader-ring--horizontal">
            {ringA.map((sport, index) => (
              <div
                key={sport.label}
                className="sport-loader-icon"
                style={{ '--slot': index, '--total': ringA.length } as React.CSSProperties}
              >
                <div
                  className="sport-loader-icon-inner"
                  style={{ backgroundColor: `${sport.color}18`, borderColor: `${sport.color}55` }}
                >
                  <sport.Icon style={{ color: sport.color }} aria-hidden />
                </div>
              </div>
            ))}
          </div>

          <div className="sport-loader-ring sport-loader-ring--vertical">
            {ringB.map((sport, index) => (
              <div
                key={sport.label}
                className="sport-loader-icon"
                style={{ '--slot': index, '--total': ringB.length } as React.CSSProperties}
              >
                <div
                  className="sport-loader-icon-inner"
                  style={{ backgroundColor: `${sport.color}18`, borderColor: `${sport.color}55` }}
                >
                  <sport.Icon style={{ color: sport.color }} aria-hidden />
                </div>
              </div>
            ))}
          </div>

          <div className="sport-loader-center">
            <Shield className="sport-loader-shield" strokeWidth={1.5} aria-hidden />
          </div>
        </div>

        <div className="sport-loader-floor" aria-hidden />
        <div className="sport-loader-glow" aria-hidden />
      </div>

      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-base lg:text-lg tracking-wide">{message}</p>
        {showSportLabel && (
          <p className="text-sm text-gray-500 sport-loader-label-fade" key={activeSport}>
            {SPORTS[activeSport].label}
          </p>
        )}
      </div>
    </div>
  );
};

export default SportLoading3D;
