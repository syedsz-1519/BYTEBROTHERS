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
          <div className="flex flex-col items-center justify-center space-y-12 z-10">
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
                  width="120"
                  height="120"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  {/* Define gradient for 3D effect */}
                  <defs>
                    <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0B4F6B', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#147A8F', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#0A3A4A', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#17A2B8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#20C997', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#138496', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>

                  {/* Left B */}
                  <g id="leftB">
                    <rect x="30" y="40" width="35" height="120" fill="url(#gradientDark)" stroke="#0B4F6B" strokeWidth="2" rx="4" />
                    <rect x="38" y="50" width="15" height="100" fill="white" rx="2" />
                    <rect x="60" y="40" width="25" height="35" fill="url(#gradientLight)" stroke="#138496" strokeWidth="2" rx="2" />
                    <rect x="60" y="125" width="25" height="35" fill="url(#gradientLight)" stroke="#138496" strokeWidth="2" rx="2" />
                  </g>

                  {/* Right B (mirrored and offset) */}
                  <g id="rightB" transform="translate(85, 0)">
                    <rect x="30" y="40" width="35" height="120" fill="url(#gradientDark)" stroke="#0B4F6B" strokeWidth="2" rx="4" />
                    <rect x="38" y="50" width="15" height="100" fill="white" rx="2" />
                    <rect x="5" y="40" width="25" height="35" fill="url(#gradientLight)" stroke="#138496" strokeWidth="2" rx="2" />
                    <rect x="5" y="125" width="25" height="35" fill="url(#gradientLight)" stroke="#138496" strokeWidth="2" rx="2" />
                  </g>

                  {/* Center accent square */}
                  <rect x="92" y="85" width="16" height="16" fill="#17A2B8" stroke="#0B4F6B" strokeWidth="1.5" rx="2" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Progress Bar Section */}
            <div className="w-full max-w-xs space-y-4">
              {/* Progress Percentage */}
              <div className="flex justify-center items-center">
                <motion.span 
                  className="font-bold text-2xl text-teal-600"
                  key={Math.floor(progress)}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full shadow-md"
                  style={{ width: `${progress}%` }}
                  transition={{ type: "tween", duration: 0.1 }}
                />
              </div>

              {/* Loading Status */}
              <div className="text-center text-xs font-mono text-gray-500">
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
