import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  isLoading: boolean
  onLoadingComplete: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({
  isLoading,
  onLoadingComplete,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isLoading])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onLoadingComplete()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [progress, onLoadingComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
        >
          {/* Main Container */}
          <div className="flex flex-col items-center gap-12">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Byte Brothers Text - Single Clear Line Animation */}
              <div className="relative h-32 flex items-center justify-center">
                {/* Animated line drawing effect */}
                <svg
                  className="absolute"
                  width="280"
                  height="80"
                  viewBox="0 0 280 80"
                  fill="none"
                >
                  {/* "Byte Brothers" text rendered as a single stroke path */}
                  <motion.text
                    x="140"
                    y="50"
                    textAnchor="middle"
                    fontSize="48"
                    fontWeight="700"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    letterSpacing="2"
                    initial={{ strokeDashoffset: 500 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    style={{ strokeDasharray: 500 }}
                  >
                    Byte Brothers
                  </motion.text>

                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0ea5e9"
                        stopOpacity="1"
                      />
                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Glow effect behind text */}
                <motion.div
                  className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Progress Text */}
            <motion.p
              className="text-cyan-400 text-sm font-medium tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Math.round(Math.min(progress, 100))}%
            </motion.p>
          </div>

          {/* Animated Background Elements */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: 2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
