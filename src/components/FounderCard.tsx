import React from 'react';
import { Founder } from '../data/studioData';
import { Github, Linkedin, CheckCircle, Code2, Cpu } from 'lucide-react';

interface FounderCardProps {
  founder: Founder;
  onSelectFounder?: (founderId: string) => void;
}

export const FounderCard: React.FC<FounderCardProps> = ({ founder, onSelectFounder }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="space-y-6">
        {/* Header Avatar & Role */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-[var(--border-color)] group-hover:border-blue-500 transition-colors">
              <img
                src={founder.avatar}
                alt={founder.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                {founder.role}
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                {founder.name}
              </h3>
              <div className="font-mono text-xs text-[var(--text-muted)] font-medium">
                {founder.subtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={founder.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--bg-container)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={founder.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--bg-container)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {founder.bio}
        </p>

        {/* Core Architectural Focus */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
          <div className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-blue-400" />
            Specialization & Highlights
          </div>
          <ul className="space-y-1.5">
            {founder.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-medium">
                <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specialty Chips */}
      <div className="pt-6 mt-6 border-t border-[var(--border-color)]/60 flex flex-wrap gap-1.5">
        {founder.specialties.map((spec) => (
          <span
            key={spec}
            className="px-2.5 py-1 rounded bg-[var(--bg-container)] text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-color)]"
          >
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
};
