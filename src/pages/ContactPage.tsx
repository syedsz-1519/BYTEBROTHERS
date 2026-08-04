import React, { useState, useEffect, useMemo } from 'react';
import { savePendingInquiry, useOnlineStatus } from '../utils/offlineCache';
import { useNotifications } from '../utils/notifications';
import { 
  Send, 
  Sparkles, 
  WifiOff, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck,
  Loader2,
  Save,
  Trash2
} from 'lucide-react';

interface ContactPageProps {
  onOpenAiEstimator: () => void;
  attachedSpec?: string;
}

const DRAFT_STORAGE_KEY = 'whitebrothers_contact_draft';

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenAiEstimator, attachedSpec }) => {
  const isOnline = useOnlineStatus();
  const { triggerPushAlert } = useNotifications();

  // Load saved draft on initial render
  const initialDraft = useMemo(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Unable to load contact draft from localStorage:', e);
    }
    return null;
  }, []);

  const [fullName, setFullName] = useState<string>(initialDraft?.fullName || '');
  const [email, setEmail] = useState<string>(initialDraft?.email || '');
  const [whatsapp, setWhatsapp] = useState<string>(initialDraft?.whatsapp || '');
  const [projectType, setProjectType] = useState<string>(initialDraft?.projectType || 'Custom Business Website');
  const [budget, setBudget] = useState<string>(initialDraft?.budget || '$5,000 - $15,000');
  const [referral, setReferral] = useState<string>(initialDraft?.referral || 'Search / Referral');
  const [details, setDetails] = useState<string>(initialDraft?.details || '');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(() => {
    return Boolean(
      initialDraft &&
        (initialDraft.fullName ||
          initialDraft.email ||
          initialDraft.whatsapp ||
          initialDraft.details)
    );
  });

  const [isSaved, setIsSaved] = useState(false);

  // Auto-save form draft to localStorage whenever fields change
  useEffect(() => {
    const hasData = Boolean(fullName || email || whatsapp || details);
    if (hasData) {
      const draftObj = {
        fullName,
        email,
        whatsapp,
        projectType,
        budget,
        referral,
        details,
        savedAt: Date.now()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftObj));
      setIsSaved(true);
    } else {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setIsSaved(false);
    }
  }, [fullName, email, whatsapp, projectType, budget, referral, details]);

  const clearDraft = () => {
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setProjectType('Custom Business Website');
    setBudget('$5,000 - $15,000');
    setReferral('Search / Referral');
    setDetails('');
    setHasRestoredDraft(false);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittedMessage(null);

    const fullDetails = attachedSpec
      ? `${details}\n\n${attachedSpec}`
      : details;

    const inquiryPayload = {
      fullName,
      email,
      whatsapp,
      projectType,
      budget,
      referral,
      details: fullDetails
    };

    if (!isOnline) {
      // Save offline in pending queue
      savePendingInquiry(inquiryPayload);
      setSubmitting(false);
      setSubmittedMessage(
        'Offline Mode Active: Your inquiry has been saved securely in your browser cache and will automatically transmit to Syed & Hamid when your internet re-connects.'
      );
      triggerPushAlert(
        'Offline Inquiry Saved',
        'Your submission was cached locally and queued for auto-sync.',
        'inquiry'
      );
      // Clear draft after successful queue
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasRestoredDraft(false);
      return;
    }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload)
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setSubmittedMessage(
          'Inquiry Submitted: Thank you! Syed and Hamid Kamal have received your specification and will respond within 12 business hours.'
        );
        triggerPushAlert(
          'Inquiry Received',
          `New submission received from ${fullName} for ${projectType}`,
          'inquiry'
        );
        // Clear draft & reset form
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasRestoredDraft(false);
        setFullName('');
        setEmail('');
        setWhatsapp('');
        setDetails('');
      } else {
        setSubmittedMessage('Submission error. Please try again.');
      }
    } catch (err) {
      // Fallback to offline save if fetch fails
      savePendingInquiry(inquiryPayload);
      setSubmitting(false);
      setSubmittedMessage(
        'Server unreachable: Inquiry saved to offline cache and queued for sync.'
      );
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasRestoredDraft(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
        <div className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
          // INITIATE DISCOVERY
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[var(--text-primary)]">
          Start a Project with Syed &amp; Hamid
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Direct communication with the founding engineers. Fill out the specification below or run the AI Estimator first.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
              Project Specification Form
            </h2>
            <button
              onClick={onOpenAiEstimator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono text-xs font-medium transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Use AI Estimator First</span>
            </button>
          </div>

          {!isOnline && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs flex items-center gap-2">
              <WifiOff className="h-4 w-4 shrink-0" />
              <span>Offline Mode: Submissions will queue in local storage &amp; sync when online.</span>
            </div>
          )}

          {hasRestoredDraft && (
            <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 font-mono text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Message draft restored from your browser's local storage.</span>
              </div>
              <button
                type="button"
                onClick={clearDraft}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-white transition-colors shrink-0 px-2 py-0.5 rounded bg-blue-500/20"
              >
                <Trash2 className="h-3 w-3" />
                <span>Discard</span>
              </button>
            </div>
          )}

          {submittedMessage && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hassan Mohammad"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  WhatsApp / Direct Phone
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Primary Capability
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                >
                  <option value="Webflow Enterprise Platform">Webflow Enterprise Platform</option>
                  <option value="Figma to Webflow Migration">Figma to Webflow Migration</option>
                  <option value="Custom Business Website">Custom Business Website</option>
                  <option value="Portfolio Site">Portfolio Site</option>
                  <option value="E-commerce Build">E-commerce Build</option>
                  <option value="Maintenance Retainer">Maintenance &amp; Security Retainer</option>
                  <option value="Custom Engineering">Custom Technical Engineering</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Estimated Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                >
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                  <option value="$15,000 - $35,000">$15,000 - $35,000</option>
                  <option value="$35,000+">$35,000+</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  How did you hear about us?
                </label>
                <input
                  type="text"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="Referral, GitHub, Client showcase..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {attachedSpec && (
              <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 font-mono text-[11px] text-blue-300">
                <span className="font-bold">// ATTACHED AI SPECIFICATION:</span>
                <p className="mt-1 line-clamp-3">{attachedSpec}</p>
              </div>
            )}

            <div>
              <label className="block font-mono text-[11px] text-[var(--text-muted)] uppercase mb-1">
                Project Scope &amp; Vision *
              </label>
              <textarea
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us about your project objectives, timeline requirements, design references, and technical constraints..."
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Specification...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>TRANSMIT PROJECT BRIEF</span>
                </>
              )}
            </button>

            {isSaved && (
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Save className="h-3 w-3" />
                  <span>Draft auto-saved to local storage</span>
                </span>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="hover:text-[var(--text-primary)] transition-colors underline"
                >
                  Clear draft
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Founders Box */}
          <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Direct Access to Founders
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every inquiry is reviewed directly by Syed (Craftsman) and Hamid Kamal (Strategist). You work directly with senior architects.
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Direct Email</div>
                  <div className="text-[var(--text-primary)] font-bold">hello@whitebrothers.dev</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                <Phone className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">WhatsApp Studio Sync</div>
                  <div className="text-[var(--text-primary)] font-bold">+1 (800) WHITE-DEV</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-container)]">
                <Clock className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="text-[10px] text-[var(--text-muted)]">Response Benchmark</div>
                  <div className="text-[var(--text-primary)] font-bold">Within 12 Hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>ByteBrothers Quality Protocol</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Zero outsourced junior code</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Sub-second page performance guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Full source code ownership &amp; IP transfer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
