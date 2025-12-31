'use client';

import { useState, useEffect, useRef } from 'react';
import { config } from '@/lib/config';

interface HealthStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastCheck: Date | null;
  error: Error | null;
}

/**
 * Hook to monitor backend health
 * Pings /v1/health endpoint and retries if unreachable
 */
export function useBackendHealth() {
  const [status, setStatus] = useState<HealthStatus>({
    isHealthy: false,
    isChecking: true,
    lastCheck: null,
    error: null,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkHealth = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true }));

    try {
      const response = await fetch(`${config.api.baseUrl}/v1/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Short timeout to fail fast
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Backend] Health check passed:', data);
        setStatus({
          isHealthy: true,
          isChecking: false,
          lastCheck: new Date(),
          error: null,
        });
      } else {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown health check error');
      console.warn('[Backend] Health check failed:', err.message);
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastCheck: new Date(),
        error: err,
      });

      // Retry after 5 seconds
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        checkHealth();
      }, 5000);
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Periodic health checks every 30 seconds (only if healthy)
    intervalRef.current = setInterval(() => {
      if (status.isHealthy) {
        checkHealth();
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return status;
}
