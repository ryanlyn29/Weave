'use client'

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function ConversationSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse" />
        </div>
        <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-16 bg-gray-200 rounded-2xl w-3/4 animate-pulse" />
      </div>
    </div>
  )
}

