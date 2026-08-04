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
        setProgress(0);
        return;
      }

      // Calculate based on document scroll position
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = documentHeight - viewportHeight;
      const currentScroll = window.scrollY;
      
      // Calculate progress: 0 at top, 1 when fully scrolled
      const newProgress = maxScroll > 0 ? Math.min(Math.max(currentScroll / maxScroll, 0), 1) : 0;

      scrollProgressRef.current = newProgress;
      setProgress(newProgress);
      notifyScrollListeners();
    };

    // Initial calculation
    setTimeout(handleScroll, 0);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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
