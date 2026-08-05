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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-zinc-900 p-8 sm:p-12 select-none overflow-hidden"
        >
          {/* Center Logo Only with Blinking Effect */}
          <div className="flex flex-col items-center justify-center space-y-16 z-10">
            {/* ByteBrothers Logo with 3s Blink Cycle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ opacity: [1, 1, 1, 0.2, 0.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 400 400"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-2xl"
                >
                  <defs>
                    {/* Dark blue gradient for left side */}
                    <linearGradient id="darkBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0B4F6B', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#094557', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Teal gradient for middle */}
                    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#147A8F', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#0F5F72', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Bright cyan gradient for right side */}
                    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#17A2B8', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#138A9C', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Light teal for accents */}
                    <linearGradient id="lightTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#20C997', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#1BA98E', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Shadow filter for 3D depth */}
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* LEFT B SHAPE */}
                  {/* Outer left frame (dark blue) */}
                  <rect x="50" y="80" width="70" height="240" rx="8" fill="url(#darkBlueGrad)" filter="url(#shadow)" />

                  {/* Inner cutout (white) */}
                  <rect x="70" y="110" width="30" height="180" rx="4" fill="white" />

                  {/* Top right extension (teal) */}
                  <rect x="115" y="80" width="50" height="70" rx="6" fill="url(#tealGrad)" filter="url(#shadow)" />

                  {/* Top right inner (white) */}
                  <rect x="130" y="95" width="25" height="40" rx="3" fill="white" />

                  {/* Bottom right extension (teal) */}
                  <rect x="115" y="250" width="50" height="70" rx="6" fill="url(#tealGrad)" filter="url(#shadow)" />

                  {/* Bottom right inner (white) */}
                  <rect x="130" y="265" width="25" height="40" rx="3" fill="white" />

                  {/* RIGHT B SHAPE (offset and mirrored) */}
                  {/* Outer right frame (cyan) */}
                  <rect x="200" y="80" width="70" height="240" rx="8" fill="url(#cyanGrad)" filter="url(#shadow)" />

                  {/* Inner cutout (white) */}
                  <rect x="220" y="110" width="30" height="180" rx="4" fill="white" />

                  {/* Top left extension (light teal) */}
                  <rect x="145" y="80" width="50" height="70" rx="6" fill="url(#lightTealGrad)" filter="url(#shadow)" />

                  {/* Top left inner (white) */}
                  <rect x="160" y="95" width="25" height="40" rx="3" fill="white" />

                  {/* Bottom left extension (light teal) */}
                  <rect x="145" y="250" width="50" height="70" rx="6" fill="url(#lightTealGrad)" filter="url(#shadow)" />

                  {/* Bottom left inner (white) */}
                  <rect x="160" y="265" width="25" height="40" rx="3" fill="white" />

                  {/* CENTER ACCENT SQUARE */}
                  <rect x="170" y="170" width="32" height="32" rx="3" fill="url(#tealGrad)" filter="url(#shadow)" />

                  {/* Center square inner highlight */}
                  <rect x="175" y="175" width="22" height="22" rx="2" fill="#20C997" opacity="0.6" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Progress Bar Section */}
            <div className="w-full max-w-xs space-y-6">
              {/* Progress Percentage */}
              <div className="flex justify-center items-center">
                <motion.span 
                  className="font-bold text-3xl text-teal-600"
                  key={Math.floor(progress)}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-full shadow-md"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "tween", duration: 0.1 }}
                />
              </div>

              {/* Loading Status */}
              <div className="text-center text-sm font-mono text-gray-500">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {progress < 30 && "Initializing..."}
                  {progress >= 30 && progress < 60 && "Loading..."}
                  {progress >= 60 && progress < 90 && "Processing..."}
                  {progress >= 90 && "Finalizing..."}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
