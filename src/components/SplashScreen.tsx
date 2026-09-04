import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Compass, 
  CheckCircle2
} from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

interface FootstepPoint {
  id: number;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  angle: number; // rotation in degrees
  isLeft: boolean;
  landmark?: { name: string; icon: string };
}

// 7 crisp, brisk footsteps along a winding path (fast & responsive)
const FOOTSTEPS_PATH: FootstepPoint[] = [
  { id: 1, x: 20, y: 80, angle: -30, isLeft: true, landmark: { name: 'Mulai', icon: '🚩' } },
  { id: 2, x: 32, y: 68, angle: -40, isLeft: false, landmark: { name: 'Stasiun', icon: '🚂' } },
  { id: 3, x: 50, y: 62, angle: 20, isLeft: true },
  { id: 4, x: 68, y: 54, angle: 45, isLeft: false, landmark: { name: 'Kantor Pos', icon: '📮' } },
  { id: 5, x: 74, y: 38, angle: 100, isLeft: true },
  { id: 6, x: 58, y: 28, angle: 160, isLeft: false, landmark: { name: 'Museum', icon: '🏛️' } },
  { id: 7, x: 42, y: 25, angle: -120, isLeft: true, landmark: { name: 'Selesai', icon: '🏁' } },
];

const STEP_START_DELAY_MS = 220;
const STEP_TEMPO_MS = 360;
const FINAL_STEP_PAUSE_MS = 720;
const AUTO_COMPLETE_DELAY_MS = 2600;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [stampLanded, setStampLanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize Web Audio sound effects
  const playFootstepSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Audio fallback
    }
  };

  const playStampThudSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Punchy deep rubber stamp impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);

      // Noise punch for rubber stamp texture
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      whiteNoise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();
    } catch {
      // Audio fallback
    }
  };

  // Fast & snappy step-by-step animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStepIndex < FOOTSTEPS_PATH.length - 1) {
      timer = setTimeout(() => {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        playFootstepSound();
      }, currentStepIndex === -1 ? STEP_START_DELAY_MS : STEP_TEMPO_MS);
    } else if (currentStepIndex === FOOTSTEPS_PATH.length - 1 && !stampLanded) {
      // All footsteps finished, trigger grand stamp slam quickly (200ms delay)
      timer = setTimeout(() => {
        setStampLanded(true);
        setIsScreenShaking(true);
        playStampThudSound();

        // Confetti ink burst
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: 0.5, y: 0.45 },
          colors: ['#2563EB', '#F59E0B', '#10B981', '#ffffff', '#1E293B'],
          ticks: 150,
        });

        setTimeout(() => setIsScreenShaking(false), 350);

        // Give the completed route a moment before leaving the splash screen.
        setTimeout(() => {
          onComplete();
        }, AUTO_COMPLETE_DELAY_MS);
      }, FINAL_STEP_PAUSE_MS);
    }

    return () => clearTimeout(timer);
  }, [currentStepIndex, stampLanded, isMuted, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAFAF9] text-zinc-900 select-none overflow-hidden ${
        isScreenShaking ? 'animate-rumble' : ''
      }`}
    >
      {/* Background Topo & Soft Ambient Glow */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-rose-600 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500 pointer-events-none" />

      {/* Main Interactive Stage */}
      <div className="relative z-10 w-full flex-1 max-w-5xl mx-auto flex flex-col items-center justify-center px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            Stamp Hunter <span className="text-rose-600">Indonesia</span>
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Jejak berburu stempel Nusantara
          </p>
        </div>
        
        {/* Curving Trail Container */}
        <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] max-h-[54vh] sm:max-h-[58vh] p-3 sm:p-5 overflow-hidden">
          {/* <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-10 flex items-start justify-between pointer-events-none">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900 text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Rute Perburuan</span>
            </div>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900 text-white shadow-sm text-[9px] sm:text-[10px] font-bold tracking-wide">
              {Math.max(currentStepIndex + 1, 0)} / {FOOTSTEPS_PATH.length}
            </div>
          </div> */}
          
          {/* Topographic Background Contour SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80 Q200,40 400,120 T800,90" fill="none" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 8" />
            <path d="M0,200 Q300,160 500,240 T900,180" fill="none" stroke="#A1A1AA" strokeWidth="1" strokeDasharray="4 8" />
            <path d="M0,320 Q200,380 600,290 T900,340" fill="none" stroke="#FB7185" strokeWidth="1" strokeDasharray="3 6" />
          </svg>

          {/* Winding Curving Trail SVG Guide Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 20,80 Q 26,72 32,68 T 50,62 T 68,54 Q 74,46 74,38 Q 66,31 58,28 Q 50,25 42,25"
              fill="none"
              stroke="rgba(225, 29, 72, 0.42)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
          </svg>

          {/* Footsteps Rendered Along the Winding Curve */}
          {FOOTSTEPS_PATH.map((step, idx) => {
            const isVisible = idx <= currentStepIndex;
            const isLatest = idx === currentStepIndex;
            const isFinalStep = idx === FOOTSTEPS_PATH.length - 1;

            return (
              <div
                key={step.id}
                className="absolute transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${step.x}%`,
                  top: `${step.y}%`,
                }}
              >
                {/* Landmark Checkpoint Badge if available */}
                {step.landmark && (!isFinalStep || !stampLanded) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0.2, 
                      scale: isVisible ? 1 : 0.8,
                      y: isVisible ? 0 : 4
                    }}
                    transition={{ duration: 0.2 }}
                    className={`splash-landmark splash-landmark-${step.id} absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1 border shadow-xs ${
                      isVisible 
                        ? 'bg-white text-zinc-800 border-rose-400 ring-2 ring-rose-500/20' 
                        : 'bg-white/70 text-zinc-500 border-zinc-300'
                    }`}
                  >
                    <span>{step.landmark.icon}</span>
                    <span>{step.landmark.name}</span>
                  </motion.div>
                )}

                {/* Footstep Sole SVG */}
                <AnimatePresence>
                  {(!isFinalStep || !stampLanded) && (
                    <motion.div
                      initial={{ scale: 0.82, opacity: 0.28 }}
                      animate={{
                        scale: isVisible ? (isLatest ? 1.18 : 1) : 0.82,
                        opacity: isVisible ? (isLatest ? 1 : 0.88) : 0.28,
                      }}
                      transition={isVisible
                        ? { type: 'spring', stiffness: 500, damping: 22 }
                        : { duration: 0.2 }}
                      style={{
                        transform: `rotate(${step.angle}deg)`,
                      }}
                      className="relative"
                    >
                      {/* Glow ripple for latest step */}
                      {isLatest && !stampLanded && (
                        <div className="absolute inset-0 -m-2 rounded-full bg-blue-500/30 blur-xs animate-ping" />
                      )}

                      {/* Footprint SVG graphic */}
                      <svg 
                        width="28" 
                        height="40" 
                        viewBox="0 0 24 36" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`drop-shadow-sm ${isLatest ? 'text-amber-500' : isVisible ? 'text-rose-600' : 'text-rose-300/70'}`}
                      >
                        {step.isLeft ? (
                          // Left Footprint
                          <g fill="currentColor">
                            <ellipse cx="12" cy="27" rx="5" ry="6" />
                            <path d="M 8,14 C 7,19 8,23 12,23 C 16,23 17,19 16,14 C 16,10 8,10 8,14 Z" />
                            <ellipse cx="12" cy="11" rx="6.5" ry="5.5" />
                            <circle cx="7" cy="4" r="2.2" />
                            <circle cx="10.5" cy="3" r="1.8" />
                            <circle cx="13.5" cy="3.5" r="1.6" />
                            <circle cx="16" cy="4.5" r="1.4" />
                            <circle cx="18" cy="6" r="1.2" />
                          </g>
                        ) : (
                          // Right Footprint
                          <g fill="currentColor">
                            <ellipse cx="12" cy="27" rx="5" ry="6" />
                            <path d="M 8,14 C 7,19 8,23 12,23 C 16,23 17,19 16,14 C 16,10 8,10 8,14 Z" />
                            <ellipse cx="12" cy="11" rx="6.5" ry="5.5" />
                            <circle cx="17" cy="4" r="2.2" />
                            <circle cx="13.5" cy="3" r="1.8" />
                            <circle cx="10.5" cy="3.5" r="1.6" />
                            <circle cx="8" cy="4.5" r="1.4" />
                            <circle cx="6" cy="6" r="1.2" />
                          </g>
                        )}
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Final Destination Target Zone located precisely at final step */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              left: `${FOOTSTEPS_PATH[FOOTSTEPS_PATH.length - 1].x}%`, 
              top: `${FOOTSTEPS_PATH[FOOTSTEPS_PATH.length - 1].y}%` 
            }}
          >
            {/* Target Pulse Circle */}
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-rose-400/40 flex items-center justify-center ${
                  stampLanded ? 'opacity-0' : 'animate-spin'
                }`} 
                style={{ animationDuration: '12s' }} 
              />
              
              {!stampLanded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-600 animate-pulse">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* COMPACT ROUND CIRCULAR RUBBER STAMP IMPACT ANIMATION */}
            <AnimatePresence>
              {stampLanded && (
                <motion.div
                  initial={{ scale: 2.2, rotate: -20, opacity: 0, y: -40 }}
                  animate={{ scale: 1, rotate: -4, opacity: 1, y: 0 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 550, 
                    damping: 20,
                    mass: 0.8
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                >
                  {/* Expanding Shockwave Ring */}
                  <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-rose-400/70 animate-shockwave pointer-events-none" />
                  
                  {/* Full official stamp logo */}
                  <div 
                    className="relative w-40 h-40 sm:w-52 sm:h-52 select-none cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
                    onClick={onComplete}
                    title="Klik untuk langsung mulai berburu"
                  >
                    <img
                      src="/assets/stamp_hunter_logo.png"
                      alt="Stamp Hunter Indonesia"
                      className="w-full h-full object-contain drop-shadow-[0_0_24px_rgba(225,29,72,0.35)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Narrative Status Footer */}
        <div className="mt-4 text-center space-y-2">
          {!stampLanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200/90 shadow-sm text-xs text-zinc-700 font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Menyusuri rute stempel nusantara...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-2.5"
            >
              {/* <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Cap Berhasil Dibubuhkan!</span>
              </div> */}
              <div>
                <button
                  onClick={onComplete}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold border border-zinc-700/80 shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {/* <Sparkles className="w-3.5 h-3.5 text-rose-400" /> */}
                  <span>Buka Peta & Mulai Berburu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1 pt-1">
            {FOOTSTEPS_PATH.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i <= currentStepIndex
                    ? 'w-3.5 bg-rose-600'
                    : 'w-1.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-5 pb-5 text-center">
        <p className="text-[11px] text-zinc-400 font-medium">
          Stamp Hunter Indonesia — Temukan dan koleksi ribuan stempel fisik otentik di seluruh Nusantara
        </p>
      </div>
    </div>
  );
};

