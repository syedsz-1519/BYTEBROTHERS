import { useEffect, useRef, useState } from 'react';

// Shared scroll progress source of truth
const scrollProgressRef = { current: 0 };
let listeners: (() => void)[] = [];

export function notifyScrollListeners() {
  listeners.forEach(cb => cb());
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTrackEl = document.getElementById('scroll-track');
      if (!scrollTrackEl) {
        scrollProgressRef.current = 0;
        return;
      }

      // Get the actual scrollable height (document height - viewport height)
      const scrollTrackRect = scrollTrackEl.getBoundingClientRect();
      const documentHeight = scrollTrackRect.bottom + window.scrollY;
      const maxScroll = documentHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      // Calculate progress: 0 at top, 1 when scroll-track is fully scrolled
      const newProgress = maxScroll > 0 ? Math.min(Math.max(currentScroll / maxScroll, 0), 1) : 0;

      scrollProgressRef.current = newProgress;
      setProgress(newProgress);
      notifyScrollListeners();
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

export function getScrollProgress() {
  return scrollProgressRef.current;
}

export function subscribeToScrollProgress(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}
