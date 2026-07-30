import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useOnlineStatus, syncPendingInquiries, getPendingInquiries } from '../utils/offlineCache';
import { useNotifications } from '../utils/notifications';
import { 
  Sun, 
  Moon, 
  Bell, 
  Wifi, 
  WifiOff, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Clock,
  Radio,
  Send,
  Trash2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiEstimator: () => void;
  onOpenContactModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiEstimator,
  onOpenContactModal
}) => {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const {
    notifications,
    pushEnabled,
    unreadCount,
    togglePushNotifications,
    markAllAsRead,
    clearNotification,
    triggerPushAlert
  } = useNotifications();

  const pendingInquiries = getPendingInquiries();

  const handleSyncOfflineData = async () => {
    setSyncing(true);
    const count = await syncPendingInquiries();
    setSyncing(false);
    if (count > 0) {
      triggerPushAlert(
        'Offline Inquiries Synced',
        `Successfully transmitted ${count} saved inquiry submission(s) to White Brothers servers!`,
        'inquiry'
      );
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Studio' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'workflow-guide', label: '3D Workflow' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display font-bold text-lg shadow-md transition-transform duration-200 group-hover:scale-105 border border-white/20">
            W
          </div>
          <div>
            <div className="font-display font-bold tracking-tight text-base text-[var(--text-primary)] flex items-center gap-1.5">
              WHITE BROTHERS
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
              3D &amp; Webflow Architects
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-3.5 py-1.5 rounded-md font-sans text-xs font-medium tracking-wide transition-colors duration-150 ${
                  isActive
                    ? 'text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* AI Estimator Button */}
          <button
            onClick={onOpenAiEstimator}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 text-xs font-mono font-medium transition-colors"
            title="Generate AI Architectural Spec"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Estimator</span>
          </button>

          {/* Network / Offline Indicator */}
          <div className="relative">
            <button
              onClick={handleSyncOfflineData}
              disabled={!isOnline || pendingInquiries.length === 0}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
                isOnline
                  ? 'border-emerald-500/30 text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                  : 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-500/10 animate-pulse'
              }`}
              title={isOnline ? 'Online - Local SW Cache Active' : 'Offline Mode - Form submissions will queue locally'}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Offline</span>
                </>
              )}
              {pendingInquiries.length > 0 && (
                <span className="ml-1 rounded-full bg-amber-500 text-black px-1.5 py-0.2 font-bold text-[9px]">
                  {pendingInquiries.length}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Push Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <Radio className={`h-4 w-4 ${pushEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span className="font-display font-semibold text-xs text-[var(--text-primary)]">
                      Real-time Studio Push
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePushNotifications}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                        pushEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {pushEnabled ? 'Push Active' : 'Enable Push'}
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-mono text-blue-400 hover:underline"
                      >
                        Read all
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs font-mono text-[var(--text-muted)]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border text-xs transition-colors ${
                          item.read
                            ? 'border-transparent bg-[var(--bg-container)]/50 opacity-70'
                            : 'border-blue-500/30 bg-blue-500/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                            {!item.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>}
                            {item.title}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          {item.body}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <button
                            onClick={() => clearNotification(item.id)}
                            className="text-zinc-500 hover:text-red-400 p-0.5"
                            title="Dismiss"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <button
                    onClick={() =>
                      triggerPushAlert(
                        'Simulated Build Alert',
                        'Syed committed a performance optimization to V8 render pipeline.',
                        'build'
                      )
                    }
                    className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <Send className="h-2.5 w-2.5" /> Test Push Event
                  </button>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Service Worker Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-blue-600" />}
          </button>

          {/* Primary CTA - Hire Us */}
          <button
            onClick={onOpenContactModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-all duration-150 shadow-sm hover:shadow-blue-500/20"
          >
            <span>HIRE US</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-blue-500/10 text-blue-400 font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-container)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[var(--border-color)] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAiEstimator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Project Estimator</span>
            </button>
            <button
              onClick={() => {
                onOpenContactModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-xs font-semibold tracking-wide"
            >
              <span>HIRE US NOW</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
