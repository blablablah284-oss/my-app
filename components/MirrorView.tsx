
import React, { useState, useEffect } from 'react';
import { UserState, JournalEntry } from '../types';

interface MirrorViewProps {
  userState: UserState;
  onSave: (date: string, content: string) => void;
  onClose: () => void;
}

const MirrorView: React.FC<MirrorViewProps> = ({ userState, onSave, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState<string>('');
  const [showMirrorBoot, setShowMirrorBoot] = useState(true);

  useEffect(() => {
    const entry = userState.history[selectedDate];
    setContent(entry ? entry.content : '');
  }, [selectedDate, userState.history]);

  useEffect(() => {
    const timer = setTimeout(() => setShowMirrorBoot(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onSave(selectedDate, e.target.value);
  };

  const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  if (showMirrorBoot) {
    return (
      <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center overflow-hidden">
        <style>{`
          @keyframes layer-sink {
            0% { transform: scale(1.2); opacity: 0; filter: blur(20px); }
            50% { opacity: 0.1; filter: blur(5px); }
            100% { transform: scale(0.8); opacity: 0; filter: blur(40px); }
          }
          @keyframes inward-pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.98); }
          }
          .mirror-layer {
            position: absolute;
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            animation: layer-sink 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}</style>
        
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="mirror-layer rounded-lg"
            style={{
              width: `${200 + i * 150}px`,
              height: `${120 + i * 90}px`,
              animationDelay: `${i * -0.3}s`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="tracking-[1.5em] text-white/40 text-[10px] uppercase reflection-font italic font-light animate-[inward-pulse_2s_ease-in-out_infinite]">
            SUBJECTIVE_CALIBRATION
          </div>
          <div className="w-px h-12 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-[#050505] flex flex-col md:flex-row overflow-hidden animate-[fadeIn_0.6s_ease-out]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.01); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col gap-8 bg-black/40">
        <button 
          onClick={onClose}
          className="text-white/20 hover:text-white transition-all text-xs tracking-[0.3em] uppercase flex items-center gap-2 group font-mono"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> TERMINATE_AUDIT
        </button>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold font-mono">CHRONOS_SEQUENCE</h2>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map(date => {
              const hasEntry = userState.history[date]?.content.length > 0;
              const isSelected = selectedDate === date;
              const dayNum = date.split('-')[2];
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    h-7 w-full text-[9px] flex items-center justify-center rounded-sm transition-all font-mono
                    ${isSelected ? 'bg-white/10 text-white' : 'text-white/20 hover:bg-white/5'}
                    ${hasEntry && !isSelected ? 'border-b border-white/20' : ''}
                  `}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto opacity-20">
          <p className="text-[9px] leading-relaxed uppercase tracking-[0.3em] font-light italic reflection-font">
            "INTEGRITY IS THE HARMONY BETWEEN INTENT AND ACTION."
          </p>
        </div>
      </div>

      <div className="flex-1 p-8 md:p-16 flex flex-col relative bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent)]">
        <div className="mb-12">
          <span className="text-white/20 text-[9px] uppercase tracking-[0.5em] block mb-1 font-mono">TEMPORAL_COORDINATE</span>
          <h1 className="text-xl text-white/60 reflection-font italic tracking-wide">
            {new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </h1>
        </div>

        <textarea
          value={content}
          onChange={handleTextChange}
          placeholder="Analyze divergence and recalibrate intent..."
          className="flex-1 bg-transparent border-none outline-none resize-none text-white/70 reflection-font text-lg md:text-2xl leading-relaxed placeholder:text-white/5 transition-colors"
          autoFocus
        />

        <div className="absolute bottom-8 right-8 text-[9px] tracking-[0.3em] text-white/10 uppercase font-mono">
          QUANTIFIED_REFLECTION: {content.length} UNITS
        </div>
      </div>
    </div>
  );
};

export default MirrorView;
