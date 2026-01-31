import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(target: Date): TimeLeft {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  const labels = {
    en: {
      days: 'days',
      hours: 'hours',
      minutes: 'min',
      seconds: 'sec',
      energyChanges: 'Your energy changes in'
    },
    da: {
      days: 'dage',
      hours: 'timer',
      minutes: 'min',
      seconds: 'sek',
      energyChanges: 'Din energi ændres om'
    }
  };

  const t = labels[language];

  return (
    <div className={`text-center ${className}`}>
      <p className="text-purple-300/80 text-sm mb-3">{t.energyChanges}</p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 min-w-[60px] sm:min-w-[70px]">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-purple-300/80 text-xs mt-1.5 bg-purple-900/30 px-2 py-0.5 rounded">{t.days}</span>
        </div>

        <span className="text-purple-400/60 text-xl font-light">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 min-w-[60px] sm:min-w-[70px]">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-purple-300/80 text-xs mt-1.5 bg-purple-900/30 px-2 py-0.5 rounded">{t.hours}</span>
        </div>

        <span className="text-purple-400/60 text-xl font-light">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 min-w-[60px] sm:min-w-[70px]">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-purple-300/80 text-xs mt-1.5 bg-purple-900/30 px-2 py-0.5 rounded">{t.minutes}</span>
        </div>

        <span className="text-purple-400/60 text-xl font-light hidden sm:inline">:</span>

        {/* Seconds - hidden on very small screens */}
        <div className="flex-col items-center hidden sm:flex">
          <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 min-w-[60px] sm:min-w-[70px]">
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-purple-300/80 text-xs mt-1.5 bg-purple-900/30 px-2 py-0.5 rounded">{t.seconds}</span>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
