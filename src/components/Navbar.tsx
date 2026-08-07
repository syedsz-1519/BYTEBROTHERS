"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoSrc from "../../assets/logo.jpeg";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  tab: string;
}

export interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenAiEstimator?: () => void;
  onOpenContactModal?: () => void;
  logoText?: string;
  statusText?: string;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Work",     tab: "portfolio" },
  { label: "Services", tab: "services"  },
  { label: "Studio",   tab: "about"     },
  { label: "Gallery",  tab: "gallery"   },
  { label: "3D View",  tab: "rotatable-portfolio" },
  { label: "Contact",  tab: "contact"   },
];

// ─── Animated menu icon (two-line morphing) ───────────────────────────────────

const MenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className="transition-all duration-300"
  >
    <path
      d={open ? "M 4 4 L 16 16" : "M 3 7 L 17 7"}
      className="transition-all duration-300 ease-in-out"
    />
    <path
      d={open ? "M 4 16 L 16 4" : "M 3 13 L 17 13"}
      className="transition-all duration-300 ease-in-out"
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = "home",
  setActiveTab,
  onOpenContactModal,
  logoText = "BYTEBROTHERS",
  statusText = "Available for Q3/Q4",
  className = "",
}) => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [hovered, setHovered]           = useState<string | null>(null);
  const mobileRef                       = useRef<HTMLDivElement>(null);

  // ── Scroll opacity transition ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on outside click ────────────────────────────────────
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const navigate = useCallback(
    (tab: string) => {
      setActiveTab?.(tab);
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setActiveTab]
  );

  const handleCta = useCallback(() => {
    setMobileOpen(false);
    if (onOpenContactModal) {
      onOpenContactModal();
    } else {
      setActiveTab?.("contact");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [onOpenContactModal, setActiveTab]);

  // ── Navbar bg opacity driven by scroll ────────────────────────────────────
  const bgOpacity  = scrolled ? "88" : "60"; // hex opacity suffix on --void
  const blurClass  = scrolled ? "backdrop-blur-xl" : "backdrop-blur-md";
  const shadowClass = scrolled
    ? "shadow-[0_8px_32px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.04)]"
    : "shadow-[0_4px_20px_rgba(0,0,0,0.5)]";

  return (
    <>
      {/* ── CSS variables injected once ─────────────────────────────────── */}
      <style>{`
        :root {
          --void:          #050608;
          --surface:       #0c0e12;
          --line:          rgba(255,255,255,0.08);
          --blue:          #2f7bff;
          --blue-bright:   #5ea1ff;
          --white:         #f5f7fa;
          --gray:          #8b93a1;
          /* legacy aliases */
          --signal-cyan:   #2f7bff;
          --signal-violet: #5ea1ff;
          --text-hi:       #f5f7fa;
          --text-lo:       #8b93a1;
        }
        .nav-link-hover:hover {
          color: var(--blue);
          text-shadow: 0 0 12px rgba(47,123,255,0.5);
        }
        .nav-link-active::after {
          content: '';
          display: block;
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1.5px;
          background: var(--blue);
          box-shadow: 0 0 8px var(--blue);
          border-radius: 2px;
        }
        .cta-btn {
          background: linear-gradient(135deg, var(--blue) 0%, var(--blue-bright) 100%);
          color: #f5f7fa;
          font-weight: 600;
        }
        .cta-btn:hover {
          filter: brightness(1.12) saturate(1.1);
          box-shadow: 0 0 20px rgba(47,123,255,0.45), 0 0 40px rgba(94,161,255,0.2);
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none ${className}`}
        role="banner"
      >
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`
            pointer-events-auto w-full transition-all duration-500 ease-out
            rounded-2xl border-b
            ${blurClass} ${shadowClass}
          `}
          style={{
            backgroundColor: `rgba(5,6,8,${scrolled ? 0.92 : 0.65})`,
            borderColor: "var(--line)",
            maxWidth: scrolled ? "900px" : "1040px",
          }}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between px-5 py-3">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <button
              onClick={() => navigate("home")}
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] rounded-lg"
              aria-label="ByteBrothers — go to homepage"
            >
              {/* Mark — circuit-B logo image with ambient glow on hover */}
              <div
                className="relative flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 0 0 transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 14px rgba(47,123,255,0.3), 0 0 28px rgba(94,161,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                <img
                  src={logoSrc}
                  alt="ByteBrothers logo"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Wordmark — Space Grotesk, tight tracking */}
              <span
                className="font-display text-sm font-semibold transition-colors duration-200"
                style={{ color: "var(--text-hi)", letterSpacing: "-0.02em" }}
              >
                {logoText}
              </span>
            </button>

            {/* ── Desktop nav links ─────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => navigate(item.tab)}
                    onMouseEnter={() => setHovered(item.tab)}
                    onMouseLeave={() => setHovered(null)}
                    role="listitem"
                    className={`
                      relative px-4 py-1.5 text-[13px] font-display font-medium uppercase tracking-wide
                      transition-all duration-200 rounded-lg focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-[var(--blue)]
                      nav-link-hover
                      ${isActive ? "nav-link-active" : ""}
                    `}
                    style={{
                      color: isActive
                        ? "var(--blue)"
                        : hovered === item.tab
                        ? "var(--blue)"
                        : "var(--white)",
                      letterSpacing: "0.06em",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* ── Right side: status + CTA ──────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Availability — mono, muted, ONE instance only */}
              <span
                className="font-mono text-[10px] tracking-widest"
                style={{ color: "var(--text-lo)" }}
                aria-label={`Studio status: ${statusText}`}
              >
                {statusText}
              </span>

              {/* CTA — the only fully-saturated element */}
              <button
                onClick={handleCta}
                className="cta-btn relative inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[13px] font-display tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] active:scale-[0.97]"
                aria-label="Book a discovery call"
              >
                Book Discovery Call
                <span aria-hidden="true" className="opacity-70">→</span>
              </button>
            </div>

            {/* ── Mobile: CTA abbreviated + menu toggle ─────────────────── */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={handleCta}
                className="cta-btn inline-flex items-center px-3 py-1.5 rounded-xl text-[12px] font-display tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] active:scale-[0.97]"
                aria-label="Book a discovery call"
              >
                Book a Call
              </button>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: mobileOpen ? "var(--blue)" : "var(--white)",
                }}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <MenuIcon open={mobileOpen} />
              </button>
            </div>

          </div>
        </motion.nav>

        {/* ── Mobile drawer ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              ref={mobileRef}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute top-[calc(100%+6px)] left-4 right-4 mx-auto rounded-2xl backdrop-blur-2xl p-5 flex flex-col gap-3"
              style={{
                maxWidth: "480px",
                background: "rgba(5,6,8,0.97)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(47,123,255,0.06)",
              }}
              role="dialog"
              aria-label="Mobile navigation"
            >
              {/* Header row */}
              <div
                className="flex items-center justify-between pb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="font-display text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-lo)" }}
                >
                  Navigation
                </span>
                <span
                  className="font-mono text-[10px] tracking-widest"
                  style={{ color: "var(--text-lo)" }}
                >
                  {statusText}
                </span>
              </div>

              {/* Nav links */}
              <nav aria-label="Mobile navigation links">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeTab === item.tab;
                  return (
                    <motion.button
                      key={item.tab}
                      onClick={() => navigate(item.tab)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.18 }}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-left font-display text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
                      style={{
                        color: isActive ? "var(--blue)" : "var(--white)",
                        background: isActive ? "rgba(47,123,255,0.06)" : "transparent",
                        border: isActive
                          ? "1px solid rgba(47,123,255,0.14)"
                          : "1px solid transparent",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: "var(--blue)",
                            boxShadow: "0 0 6px var(--blue)",
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <div style={{ paddingTop: "4px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={handleCta}
                  className="cta-btn w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-sm tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] active:scale-[0.98]"
                  aria-label="Book a discovery call"
                >
                  Book Discovery Call
                  <span aria-hidden="true" className="opacity-70">→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
