import React from 'react';
import { FOUNDERS, TECHNICAL_TENETS } from '../data/studioData';
import { FounderCard } from '../components/FounderCard';
import { Terminal, Code2, Cpu, ShieldCheck, CheckCircle2, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl border-b border-[var(--border-color)] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>// ABOUT BYTE BROTHERS</span>
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
          Engineering Craftsmanship &amp; Architectural Rigor
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Byte Brothers was founded with a singular conviction: digital web applications should be blistering fast, impeccably styled, and engineered for resilience.
        </p>
      </div>

      {/* Founders Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// LEADERSHIP</div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
            Meet the Founding Partners
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FOUNDERS.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </div>
      </section>

      {/* Technical Philosophy & Tenets */}
      <section className="space-y-8">
        <div className="space-y-2">
          <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// ARCHITECTURE</div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
            Our Four Tenets of Engineering
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNICAL_TENETS.map((t) => (
            <div
              key={t.number}
              className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3"
            >
              <div className="font-mono text-2xl font-bold text-blue-400">{t.number}</div>
              <div className="font-display font-bold text-base text-[var(--text-primary)]">{t.title}</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <div className="space-y-1">
          <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// TECH RADAR</div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
            Core Production Technologies
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
          {[
            { name: 'Webflow Enterprise', role: 'Visual Architecture' },
            { name: 'Client-First v2', role: 'CSS Class System' },
            { name: 'React 19', role: 'UI Framework' },
            { name: 'TypeScript', role: 'Type Safety' },
            { name: 'GSAP / Motion', role: 'Physics & Motion' },
            { name: 'Tailwind CSS v4', role: 'Styling' },
            { name: 'Express / Node', role: 'Server API' },
            { name: 'Service Worker', role: 'Offline PWA Cache' }
          ].map((item) => (
            <div key={item.name} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-container)] text-center space-y-1">
              <div className="font-bold text-[var(--text-primary)] text-[11px] truncate">{item.name}</div>
              <div className="text-[9px] text-[var(--text-muted)] truncate">{item.role}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
