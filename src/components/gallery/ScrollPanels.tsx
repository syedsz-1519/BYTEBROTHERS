import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  stack: string;
  year: string;
}

export interface ScrollPanelsProps {
  projects?: Project[];
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'intro',
    title: 'Three-dimensional\nthinking, built for the web.',
    description: 'Scroll to walk down the corridor. Each room holds a piece of the work.',
    role: 'Byte Brothers',
    stack: 'R3F, Three.js',
    year: '2025',
  },
  {
    id: 'aperture',
    title: 'Aperture Studio',
    description: 'A generative brand system for a photography collective, built in WebGL with a real-time light rig.',
    role: '3D & Frontend',
    stack: 'R3F, Spline',
    year: '2025',
  },
  {
    id: 'ledger',
    title: 'Ledger Systems',
    description: 'A fintech dashboard rebuilt around a spatial data-room metaphor — numbers you can walk through.',
    role: 'Product Design',
    stack: 'React, D3',
    year: '2025',
  },
  {
    id: 'northline',
    title: 'Northline Freight',
    description: 'A logistics site with a live route-tracking hero and a scroll-jacked services sequence.',
    role: 'Full Build',
    stack: 'Three.js, GSAP',
    year: '2024',
  },
  {
    id: 'closing',
    title: "Let's build the next room.",
    description: 'Open for freelance and studio collaborations.',
    role: 'Get in touch',
    stack: 'studio@whitebrothers.dev',
    year: '',
  },
];

const ScrollPanels: React.FC<ScrollPanelsProps> = ({ projects = DEFAULT_PROJECTS }) => {
  const scrollProgress = useScrollProgress();
  const [panelOpacities, setPanelOpacities] = useState<number[]>(Array(projects.length).fill(0));

  useEffect(() => {
    const band = 1 / projects.length;
    const opacities = projects.map((_, i) => {
      const center = band * i + band / 2;
      const dist = Math.abs(scrollProgress - center);
      const opacity = Math.max(0, 1 - dist / (band * 0.62));
      return opacity;
    });
    setPanelOpacities(opacities);
  }, [scrollProgress, projects.length]);

  return (
    <div id="scroll-panels" className="relative z-2 pointer-events-none">
      {projects.map((project, index) => {
        const isIntro = index === 0;
        const isClosing = index === projects.length - 1;

        return (
          <motion.div
            key={project.id}
            className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center px-[8vw] pointer-events-none"
            style={{
              opacity: panelOpacities[index],
            }}
            transition={{ duration: 0.1 }}
          >
            <div className="font-space-grotesk text-xs letter-spacing-wide uppercase text-[#c9a876] mb-4">
              {isIntro ? 'Byte Brothers' : isClosing ? 'Get in touch' : `Selected Work — ${index.toString().padStart(2, '0')}`}
            </div>

            <h1 className="font-space-grotesk font-semibold text-4xl md:text-6xl leading-tight max-w-[14ch] text-[#e8e6df] mb-6">
              {project.title}
            </h1>

            <p className="text-base md:text-lg leading-relaxed max-w-[38ch] text-[#8b8f96] mb-8 font-inter">
              {project.description}
            </p>

            <div className="flex gap-6 font-space-grotesk text-xs letter-spacing-wider uppercase text-[#8b8f96]">
              <div>
                <strong className="block text-[#e8e6df] font-medium text-sm mb-0.5">{isClosing ? 'Email' : 'Role'}</strong>
                {project.role}
              </div>
              <div>
                <strong className="block text-[#e8e6df] font-medium text-sm mb-0.5">Stack</strong>
                {project.stack}
              </div>
              {project.year && (
                <div>
                  <strong className="block text-[#e8e6df] font-medium text-sm mb-0.5">Year</strong>
                  {project.year}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Scroll Track for measuring scroll depth */}
      <div id="scroll-track" className="relative z-1 h-[600vh] pointer-events-none" />

      {/* HUD */}
      <div className="fixed bottom-[2.4rem] left-[8vw] z-3 flex items-center gap-3.5 font-space-grotesk text-xs letter-spacing-wider uppercase text-[#8b8f96] pointer-events-none">
        <span id="hud-label" className="font-medium">
          01 / {projects.length.toString().padStart(2, '0')}
        </span>
        <div className="w-[120px] h-px bg-[rgba(232,230,223,0.15)] relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#c9a876]"
            style={{
              width: `${scrollProgress * 100}%`,
            }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>

      {/* Scroll Cue */}
      <motion.div
        className="fixed top-[2.4rem] right-[8vw] z-3 font-space-grotesk text-xs letter-spacing-wider uppercase text-[#8b8f96] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollProgress < 0.03 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        Scroll to walk in ↓
      </motion.div>
    </div>
  );
};

export default ScrollPanels;
