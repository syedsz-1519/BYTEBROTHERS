import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Progress bar increments: reaches 100% in 5-7 seconds (targeting 6 seconds)
    // Total duration: 6000ms, with smooth easing
    const startTime = Date.now();
    const targetDuration = 6000; // 6 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = (elapsed / targetDuration) * 100;

      // Apply easing function for smooth curve (cubic ease-in-out)
      const t = Math.min(rawProgress / 100, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = eased * 100;

      if (rawProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 400);
      } else {
        setProgress(Math.min(easedProgress, 99.5));
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-[#08090a] via-[#0f0f12] to-[#08090a] text-white p-8 sm:p-12 select-none overflow-hidden"
        >
          {/* Subtle Grid Accent Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          
          {/* Top Status */}
          <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-zinc-500 z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM INITIALIZATION</span>
            </div>
            <span>V8 3D ENGINE v5.2</span>
          </div>

          {/* Center Logo & Title */}
          <div className="flex flex-col items-center justify-center text-center my-auto space-y-6 max-w-2xl z-10">
            {/* Logo with Blinking Effect */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* ByteBrothers Logo with 3s Blink Cycle */}
              <motion.div
                className="flex justify-center"
                animate={{ opacity: [1, 1, 1, 0.3, 0.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="/assets/logo.jpeg"
                  alt="ByteBrothers Logo"
                  className="h-24 w-auto drop-shadow-lg"
                />
              </motion.div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase">
                BYTEBROTHERS
              </h1>
              
              {/* Accent Line */}
              <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent my-4">
                <motion.div 
                  className="absolute inset-0 bg-cyan-400 blur-sm"
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <p className="font-mono text-xs sm:text-sm text-zinc-400 tracking-wider uppercase">
                3D Web Architecture • Webflow Enterprise • WebGL Systems
              </p>
            </motion.div>

            {/* Progress Bar Section */}
            <div className="w-full max-w-md space-y-3 pt-6 border-t border-zinc-700/50 mt-6">
              {/* Progress Label and Percentage */}
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚙️
                  </motion.span>
                  <span>Loading Engine Assets</span>
                </span>
                <motion.span 
                  className="font-bold text-cyan-400"
                  key={Math.floor(progress)}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50 shadow-lg">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full shadow-md"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "tween", duration: 0.1 }}
                />
              </div>

              {/* Loading Status */}
              <div className="text-center text-[11px] font-mono text-zinc-500">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {progress < 30 && "Initializing WebGL..."}
                  {progress >= 30 && progress < 60 && "Loading 3D Assets..."}
                  {progress >= 60 && progress < 90 && "Compiling Shaders..."}
                  {progress >= 90 && "Finalizing..."}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 z-10 border-t border-zinc-800/80 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              <span>STUDIO DIRECTORS: BYTEBROTHERS TEAM</span>
            </div>
            <div>
              <span>PRECISION DIGITAL ENGINEERING © 2026</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
