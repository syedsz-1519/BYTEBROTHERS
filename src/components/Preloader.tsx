import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        // Smooth logarithmic progress increment
        const diff = Math.max(1, Math.floor((100 - prev) * 0.15));
        return Math.min(100, prev + diff);
      });
    }, 40);

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#08090a] text-white p-8 sm:p-12 select-none overflow-hidden"
        >
          {/* Subtle Grid Accent Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          
          {/* Top Status */}
          <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-zinc-500 z-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SYSTEM INITIALIZATION</span>
            </div>
            <span>V8 3D ENGINE v5.2</span>
          </div>

          {/* Center Title & Clear Single Line */}
          <div className="flex flex-col items-center justify-center text-center my-auto space-y-6 max-w-2xl z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              {/* Single Clear Line Title as requested */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase">
                BYTEBROTHERS
              </h1>
              
              {/* Single Clear Accent Line */}
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

            {/* Progress Bar & Percentage */}
            <div className="w-full max-w-md space-y-2 pt-4">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Loading Shader Matrices</span>
                </span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
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
