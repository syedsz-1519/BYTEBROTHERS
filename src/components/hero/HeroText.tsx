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
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 25, rotateX: 45 },
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
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center space-y-4 sm:space-y-5 flex flex-col items-center">
        
        {/* Animated Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] sm:text-xs font-mono text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.15)]"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>INITIALIZING DIGITAL ARCHITECTURE V2.0</span>
        </motion.div>

        {/* Staggered Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl"
          style={{ perspective: "1000px" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mx-1 sm:mx-1.5 my-0.5"
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xs sm:text-base md:text-lg text-zinc-300/90 leading-relaxed max-w-xl font-normal drop-shadow-md"
        >
          Custom WebGL experiences, ultra-fast e-commerce builds, and automated AI infrastructure engineered for scale.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <button
            onClick={onOpenRfq}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-95"
          >
            <Terminal className="h-4 w-4 text-zinc-950" />
            <span>[ Launch Project Terminal ]</span>
            <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-cyan-400/50 transition-colors pointer-events-none" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onExploreServices}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-950/60 hover:bg-zinc-900/80 text-zinc-200 hover:text-cyan-300 border border-zinc-700/80 hover:border-cyan-500/50 backdrop-blur-md font-mono text-xs font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-95"
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
