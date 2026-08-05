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
            {/* ByteBrothers Original Logo with 3s Blink Cycle */}
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
                  width="140"
                  height="140"
                  viewBox="0 0 160 160"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-2xl"
                >
                  <defs>
                    {/* Teal gradient */}
                    <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#4DADB8', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#2F9BA8', stopOpacity: 1 }} />
                    </linearGradient>
                    
                    {/* Cyan gradient */}
                    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#5FC9D6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#2FB6C8', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>

                  {/* Rounded square container background */}
                  <rect x="10" y="10" width="140" height="140" rx="16" fill="#6BA8B4" opacity="0.3" />

                  {/* Left vertical bar - teal */}
                  <rect x="20" y="35" width="18" height="90" rx="4" fill="url(#tealGradient)" />

                  {/* Top left small square */}
                  <rect x="45" y="35" width="18" height="18" rx="3" fill="url(#cyanGradient)" />

                  {/* Top right small square */}
                  <rect x="68" y="35" width="18" height="18" rx="3" fill="url(#cyanGradient)" />

                  {/* Top right extension */}
                  <rect x="93" y="35" width="18" height="18" rx="3" fill="url(#cyanGradient)" />

                  {/* Right vertical bar - cyan */}
                  <rect x="122" y="35" width="18" height="90" rx="4" fill="url(#cyanGradient)" />

                  {/* Center middle square - large */}
                  <rect x="56" y="62" width="28" height="28" rx="4" fill="url(#cyanGradient)" />

                  {/* Bottom left medium square */}
                  <rect x="45" y="107" width="18" height="18" rx="3" fill="url(#tealGradient)" />

                  {/* Bottom middle small square */}
                  <rect x="68" y="107" width="18" height="18" rx="3" fill="url(#cyanGradient)" />
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
