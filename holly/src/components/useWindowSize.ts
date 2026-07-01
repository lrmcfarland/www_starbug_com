// useWindowSize.ts
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  isMobile: boolean;
}

export function useWindowSize(mobileBreakpoint: number = 768): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        isMobile: window.innerWidth < mobileBreakpoint,
      };
    }
    return { width: 1200, isMobile: false };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        isMobile: window.innerWidth < mobileBreakpoint,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  return windowSize;
}
