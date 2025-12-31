'use client';

import { useState, useEffect } from 'react';

const DEMO_MODE_KEY = 'weave-demo-mode';

/**
 * Hook to manage demo mode state
 * Demo mode is the ONLY time mock data should be shown
 */
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check localStorage for demo mode
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    if (stored === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    console.log('[Demo] Demo mode enabled - mock data will be shown');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem(DEMO_MODE_KEY);
    console.log('[Demo] Demo mode disabled - only real data will be shown');
  };

  return { isDemoMode, enableDemoMode, disableDemoMode };
}
