import React, { useState, useMemo } from 'react';
import { PROJECTS, Project } from '../data/studioData';
import { ProjectCard } from '../components/ProjectCard';
import { Search, Filter, Layers, Bookmark, Tag, X, Sparkles } from 'lucide-react';
import { getBookmarkedProjects } from '../utils/offlineCache';

interface PortfolioPageProps {
  onSelectProject: (project: Project) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onSelectProject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leadFilter, setLeadFilter] = useState<'All' | 'Syed' | 'Hamid'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Client Project' | 'Personal Project'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);

  const bookmarkedIds = getBookmarkedProjects();

  // Extract all unique technology/category tags from all projects
  const availableTechTags = useMemo(() => {
    const tagSet = new Set<string>();
    PROJECTS.forEach((p) => {
      p.tags.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, []);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (leadFilter !== 'All' && p.lead !== leadFilter && p.lead !== 'Both') return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (bookmarksOnly && !bookmarkedIds.includes(p.id)) return false;
      if (selectedTag !== 'All' && !p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [searchQuery, leadFilter, categoryFilter, typeFilter, selectedTag, bookmarksOnly, bookmarkedIds]);

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

        {/* Active Technology Tag Filter Pill (if selected) */}
        {selectedTag !== 'All' && (
          <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 font-mono text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-400 shrink-0" />
              <span>
                Filtered by technology tag: <strong className="text-white font-semibold">{selectedTag}</strong> ({filteredProjects.length} matching project{filteredProjects.length === 1 ? '' : 's'})
              </span>
            </div>
            <button
              onClick={() => setSelectedTag('All')}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-white transition-colors shrink-0 px-2.5 py-1 rounded bg-blue-500/20 border border-blue-400/30"
            >
              <X className="h-3 w-3" />
              <span>Clear Tag Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
          <Layers className="h-10 w-10 text-[var(--text-muted)] mx-auto" />
          <div className="font-display font-bold text-base text-[var(--text-primary)]">
            No projects matched your filters
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Try adjusting your search terms, technology tags, or clearing lead filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLeadFilter('All');
              setCategoryFilter('All');
              setTypeFilter('All');
              setSelectedTag('All');
              setBookmarksOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-mono text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onSelectTag={(tag) => setSelectedTag(tag === selectedTag ? 'All' : tag)}
              activeTag={selectedTag}
            />
          ))}
        </div>
      )}

      {/* Dynamic Category & Technology Tags Section (Below Project Cards) */}
      <section className="pt-8 border-t border-[var(--border-color)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-mono text-[11px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span>FILTER BY TECHNOLOGY TAGS</span>
            </div>
            <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Explore Works by Specialized Stack &amp; Skill
            </h2>
          </div>
          {selectedTag !== 'All' && (
            <button
              onClick={() => setSelectedTag('All')}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-xs hover:bg-blue-500/20 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <X className="h-3.5 w-3.5" />
              <span>Show All Technologies</span>
            </button>
          )}
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Click any tag below to filter the showcase directly by technology or architectural standard:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
                selectedTag === 'All'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/20'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-blue-400/50'
              }`}
            >
              All Tech Stack ({PROJECTS.length})
            </button>
            {availableTechTags.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              const count = PROJECTS.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())).length;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'All' : tag)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/20'
                      : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-blue-400 hover:border-blue-400/50'
                  }`}
                >
                  <span>{tag}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[var(--bg-container)] text-[var(--text-muted)]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

