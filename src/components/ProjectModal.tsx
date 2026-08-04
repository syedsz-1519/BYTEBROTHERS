import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../data/studioData';
import { X, ExternalLink, Cpu, CheckCircle2, Play, Activity, Layers, ArrowUpRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenInquiry: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenInquiry }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive'>('overview');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!project || activeTab !== 'interactive') return;

    if (project.demoType === 'webgl' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      let height = (canvas.height = 300);

      const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2.5 + 1,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        });
      }

      const render = () => {
        ctx.fillStyle = '#131315';
        ctx.fillRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 90})`;
              ctx.lineWidth = 0.6;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [project, activeTab]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] uppercase font-bold">
                {project.category}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">• {project.type}</span>
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mt-0.5">
              {project.title} Architectural Blueprint
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-container)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-container)]/40 px-5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Specification & Metrics
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'interactive'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Play className="h-3 w-3 fill-current" />
            Live Interactive Simulator
          </button>
        </div>

        {/* Body Content Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Image Preview */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-black">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Founder Lead & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Lead Engineer</div>
                  <div className="font-display font-bold text-sm text-[var(--text-primary)] mt-0.5">
                    {project.lead} ({project.lead === 'Syed' ? 'Craftsman' : 'Strategist'})
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Key Metric</div>
                  <div className="font-mono font-semibold text-sm text-blue-400 mt-0.5">
                    {project.metrics || 'High Availability'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Status</div>
                  <div className="font-mono font-semibold text-sm text-emerald-400 mt-0.5 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {project.status || 'Active'}
                  </div>
                </div>
              </div>

              {/* Challenge & Solution */}
              {project.details && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <h4 className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                      // The Technical Challenge
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {project.details.challenge}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <h4 className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                      // The ByteBrothers Solution
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {project.details.solution}
                    </p>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Engineered Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project.details?.stack || project.tags).map((st) => (
                    <span
                      key={st}
                      className="px-3 py-1 rounded-md bg-[var(--bg-container)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Interactive Simulator Canvas / Widget */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
                  <span className="font-mono text-xs text-[var(--text-primary)]">
                    Rendering Live Architecture Simulator for {project.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  60 FPS Active
                </span>
              </div>

              {project.demoType === 'webgl' ? (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-[#131315]">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/80 font-mono text-[10px] text-zinc-300 border border-white/10">
                    WebGL2 Custom Particle Shader • Zero External Libs
                  </div>
                </div>
              ) : project.demoType === 'analytics' ? (
                <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)] space-y-4">
                  <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Simulated Telemetry Pipeline Latency Benchmark
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'WebSocket Ingestion Rate', val: '48,200 msg/sec', width: '92%' },
                      { label: 'V8 Execution Buffer', val: '12.4ms', width: '28%' },
                      { label: 'Client Canvas Render Time', val: '16.6ms (60 FPS)', width: '45%' }
                    ].map((m) => (
                      <div key={m.label} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px] text-[var(--text-secondary)]">
                          <span>{m.label}</span>
                          <span className="text-blue-400 font-bold">{m.val}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: m.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)] space-y-4 text-center">
                  <Layers className="h-10 w-10 text-blue-400 mx-auto" />
                  <div className="font-display font-bold text-base text-[var(--text-primary)]">
                    High-Conversion UX & Optimistic UI Engine
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    Built with instant local state cache, slide-over optimistic cart feedback, and zero render blocking.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between">
          <div className="font-mono text-xs text-[var(--text-muted)]">
            Want a similar architecture for your organization?
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenInquiry(project.title);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-colors"
          >
            <span>Request Similar Build</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
