
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppStage, UserState, JournalEntry } from './types';
import BootSequence from './components/BootSequence';
import BackgroundAnimation from './components/BackgroundAnimation';
import MirrorView from './components/MirrorView';
import TemporalClock from './components/TemporalClock';
import { playBootSound, playExecuteSound, playInterfaceSound, resumeAudioContext } from './utils/audio';

const STORAGE_KEY = 'core_discipline_state';
const COMMIT_HOLD_DURATION = 2000;

const LOGIC_AXIOMS = [
  "AXIOM::FRANKL: BETWEEN STIMULUS AND RESPONSE THERE IS A SPACE. IN THAT SPACE IS OUR POWER TO CHOOSE.",
  "AXIOM::JUNG: UNTIL YOU MAKE THE UNCONSCIOUS CONSCIOUS, IT WILL DIRECT YOUR LIFE AND YOU WILL CALL IT FATE.",
  "AXIOM::STROUSTRUP: DESIGN AND PROGRAMMING ARE HUMAN ACTIVITIES; FORGET THAT AND ALL IS LOST.",
  "AXIOM::AURELIUS: YOU HAVE POWER OVER YOUR MIND - NOT OUTSIDE EVENTS. REALIZE THIS, AND YOU WILL FIND STRENGTH.",
  "AXIOM::TURING: WE CAN ONLY SEE A SHORT DISTANCE AHEAD, BUT WE CAN SEE PLENTY THERE THAT NEEDS TO BE DONE.",
  "AXIOM::NIETZSCHE: HE WHO HAS A WHY TO LIVE CAN BEAR ALMOST ANY HOW.",
  "AXIOM::BROOKS: THE BEARING OF A CHILD TAKES NINE MONTHS, NO MATTER HOW MANY WOMEN ARE ASSIGNED."
];

const defaultState: UserState = {
  streak: 0,
  lastExecutionDate: null,
  history: {}
};

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INIT);
  const [userState, setUserState] = useState<UserState>(defaultState);
  const [executing, setExecuting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUserState(JSON.parse(saved));
      } catch (e) {
        console.error("Critical: State restoration failure", e);
      }
    }

    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % LOGIC_AXIOMS.length);
    }, 15000);
    return () => clearInterval(quoteInterval);
  }, []);

  const initiateSystem = async () => {
    // Resume audio context and play sound on manual interaction
    try {
      await resumeAudioContext();
      playInterfaceSound();
    } catch (e) {
      console.warn("Audio initiation failed:", e);
    }
    setStage(AppStage.BOOT);
  };

  const handleBootComplete = async () => {
    setStage(AppStage.MAIN);
    try {
      await playBootSound();
    } catch (e) {
      // Fallback if audio still locked
    }
  };

  const saveState = useCallback((newState: UserState) => {
    setUserState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const updateJournal = useCallback((date: string, content: string) => {
    setUserState(prev => {
      const newState = {
        ...prev,
        history: {
          ...prev.history,
          [date]: { date, content }
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const finalizeExecution = () => {
    const today = new Date().toISOString().split('T')[0];
    setExecuting(true);
    playExecuteSound();

    setTimeout(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = userState.streak;
      if (userState.lastExecutionDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      saveState({
        ...userState,
        streak: newStreak,
        lastExecutionDate: today
      });
      setExecuting(false);
      setHoldProgress(0);
    }, 1500);
  };

  const startHold = () => {
    const today = new Date().toISOString().split('T')[0];
    if (userState.lastExecutionDate === today || executing) return;

    resumeAudioContext();
    playInterfaceSound();
    
    startTimeRef.current = Date.now();
    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / COMMIT_HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        finalizeExecution();
      }
    }, 20);
  };

  const endHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const isTodayExecuted = userState.lastExecutionDate === new Date().toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden perspective-container">
      {stage !== AppStage.INIT && <BackgroundAnimation />}
      
      <div className="scanline" />

      {stage === AppStage.INIT && (
        <div 
          onClick={initiateSystem}
          className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-6 cursor-pointer group"
        >
          <div className="relative space-y-24 flex flex-col items-center group-active:scale-95 transition-transform duration-300">
            <div className="space-y-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-t border-white/60 rounded-full animate-spin duration-[4s]" />
                <h2 className="text-white/20 text-[10px] tracking-[1.2em] uppercase font-mono">NEURAL_HANDSHAKE</h2>
              </div>
            </div>

            <div className="relative px-20 py-10">
              <div className="absolute inset-0 border-[0.5px] border-white/5 group-hover:border-white/20 transition-all duration-700" />
              <div className="absolute inset-0 bg-white/[0.01] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 text-white/30 group-hover:text-white transition-all text-[14px] tracking-[1.5em] uppercase font-mono">
                ENTER_CONSCIOUSNESS
              </span>
            </div>

            <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase font-mono animate-pulse">
              INTENT_DETECTION_ACTIVE
            </p>
          </div>
        </div>
      )}

      {stage === AppStage.BOOT && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {stage === AppStage.MAIN && (
        <main className="relative z-30 flex flex-col items-center justify-between min-h-screen py-16 px-8 overflow-hidden animate-[fadeIn_0.8s_ease-out]">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; filter: brightness(0); transform: translateY(10px); }
              to { opacity: 1; filter: brightness(1); transform: translateY(0); }
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>

          {/* Existential Pressure Module */}
          <div className="w-full flex justify-center">
             <TemporalClock />
          </div>

          {/* Metric Core */}
          <div className="flex flex-col items-center text-center relative preserve-3d py-10">
            <div className="relative mb-6">
              <span className="text-white/20 text-[9px] uppercase tracking-[2.5em] block mb-2 font-mono ml-[1.25em]">CONSISTENCY_INDEX</span>
              <div className="h-px w-24 bg-white/5 mx-auto" />
            </div>

            <div className="relative">
              <h1 className="text-[220px] md:text-[340px] font-black text-white leading-[0.85] tracking-tighter opacity-100 select-none font-sans scale-y-[1.05] will-change-transform transition-transform duration-1000"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    textShadow: '0 0 50px rgba(255,255,255,0.03)'
                  }}>
                {userState.streak}
              </h1>
            </div>
            
            <div className="mt-12 space-y-4">
              {!isTodayExecuted ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-white/30 text-[9px] tracking-[1.2em] uppercase font-bold animate-pulse font-mono ml-[0.6em]">
                    DIVERGENCE_DETECTED
                  </p>
                  <div className="w-[0.5px] h-16 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-white/50 text-[10px] tracking-[1em] uppercase font-bold font-mono ml-[0.5em]">STATE_HARDENED</p>
                  <div className="w-2 h-2 bg-white/40 rotate-45 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Controller */}
          <div className="w-full max-w-sm flex flex-col items-center gap-12">
            <div className="relative w-full flex flex-col items-center">
              <div 
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className={`
                  relative w-full py-14 flex flex-col items-center justify-center border border-white/5 
                  bg-black/80 backdrop-blur-xl transition-all duration-700 cursor-pointer group/btn overflow-hidden
                  ${isTodayExecuted ? 'opacity-20 grayscale pointer-events-none' : 'hover:border-white/20 hover:scale-[1.01] active:scale-[0.98]'}
                `}
              >
                <div 
                  className="absolute left-0 bottom-0 h-[1.5px] bg-white transition-none"
                  style={{ width: `${holdProgress}%`, boxShadow: '0 0 15px white' }}
                />
                
                <span className={`
                  text-[11px] tracking-[1.5em] font-mono transition-colors duration-300 ml-[0.75em]
                  ${holdProgress > 0 ? 'text-white' : 'text-white/30 group-hover/btn:text-white/60'}
                `}>
                  {executing ? 'STABILIZING...' : isTodayExecuted ? 'CONSISTENCY_LOCKED' : 'VALIDATE_INTENT'}
                </span>
              </div>
              
              <div className="mt-12">
                <button 
                  onClick={() => { playInterfaceSound(); setStage(AppStage.MIRROR); }}
                  className="group relative px-16 py-6 overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />
                  <span className="relative z-10 text-white/15 group-hover:text-white/70 transition-all text-[12px] tracking-[1.8em] uppercase font-mono italic font-light ml-[0.9em]">
                    MIRROR
                  </span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[0.5px] bg-white/20 group-hover:w-3/4 transition-all duration-700 ease-out" />
                </button>
              </div>
            </div>
            
            <div className="text-center w-full max-w-sm h-12 flex items-center justify-center pointer-events-none select-none px-4">
              <span key={currentQuoteIndex} className="text-[8px] tracking-[0.4em] uppercase font-mono text-white/15 animate-[logFade_15s_linear_infinite] leading-relaxed">
                {LOGIC_AXIOMS[currentQuoteIndex]}
              </span>
            </div>
          </div>

          {executing && (
            <div className="fixed inset-0 z-[60] pointer-events-none execute-flash" />
          )}
          
          <style>{`
            @keyframes logFade {
              0%, 100% { opacity: 0; filter: blur(4px); transform: translateY(2px); }
              50% { opacity: 1; filter: blur(0px); transform: translateY(0); }
            }
          `}</style>
        </main>
      )}

      {stage === AppStage.MIRROR && (
        <MirrorView 
          userState={userState}
          onSave={updateJournal}
          onClose={() => { playInterfaceSound(); setStage(AppStage.MAIN); }}
        />
      )}
    </div>
  );
};

export default App;
