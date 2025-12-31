'use client';

import { AlertTriangle } from 'lucide-react';
import { getFirebaseError } from '@/lib/firebase';

/**
 * Component to show when Firebase configuration is missing
 */
export function FirebaseConfigError() {
  const error = getFirebaseError();

  if (!error) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 m-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-900 mb-1">
            Firebase Configuration Missing
          </h3>
          <p className="text-sm text-yellow-700 mb-2">
            {error.message}
          </p>
          <p className="text-xs text-yellow-600">
            Please check your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file and ensure all{' '}
            <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_FIREBASE_*</code> variables are set.
          </p>
        </div>
      </div>
    </div>
  );
}
