'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 text-center max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  )
}

