import React, { useState } from 'react';
import { SERVICES, WORKFLOW_STEPS } from '../data/studioData';
import { 
  Code, 
  Palette, 
  ShoppingCart, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  ArrowRight 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenContactModal: () => void;
  onOpenAiEstimator: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenContactModal,
  onOpenAiEstimator
}) => {
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Code':
        return <Code className="h-6 w-6 text-blue-400" />;
      case 'Palette':
        return <Palette className="h-6 w-6 text-emerald-400" />;
      case 'ShoppingCart':
        return <ShoppingCart className="h-6 w-6 text-indigo-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-6 w-6 text-amber-400" />;
      default:
        return <Code className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-[var(--border-color)] pb-8">
        <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
          // CAPABILITIES &amp; RETAINERS
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
          Engineering Services &amp; Technical Retainers
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          From custom React web applications to ongoing CTO-level infrastructure maintenance, we provide end-to-end software engineering.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="p-3 rounded-xl bg-[var(--bg-container)] border border-[var(--border-color)]">
                  {getServiceIcon(service.iconName)}
                </div>
                {service.badge && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                    {service.badge}
                  </span>
                )}
              </div>

              <div>
                <div className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {service.subtitle}
                </div>
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mt-1">
                  {service.title}
                </h3>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <div className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase">
                  Included Deliverables:
                </div>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-medium">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                {service.estTime}
              </span>
              <button
                onClick={onOpenContactModal}
                className="font-sans text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1"
              >
                <span>Request Proposal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Workflow Framework */}
      <section className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-8">
        <div className="space-y-2">
          <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">// OPERATIONAL FRAMEWORK</div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
            How We Build With You
          </h2>
        </div>

        {/* Steps Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKFLOW_STEPS.map((wf, idx) => (
            <button
              key={wf.step}
              onClick={() => setActiveWorkflow(idx)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeWorkflow === idx
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-[var(--border-color)] bg-[var(--bg-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="font-mono text-xl font-bold text-blue-400">{wf.step}</div>
              <div className="font-display font-bold text-base mt-1">{wf.name}</div>
              <div className="font-mono text-[10px] text-[var(--text-muted)] truncate mt-1">{wf.command}</div>
            </button>
          ))}
        </div>

        {/* Step Inspector Box */}
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-primary)] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-blue-400 border-b border-[var(--border-color)] pb-3">
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              {WORKFLOW_STEPS[activeWorkflow].command}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase">
              Phase {WORKFLOW_STEPS[activeWorkflow].step} of 04
            </span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed pt-2">
            {WORKFLOW_STEPS[activeWorkflow].description}
          </p>
        </div>
      </section>
    </div>
  );
};
