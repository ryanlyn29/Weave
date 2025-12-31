'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { useBackendHealth } from '@/lib/hooks/useBackendHealth';

/**
 * Banner component to show when backend is offline
 */
export function BackendOfflineBanner() {
  const { isHealthy, isChecking, error } = useBackendHealth();

  if (isHealthy || isChecking) {
    return null;
  }

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-red-800">
        <AlertCircle className="w-4 h-4" />
        <span>Backend is offline or unreachable</span>
        {error && (
          <span className="text-xs text-red-600 ml-2">({error.message})</span>
        )}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900 px-2 py-1 rounded hover:bg-red-100"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    </div>
  );
}
