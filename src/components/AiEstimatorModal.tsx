import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle, Cpu, Clock, Layers, Loader2 } from 'lucide-react';

interface AiEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEstimate: (estimateText: string) => void;
}

export const AiEstimatorModal: React.FC<AiEstimatorModalProps> = ({
  isOpen,
  onClose,
  onSelectEstimate
}) => {
  const [projectType, setProjectType] = useState('Custom Web Application');
  const [budget, setBudget] = useState('$5,000 - $15,000');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectType, budget, details })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.estimate);
      }
    } catch (err) {
      console.warn('Estimate fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                AI Architectural Estimator
              </h2>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                Powered by Gemini AI Engine & Byte Brothers Design System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-container)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!result ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                >
                  <option value="Custom Web Application">Custom Web Application</option>
                  <option value="E-commerce Storefront">E-commerce Storefront</option>
                  <option value="Executive Portfolio">Executive Portfolio</option>
                  <option value="Logistics Telemetry Hub">Logistics Telemetry Hub</option>
                  <option value="Maintenance & Retainer">Maintenance & Retainer</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                  Target Budget Range
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                >
                  <option value="$2,500 - $5,000">$2,500 - $5,000 (MVP / Prototype)</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000 (Standard Production Build)</option>
                  <option value="$15,000 - $35,000">$15,000 - $35,000 (Full-Stack Enterprise Platform)</option>
                  <option value="$35,000+">$35,000+ (Complex Custom Infrastructure)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[var(--text-muted)] uppercase mb-1">
                  Project Brief & Key Goals
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your vision, target audience, speed expectations, and integrations..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-colors shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Architectural Requirements...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Architectural Blueprint</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-blue-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="h-4 w-4" /> Recommended Stack
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">Sub-20ms Latency Target</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommendedStack?.map((s: string) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-[var(--bg-primary)] border border-blue-500/30 text-xs font-mono text-[var(--text-primary)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                  <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-400" /> Estimated Timeline
                  </div>
                  <div className="font-display font-bold text-base text-[var(--text-primary)] mt-1">
                    {result.estimatedTimeline}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                  <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                    <Layers className="h-3 w-3 text-emerald-400" /> Architecture Type
                  </div>
                  <div className="font-display font-bold text-base text-[var(--text-primary)] mt-1">
                    Single-Page + PWA Cache
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase">
                  // Architectural Strategy
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] font-mono">
                  {result.architecturalStrategy}
                </p>
              </div>

              {result.keyMilestones && (
                <div className="space-y-2">
                  <div className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase">
                    Execution Milestones
                  </div>
                  <ul className="space-y-1.5">
                    {result.keyMilestones.map((m: string) => (
                      <li key={m} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-container)] font-mono text-xs text-[var(--text-secondary)]"
                >
                  Recalculate
                </button>
                <button
                  onClick={() => {
                    const specText = `[AI Spec] ${projectType} (${budget}). Strategy: ${result.architecturalStrategy}`;
                    onSelectEstimate(specText);
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold"
                >
                  Attach to Inquiry Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
