import React from 'react';
import { Wifi, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenContactModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenContactModal }) => {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] pt-16 pb-12 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border-color)]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display font-bold text-base shadow-sm">
                W
              </div>
              <span className="font-display font-bold tracking-tight text-lg text-[var(--text-primary)]">
                BYTEBROTHERS
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Boutique AI-native systems studio building custom WebGL, full-stack platforms, and AI infrastructure engineered for scale.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Systems Operational • Offline SW Active
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-mono text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              {['Home', 'About Studio', 'Portfolio', 'Services', 'Contact'].map((item) => {
                const tabId = item.toLowerCase().replace(' studio', '');
                return (
                  <li key={item}>
                    <button
                      onClick={() => {
                        setActiveTab(tabId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Founders & Engineering */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-mono text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Founders
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-sans">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-[var(--text-primary)]">Syed</span>
                <span className="text-[10px] font-mono text-blue-400">// Craftsman</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-[var(--text-primary)]">Hamid Kamal</span>
                <span className="text-[10px] font-mono text-blue-400">// Strategist</span>
              </li>
            </ul>
            <div className="pt-2">
              <div className="font-mono text-[10px] text-[var(--text-muted)]">
                Stack: React 19 • Tailwind v4 • Express • WebGL
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Start a Project
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Have an ambitious web application or digital product in mind? Let's engineer it together.
            </p>
            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-colors shadow-sm"
            >
              <span>Schedule Discovery Session</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} ByteBrothers. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[var(--text-secondary)] cursor-pointer">Offline Data Caching Protocol</span>
            <span>•</span>
            <span className="hover:text-[var(--text-secondary)] cursor-pointer">V8 Latency: 18ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
