import React, { useState, useMemo } from 'react';
import { PROJECTS, Project } from '../data/studioData';
import { ProjectCard } from '../components/ProjectCard';
import { Search, Filter, Layers, Bookmark } from 'lucide-react';
import { getBookmarkedProjects } from '../utils/offlineCache';

interface PortfolioPageProps {
  onSelectProject: (project: Project) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onSelectProject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leadFilter, setLeadFilter] = useState<'All' | 'Syed' | 'Hamid'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Client Project' | 'Personal Project'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);

  const bookmarkedIds = getBookmarkedProjects();

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (leadFilter !== 'All' && p.lead !== leadFilter && p.lead !== 'Both') return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (bookmarksOnly && !bookmarkedIds.includes(p.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [searchQuery, leadFilter, categoryFilter, typeFilter, bookmarksOnly, bookmarkedIds]);

  const industryTypes = ['All', 'Logistics', 'Education', 'Corporate', 'Retail', 'Engineering'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
        <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// BLUEPRINT SHOWCASE</div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Portfolio &amp; Selected Works
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Explore architectural blueprints co-led by Syed &amp; Hamid Kamal across enterprise logistics, edtech, corporate, and retail domains.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, tags, tech..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Lead Partner Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] font-mono text-xs">
            {(['All', 'Syed', 'Hamid'] as const).map((lead) => (
              <button
                key={lead}
                onClick={() => setLeadFilter(lead)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  leadFilter === lead
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {lead === 'All' ? 'All Leads' : `${lead} Lead`}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Category & Industry Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Industry Type Chips */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-[var(--text-muted)] text-[10px] uppercase mr-1">Domain:</span>
            {industryTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                  typeFilter === type
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 font-semibold'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Offline Bookmarks Filter Toggle */}
          <button
            onClick={() => setBookmarksOnly(!bookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border font-mono text-xs transition-colors ${
              bookmarksOnly
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
            <span>Saved Offline ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
          <Layers className="h-10 w-10 text-[var(--text-muted)] mx-auto" />
          <div className="font-display font-bold text-base text-[var(--text-primary)]">
            No projects matched your filters
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Try adjusting your search terms or clearing lead filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLeadFilter('All');
              setCategoryFilter('All');
              setTypeFilter('All');
              setBookmarksOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-mono text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      )}
    </div>
  );
};
