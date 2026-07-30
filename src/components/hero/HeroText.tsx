"use client";

import React from "react";
import { motion } from "motion/react";
import { Terminal, ArrowRight } from "lucide-react";

interface HeroTextProps {
  onOpenRfq: () => void;
  onExploreServices: () => void;
}

export const HeroText: React.FC<HeroTextProps> = ({ onOpenRfq, onExploreServices }) => {
  // Stagger variants for the headline words
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 }
    },
  };

  const headline = "WE ENGINEER HIGH-PERFORMANCE WEB SYSTEMS & AI PLATFORMS";
  const words = headline.split(" ");

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
      <div className="max-w-[55%] space-y-5 lg:space-y-7 mt-16 md:mt-0">
        
        {/* Animated Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[10px] sm:text-xs font-mono text-cyan-400 backdrop-blur-sm"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>INITIALIZING DIGITAL ARCHITECTURE V2.0</span>
        </motion.div>

        {/* Staggered Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
          style={{ perspective: "1000px" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-3 mb-2 lg:mb-4"
              style={{
                color: word === "HIGH-PERFORMANCE" || word === "AI" ? "#22d3ee" : "inherit",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-2xl font-light"
        >
          Custom WebGL experiences, ultra-fast e-commerce builds, and automated AI infrastructure engineered for scale.
        </motion.p>

        {/* Action CTAs (pointer-events-auto to make them clickable) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4"
        >
          {/* Primary CTA */}
          <button
            onClick={onOpenRfq}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-95"
          >
            <Terminal className="h-4 w-4 text-zinc-950" />
            <span>[ Launch Project Terminal ]</span>
            <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-cyan-400/50 transition-colors pointer-events-none" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onExploreServices}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-300 hover:text-cyan-400 border border-zinc-800 hover:border-cyan-500/50 backdrop-blur-md font-mono text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-95"
          >
            <span>[ Explore 3D Services ]</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroText;
