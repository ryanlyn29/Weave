'use client'

import { ActivityTimeline } from '@/components/weave/activity/ActivityTimeline'
import { ActivityFilters } from '@/components/weave/activity/ActivityFilters'
import { useState, useEffect } from 'react'
import { api, ActivityItem, ApiError } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Activity } from 'lucide-react'

type LoadingState = 'loading' | 'success' | 'error' | 'empty'

export default function ActivityPage() {
  const { authReady, user } = useAuth()
  const isAuthenticated = !!user
  const [filters, setFilters] = useState({
    person: undefined as string | undefined,
    type: [] as string[],
    importance: undefined as 'high' | 'medium' | 'low' | undefined,
    resolutionState: undefined as 'resolved' | 'unresolved' | undefined,
  })
  const [state, setState] = useState<LoadingState>('loading')
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const loadActivities = async () => {
      // Wait for auth to be ready
      if (!authReady) {
        return
      }

      // Only load if authenticated
      if (!isAuthenticated) {
        setState('empty')
        setActivities([])
        return
      }

      try {
        setState('loading')
        
        const result = await api.getActivity({
          type: filters.type.length > 0 ? filters.type.join(',') : undefined,
          importance: filters.importance,
          state: filters.resolutionState,
          person: filters.person,
        })
        
        // Handle null response (user not authenticated)
        if (!result) {
          setState('empty')
          setActivities([])
          return
        }
        
        if (result.activities.length === 0) {
          setState('empty')
        } else {
          setActivities(result.activities)
          setState('success')
        }
      } catch (error) {
        console.error('Error loading activity:', error)
        setState('error')
      }
    }

    if (typeof window !== 'undefined') {
      loadActivities()
    }
  }, [filters, authReady, isAuthenticated])

  const filteredActivities = activities.filter(activity => {
    if (filters.person && activity.userId !== filters.person) return false
    if (filters.type.length > 0 && !filters.type.includes(activity.type)) return false
    if (filters.importance) {
      const isHigh = activity.importance >= 0.8
      const isMedium = activity.importance >= 0.5 && activity.importance < 0.8
      if (filters.importance === 'high' && !isHigh) return false
      if (filters.importance === 'medium' && !isMedium) return false
      if (filters.importance === 'low' && activity.importance >= 0.5) return false
    }
    return true
  })

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        {state === 'loading' && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton key={i} lines={3} />
            ))}
          </div>
        )}
        {state === 'error' && (
          <ErrorState
            message="Failed to load activity. Please check your connection."
            onRetry={() => window.location.reload()}
          />
        )}
        {state === 'empty' && (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Activity from your conversations will appear here as decisions are made and items are resolved."
          />
        )}
        {state === 'success' && (
          filteredActivities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No matching activity"
              description="Try adjusting your filters to see more results."
            />
          ) : (
            <ActivityTimeline activities={filteredActivities} />
          )
        )}
      </div>
      <div className="w-80 border-l border-gray-200 bg-white p-4">
        <ActivityFilters filters={filters} onFiltersChange={setFilters} />
      </div>
    </div>
  )
}

