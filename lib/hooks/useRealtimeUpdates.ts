'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api-client';

/**
 * Hook for real-time updates using polling (can be upgraded to WebSocket/SSE)
 */
export function useRealtimeUpdates(
  callback: () => void,
  interval: number = 5000,
  enabled: boolean = true
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Poll for updates
    intervalRef.current = setInterval(() => {
      callback();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval, enabled]);
}

/**
 * Hook for real-time message updates in a thread
 */
export function useRealtimeMessages(threadId: string | null, onUpdate: () => void) {
  useRealtimeUpdates(onUpdate, 3000, !!threadId);
}

/**
 * Hook for real-time thread list updates
 */
export function useRealtimeThreads(onUpdate: () => void) {
  useRealtimeUpdates(onUpdate, 5000, true);
}
