
import React, { useEffect, useState, useRef } from 'react';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 6500;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      
      if (currentProgress < 25) setStage(0);
      else if (currentProgress < 55) setStage(1);
      else if (currentProgress < 85) setStage(2);
      else setStage(3);

      progressRef.current = currentProgress;
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestRef.current = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(onComplete, 800);
      }
    };

    requestRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden font-mono perspective-container will-change-transform">
      {/* Structural Geometry Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff 1px,transparent 1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 border-[0.5px] border-white/10 m-20" />
      </div>

      {/* Advanced Atomic/4D Engine */}
      <div className={`relative w-80 h-80 preserve-3d transition-all duration-[2000ms] ease-in-out ${stage === 3 ? 'scale-[30] opacity-0 rotate-z-[90deg]' : 'scale-100'}`}>
        
        {/* Orbit Shells (The "Atomic" Paths) */}
        {[...Array(4)].map((_, i) => (
          <div 
            key={`orbit-${i}`}
            className="absolute inset-0 border-[0.5px] border-white/10 rounded-[50%] preserve-3d will-change-transform"
            style={{
              transform: `rotateX(${45 + i * 30}deg) rotateY(${i * 60}deg) rotateZ(0deg)`,
              animation: `orbital-spin-${i} ${8 + i * 4}s linear infinite`
            }}
          >
            {/* Electron Particle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full shadow-[0_0_10px_white]">
              <div className="absolute inset-0 animate-ping bg-white/20 rounded-full" />
            </div>
          </div>
        ))}

        {/* Vector Field Lattice */}
        <div className="absolute inset-0 animate-[hyper-rotate_40s_linear_infinite] opacity-40">
           {[...Array(12)].map((_, i) => (
             <div 
               key={`lat-${i}`}
               className="absolute top-1/2 left-1/2 w-[1px] h-[320px] bg-gradient-to-b from-transparent via-white/10 to-transparent origin-center"
               style={{ transform: `rotate(${i * 30}deg)` }}
             />
           ))}
        </div>

        {/* 4D Tesseract Core */}
        <div className="absolute inset-20 preserve-3d animate-[hyper-rotate_20s_linear_infinite_reverse]">
          {[...Array(3)].map((_, i) => (
            <div 
              key={`core-layer-${i}`}
              className="absolute inset-0 border border-white/20 flex items-center justify-center bg-white/[0.005]"
              style={{
                transform: `rotate${i === 0 ? 'X' : i === 1 ? 'Y' : 'Z'}(45deg) translateZ(${20 + i * 10}px)`
              }}
            >
              <div className="w-12 h-12 border-[0.2px] border-white/40 rotate-45" />
            </div>
          ))}
        </div>

        {/* The Singularity */}
        <div className="absolute inset-[130px] preserve-3d">
           <div className="absolute inset-0 bg-white/80 rounded-sm animate-[singularity-pulse_2s_ease-in-out_infinite] shadow-[0_0_30px_white]" />
           <div className="absolute inset-[-10px] border-[0.5px] border-white/10 animate-[spin_4s_linear_infinite]" />
           <div className="absolute inset-[-20px] border-[0.5px] border-white/5 animate-[spin_6s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Telemetry Module */}
      <div className="mt-32 w-80 space-y-10">
        <div className="space-y-4 px-2">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] tracking-[0.6em] text-white/40 uppercase">CORE_ALLOCATION</span>
              <span className="text-[6px] text-white/10 font-mono">NODE_HASH: 0x{Math.floor(progress * 153).toString(16).toUpperCase()}</span>
            </div>
            <span className="text-[14px] text-white font-black tracking-tighter tabular-nums shadow-white/10">{Math.floor(progress)}%</span>
          </div>
          <div className="h-[2px] w-full bg-white/5 relative">
            <div 
              className="absolute inset-y-0 left-0 bg-white shadow-[0_0_15px_white] transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="h-6 relative w-full overflow-hidden text-center">
          {[
            { s: 0, text: "INITIATING_NEURAL_STABILIZER" },
            { s: 1, text: "CALIBRATING_TEMPORAL_FLUX" },
            { s: 2, text: "HARDENING_CONSISTENCY_KERNEL" },
            { s: 3, text: "READY_FOR_VALIDATION" }
          ].map((item) => (
            <div 
              key={item.s}
              className={`absolute inset-0 text-[10px] tracking-[0.6em] text-white font-bold transition-all duration-700 font-mono flex items-center justify-center
                ${stage === item.s ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Peripheral Metadata */}
      <div className="absolute bottom-12 left-12 space-y-2 opacity-20 hidden md:block">
        <div className="h-px w-24 bg-white/40" />
        <div className="text-[7px] tracking-[0.5em] uppercase">SYSTEM_STATE: RECOVERING</div>
      </div>
      
      <div className="absolute top-12 right-12 text-right space-y-2 opacity-20 hidden md:block">
        <div className="text-[7px] tracking-[0.5em] uppercase">CORE_PROTOCOL_v4.1.2</div>
        <div className="h-px w-24 bg-white/40 ml-auto" />
      </div>

      <style>{`
        @keyframes singularity-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; filter: brightness(1.5); }
        }
        @keyframes orbital-spin-0 { from { transform: rotateX(45deg) rotateY(0deg) rotateZ(0deg); } to { transform: rotateX(45deg) rotateY(360deg) rotateZ(0deg); } }
        @keyframes orbital-spin-1 { from { transform: rotateX(75deg) rotateY(0deg) rotateZ(0deg); } to { transform: rotateX(75deg) rotateY(360deg) rotateZ(0deg); } }
        @keyframes orbital-spin-2 { from { transform: rotateX(105deg) rotateY(0deg) rotateZ(0deg); } to { transform: rotateX(105deg) rotateY(360deg) rotateZ(0deg); } }
        @keyframes orbital-spin-3 { from { transform: rotateX(135deg) rotateY(0deg) rotateZ(0deg); } to { transform: rotateX(135deg) rotateY(360deg) rotateZ(0deg); } }
        
        @keyframes hyper-rotate {
          from { transform: rotate3d(1, 1, 1, 0deg); }
          to { transform: rotate3d(1, 1, 1, 360deg); }
        }
      `}</style>
    </div>
  );
};

export default BootSequence;
