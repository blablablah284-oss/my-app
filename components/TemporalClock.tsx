
import React, { useState, useEffect } from 'react';

const TemporalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10); // High freq for ms
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, '0');
    return { h, m, s, ms };
  };

  const { h, m, s, ms } = formatTime(time);

  return (
    <div className="flex flex-col items-center gap-1 select-none pointer-events-none group">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start">
           <span className="text-[7px] font-mono text-[#ff0033] tracking-[0.4em] opacity-40 uppercase animate-pulse">
            EXISTENTIAL_DECAY_RATE
           </span>
           <div className="h-px w-full bg-[#ff0033]/20" />
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-3xl md:text-4xl font-mono font-black text-[#ff0033] tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,51,0.5)]">
            {h}:{m}:{s}
          </span>
          <span className="text-lg md:text-xl font-mono font-light text-[#ff0033]/60 tabular-nums w-[2ch]">
            .{ms}
          </span>
        </div>

        <div className="flex flex-col items-end">
           <span className="text-[7px] font-mono text-[#ff0033] tracking-[0.4em] opacity-40 uppercase animate-[flicker_3s_infinite]">
            TIME_WAITS_FOR_NONE
           </span>
           <div className="h-px w-full bg-[#ff0033]/20" />
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.1; }
          45% { opacity: 0.1; }
          46% { opacity: 0.6; }
          47% { opacity: 0.1; }
          50% { opacity: 0.8; }
          52% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default TemporalClock;
