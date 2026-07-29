import React from 'react';
import { PROJECTS, FOUNDERS, TECHNICAL_TENETS } from '../data/studioData';
import { ProjectCard } from '../components/ProjectCard';
import { FounderCard } from '../components/FounderCard';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Clock 
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectProject: (project: any) => void;
  onOpenAiEstimator: () => void;
  onOpenContactModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onSelectProject,
  onOpenAiEstimator,
  onOpenContactModal
}) => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 studio-grid-pattern">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>[ BOUTIQUE DIGITAL STUDIO ]</span>
          </div>

          {/* Main Display Heading */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
              WE BUILD <span className="text-blue-500 underline decoration-blue-500/40 underline-offset-8">HIGH-PERFORMANCE</span> DIGITAL PRODUCTS
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              Founded by <strong className="text-[var(--text-primary)] font-semibold">Syed</strong> &amp; <strong className="text-[var(--text-primary)] font-semibold">Hamid Kamal</strong>. Crafting bespoke web applications, high-conversion storefronts, and custom software systems with sub-second execution.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('portfolio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-all shadow-md hover:shadow-blue-500/20 flex items-center gap-2"
            >
              <span>EXPLORE PORTFOLIO</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenContactModal}
              className="px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-container)] text-[var(--text-primary)] font-sans text-xs font-semibold tracking-wide transition-colors"
            >
              SCHEDULE DISCOVERY
            </button>

            <button
              onClick={onOpenAiEstimator}
              className="px-4 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>TRY AI ESTIMATOR</span>
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[var(--border-color)]">
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Founding Partners</div>
              <div className="font-display font-bold text-lg text-[var(--text-primary)] mt-1">Syed &amp; Hamid</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">In-House Engineering</div>
              <div className="font-display font-bold text-lg text-[var(--text-primary)] mt-1">100% Direct</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Dependency Bloat</div>
              <div className="font-display font-bold text-lg text-emerald-400 mt-1">0% Framework Bloat</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">V8 Render Latency</div>
              <div className="font-display font-bold text-lg text-blue-400 mt-1">&lt; 20ms Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Spotlight Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// THE ARCHITECTS</div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1">
              Meet the Founders
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-mono text-xs text-[var(--text-muted)] hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>Learn More About Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FOUNDERS.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </div>
      </section>

      {/* Technical Tenets Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// CORE PHILOSOPHY</div>
          <h2 className="font-display font-bold text-3xl text-[var(--text-primary)]">
            Our Architectural Tenets
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            How we maintain unmatched performance and pixel-perfect execution on every build.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNICAL_TENETS.map((tenet) => (
            <div
              key={tenet.number}
              className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-bold text-blue-500">{tenet.number}</span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{tenet.category}</span>
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">{tenet.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{tenet.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Portfolio Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// FEATURED BLUEPRINTS</div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1">
              Selected Projects
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-mono text-xs text-[var(--text-muted)] hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>View All Blueprints ({PROJECTS.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.slice(0, 5).map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      </section>

      {/* Ready to Build CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 via-[var(--bg-surface)] to-[var(--bg-surface)] p-8 sm:p-12 overflow-hidden shadow-2xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase">
              // READY TO ENGINEER YOUR VISION?
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
              Let's build something extraordinary together.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Book a direct technical discovery call with founders Syed and Hamid. No account managers, no junior handoffs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenContactModal}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold tracking-wide transition-colors shadow-lg shadow-blue-500/20"
            >
              START PROJECT INQUIRY
            </button>
            <button
              onClick={onOpenAiEstimator}
              className="px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>CALCULATE AI ESTIMATE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
