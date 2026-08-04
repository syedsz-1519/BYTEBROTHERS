import { useEffect, useRef, useState } from 'react';

interface ScrollProgressContext {
  progress: number;
  updateProgress: (value: number) => void;
}

// Shared scroll progress source of truth
const scrollProgressRef = { current: 0 };
let listeners: (() => void)[] = [];

export function notifyScrollListeners() {
  listeners.forEach(cb => cb());
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTrackEl = document.getElementById('scroll-track');
      if (!scrollTrackEl) {
        scrollProgressRef.current = 0;
        return;
      }

      const trackHeight = scrollTrackEl.getBoundingClientRect().height;
      const maxScroll = trackHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const newProgress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);

      scrollProgressRef.current = newProgress;
      setProgress(newProgress);
      notifyScrollListeners();
    };

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
