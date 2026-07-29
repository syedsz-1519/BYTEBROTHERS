import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScrollableHeight = scrollHeight - clientHeight;

      if (totalScrollableHeight <= 0) {
        setScrollPercentage(0);
        return;
      }

      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max((currentScroll / totalScrollableHeight) * 100, 0), 100);
      setScrollPercentage(progress);
    };

    calculateScrollProgress();
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });

    const observer = new MutationObserver(calculateScrollProgress);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 sm:h-1 bg-transparent pointer-events-none"
      aria-label="Reading progress bar"
      role="progressbar"
      aria-valuenow={Math.round(scrollPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-75 ease-out rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
};
