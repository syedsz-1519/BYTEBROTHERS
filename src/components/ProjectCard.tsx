import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Project } from '../data/studioData';
import { toggleBookmarkProject, getBookmarkedProjects } from '../utils/offlineCache';
import { ExternalLink, Bookmark, Cpu, Sparkles, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onSelectTag?: (tag: string) => void;
  activeTag?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onSelectTag, activeTag }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return getBookmarkedProjects().includes(project.id);
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for normalized mouse position (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for rotation response
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  // Map normalized mouse coordinates to subtle rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  // Dynamic light glare effect position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmarkProject(project.id);
    setIsBookmarked(updated.includes(project.id));
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group relative flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden transition-colors duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer [perspective:1000px]"
    >
      {/* Subtle Dynamic Glare Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          background: `radial-gradient(600px circle at ${glareX} ${glareY}, rgba(59, 130, 246, 0.12), transparent 40%)`,
        }}
      />

      {/* Top Image Preview Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-container)]">
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-medium text-white border border-white/10 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="px-2 py-1 rounded-md bg-blue-500/80 backdrop-blur-md text-[10px] font-mono font-semibold text-white uppercase tracking-wider">
              {project.lead === 'Syed' ? 'Syed Lead' : project.lead === 'Hamid' ? 'Hamid Lead' : 'Co-Led'}
            </span>
          </div>

          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-md backdrop-blur-md transition-colors ${
              isBookmarked
                ? 'bg-blue-500 text-white'
                : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
            }`}
            title={isBookmarked ? 'Saved to Offline Bookmarks' : 'Save Offline Bookmark'}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>

        {/* Metric Banner Overlay */}
        {project.metrics && (
          <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-300 z-20">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-blue-400" />
              {project.metrics}
            </span>
            <span className="text-emerald-400 font-semibold">{project.status || 'Live'}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <span className="font-mono text-xs text-[var(--text-muted)]">{project.year}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Tags & CTA */}
        <div className="pt-2 border-t border-[var(--border-color)]/60 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 max-w-[75%] z-20">
            {project.tags.slice(0, 3).map((tag) => {
              const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    if (onSelectTag) {
                      e.stopPropagation();
                      onSelectTag(tag);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-400 font-semibold shadow-sm'
                      : 'bg-[var(--bg-container)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-blue-400/60 hover:text-blue-400 hover:bg-blue-500/10'
                  }`}
                  title={onSelectTag ? `Filter projects by ${tag}` : undefined}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <div className="flex items-center text-xs font-mono font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Blueprint</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
