"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Terminal, Sparkles, Command } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface NavbarProps {
  /** Current active path. Defaults to '/' */
  activePath?: string;
  /** Navigation items list */
  items?: NavItem[];
  /** Callback when RFQ / Terminal button or ⌘K is pressed */
  onOpenRfq?: () => void;
  /** Custom logo text */
  logoText?: string;
  /** Availability status text */
  statusText?: string;
  /** Custom class name for top wrapper */
  className?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export const Navbar: React.FC<NavbarProps> = ({
  activePath = "/",
  items = DEFAULT_NAV_ITEMS,
  onOpenRfq,
  logoText = "BYTEBROTHERS",
  statusText = "AVAILABLE FOR Q3/Q4",
  className = "",
}) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(activePath);

  // Sync internal path state if prop changes
  useEffect(() => {
    setCurrentPath(activePath);
  }, [activePath]);

  // Handle scroll detection for dynamic glassmorphic pill contraction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ⌘K / Ctrl+K keyboard shortcut trigger for Terminal RFQ
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (onOpenRfq) {
          onOpenRfq();
        }
      }
    },
    [onOpenRfq]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    setCurrentPath(href);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none transition-all duration-300 ${className}`}
    >
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto w-full transition-all duration-300 ease-out rounded-full border ${
          scrolled
            ? "max-w-4xl bg-zinc-950/85 backdrop-blur-xl border-zinc-800/90 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_15px_rgba(34,211,238,0.08)] py-2 px-4 sm:px-5"
            : "max-w-5xl bg-zinc-950/70 backdrop-blur-md border-zinc-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-3 px-5 sm:px-6"
        }`}
        aria-label="Main Navigation"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick("/", e)}
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="ByteBrothers Homepage"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/50 transition-colors">
                <span className="font-mono text-xs font-black text-zinc-100 group-hover:text-cyan-300 transition-colors">
                  BB
                </span>
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>
              <span className="font-mono font-bold tracking-tight text-sm text-zinc-100 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                {logoText}
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-full border border-zinc-800/60">
            {items.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`relative px-4 py-1.5 rounded-full font-mono text-xs font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? "text-cyan-300"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-full bg-cyan-950/70 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-cyan-500/20 text-cyan-400 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Right Action Tools: Status Indicator & Terminal RFQ */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Pulsing Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </span>
              <span>{statusText}</span>
            </div>

            {/* Terminal RFQ CTA Button */}
            <button
              onClick={onOpenRfq}
              className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono font-semibold tracking-wide transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
              aria-label="Open Terminal RFQ (Shortcut Command K)"
            >
              <Terminal className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
              <span>[ Terminal RFQ ]</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-medium rounded bg-cyan-900/50 text-cyan-400 border border-cyan-700/60">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Terminal RFQ CTA for Mobile */}
            <button
              onClick={onOpenRfq}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium shadow-[0_0_10px_rgba(34,211,238,0.15)]"
              aria-label="Terminal RFQ"
            >
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>RFQ</span>
            </button>

            {/* Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-cyan-400 border border-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-cyan-400" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Glassmorphic Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto absolute top-20 left-4 right-4 max-w-lg mx-auto rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.1)] flex flex-col gap-5 z-50"
          >
            {/* Mobile Status Badge */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-zinc-200">
                  BYTEBROTHERS NAV
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{statusText}</span>
              </div>
            </div>

            {/* Mobile Nav Links with Stagger */}
            <div className="flex flex-col gap-2">
              {items.map((item, index) => {
                const isActive = currentPath === item.href;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl font-mono text-sm font-medium transition-all ${
                      isActive
                        ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRfq) onOpenRfq();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-98"
              >
                <Terminal className="h-4 w-4" />
                <span>Trigger [ Terminal RFQ ]</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
