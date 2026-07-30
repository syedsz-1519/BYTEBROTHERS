import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
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
  Globe,
  Activity,
  Server,
  RefreshCw,
  Wand2,
  Tag,
  Box,
  Workflow
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
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [pingLatency, setPingLatency] = useState<number>(14);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Extract top tech stack tags for homepage quick filter
  const featuredTags = useMemo(() => {
    return ['All', 'Webflow Enterprise', 'Client-First v2', 'React 19', 'TypeScript', 'Custom GSAP JS', 'Express API'];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return PROJECTS.slice(0, 6);
    return PROJECTS.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()))
    );
  }, [selectedTag]);

  const handleRunDiagnostics = () => {
    setIsPinging(true);
    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 8) + 11; // 11-18ms
      setPingLatency(simulatedLatency);
      setIsPinging(false);
    }, 600);
  };

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 lg:pt-16 studio-grid-pattern">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8"
        >
          {/* Eyebrow Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-400">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>[ WEBFLOW ENTERPRISE &amp; FULL-STACK STUDIO ]</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM LATENCY: {pingLatency}ms</span>
            </div>
          </div>

          {/* Main Display Heading */}
          <div className="space-y-5 max-w-4xl">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
              WE BUILD <span className="text-blue-500 underline decoration-blue-500/40 underline-offset-8">HIGH-PERFORMANCE</span> WEBFLOW &amp; WEB APPS
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              Founded by <strong className="text-[var(--text-primary)] font-semibold">Syed</strong> &amp; <strong className="text-[var(--text-primary)] font-semibold">Hamid Kamal</strong>. Crafting Webflow Enterprise platforms, bespoke React web applications, and Client-First digital systems with sub-second execution.
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
              <Sparkles className="h-4 w-4 text-cyan-400" />
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
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Webflow Mastery</div>
              <div className="font-display font-bold text-lg text-blue-400 mt-1">Client-First v2</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Lighthouse Score</div>
              <div className="font-display font-bold text-lg text-emerald-400 mt-1">100 / 100 Speed</div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]/60">
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">V8 Render Latency</div>
              <div className="font-display font-bold text-lg text-cyan-400 mt-1">&lt; 20ms Target</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3D WEBSITE WORKFLOW & PROFIT BLUEPRINT BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-blue-950/60 via-[#0a1120] to-indigo-950/40 p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-cyan-500/20 pb-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 font-mono text-xs font-bold text-cyan-300">
                <Workflow className="h-4 w-4 text-cyan-400" />
                <span>5-YEAR WORKFLOW ENGINEER MASTERCLASS</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                How to Build &amp; Sell High-Margin 3D Websites
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100/80 leading-relaxed">
                Step-by-step agency guide covering 3D asset optimization (Spline/Blender), Webflow Client-First v2 integration, pitch templates for landing $15k+ clients, and our interactive 3D profit calculator.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('workflow-guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
            >
              <span>Explore 3D Guide &amp; Calculator</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] text-cyan-400 uppercase">Phase 1-3 Pipeline</div>
              <div className="text-white font-bold">Blender &rarr; DRACO &rarr; Webflow</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] text-cyan-400 uppercase">Average Client Deal</div>
              <div className="text-emerald-400 font-bold">$14,500 – $28,000 / project</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] text-cyan-400 uppercase">Monthly Care Retainer</div>
              <div className="text-blue-300 font-bold">+$2,200 / month recurring</div>
            </div>
          </div>
        </div>
      </section>

      {/* WEBFLOW ENTERPRISE & TECHNICAL DUAL ENGINE HIGHLIGHT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-[var(--bg-surface)] to-indigo-950/20 p-8 sm:p-12 space-y-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-blue-500/20 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 font-mono text-xs font-bold text-blue-300">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>WEBFLOW ENTERPRISE &amp; FULL-STACK DUAL ENGINE</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Bespoke Webflow Platforms &amp; Custom Web Applications
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                Whether you need a high-converting Webflow site built to Client-First v2 standards or a complex React/Node full-stack web app, White Brothers engineers end-to-end digital assets with zero compromise on performance or aesthetics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenContactModal}
                className="px-6 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Build Webflow Site</span>
              </button>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-blue-500/20 bg-[var(--bg-primary)]/80 space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-cyan-400 w-fit border border-blue-500/30">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Webflow Enterprise
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Client-First v2 class structures, Figma-to-Webflow 1:1 precision, dynamic CMS collections, and editor team handoff.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/20 bg-[var(--bg-primary)]/80 space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/30">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Full-Stack React &amp; Node
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Sub-second V8 React 19 web applications with Express APIs, offline PWA caching, and real-time state persistence.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/20 bg-[var(--bg-primary)]/80 space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Custom GSAP &amp; Physics
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Elevated micro-interactions, custom tilt animations, Lottie graphics, and physics-driven scroll transitions.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/20 bg-[var(--bg-primary)]/80 space-y-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                100/100 Lighthouse SEO
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Zero bloated scripts, semantic accessibility, optimized image rendering, and sub-20ms first contentful paint.
              </p>
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

      {/* Selected Portfolio Showcase with Homepage Stack Filter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// FEATURED BLUEPRINTS</div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mt-1">
              Selected Works &amp; Systems
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

        {/* Quick Tag Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1 mr-2">
            <Tag className="h-3.5 w-3.5 text-blue-400" />
            <span>Filter:</span>
          </span>
          {featuredTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg font-mono text-xs border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-md'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-blue-400/50 hover:text-blue-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>
      </section>

      {/* Live Studio Terminal / System Monitor Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  White Brothers System Diagnostics
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Live status check &amp; Webflow Client-First v2 engine verification
                </p>
              </div>
            </div>

            <button
              onClick={handleRunDiagnostics}
              disabled={isPinging}
              className="px-4 py-2 rounded-lg bg-[var(--bg-container)] hover:bg-[var(--bg-elevated)] text-blue-400 border border-blue-500/30 font-mono text-xs font-medium transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging Node...' : 'Run Diagnostics'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase">V8 Execution Speed</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>{pingLatency}ms Response</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Webflow Enterprise Standard</div>
              <div className="text-blue-400 font-bold flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>Client-First v2 Active</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Offline PWA Engine</div>
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Service Worker Ready</span>
              </div>
            </div>
          </div>
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
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>CALCULATE AI ESTIMATE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

