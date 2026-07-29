import React, { useState } from 'react';
import { Project } from '../data/studioData';
import { toggleBookmarkProject, getBookmarkedProjects } from '../utils/offlineCache';
import { ExternalLink, Bookmark, Cpu, Sparkles, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return getBookmarkedProjects().includes(project.id);
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmarkProject(project.id);
    setIsBookmarked(updated.includes(project.id));
  };

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
    >
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
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
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
          <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-300">
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
          <div className="flex flex-wrap gap-1.5 max-w-[75%]">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-[var(--bg-container)] text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border-color)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center text-xs font-mono font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Blueprint</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
