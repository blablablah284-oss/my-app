
import React from 'react';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">
      <style>{`
        @keyframes temporal-flow {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .particle {
          position: absolute;
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
          animation: temporal-flow 10s linear infinite;
        }
      `}</style>

      {/* Deep Gradient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,10,12,1)_0%,rgba(2,2,2,1)_100%)]" />
      
      {/* Temporal Flow Particles */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 7}s`
          }}
        />
      ))}

      {/* Structural Mental Pressure Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
        <div 
          className="w-[180vw] h-[180vw] border-[0.5px] border-white rounded-full"
          style={{ animation: 'orbit 400s linear infinite' }}
        />
        <div 
          className="absolute w-[150vw] h-[150vw] border-[0.5px] border-white rounded-full"
          style={{ animation: 'orbit 600s linear infinite reverse' }}
        />
      </div>

      {/* Grain for Psychological Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.02] mix-blend-overlay" />
      
      {/* Heavy Breathing Shadow */}
      <div 
        className="absolute inset-0 bg-black/40"
        style={{ animation: 'core-pulse 15s ease-in-out infinite' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
};

export default BackgroundAnimation;
