'use client'

import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { ActivityFilters } from '@/components/activity/ActivityFilters'
import { useState } from 'react'
import { ActivityItem } from '@/lib/types'
import { mockActivities } from '@/lib/mockData'

export default function ActivityPage() {
  const [filters, setFilters] = useState({
    person: undefined as string | undefined,
    type: [] as string[],
    importance: undefined as 'high' | 'medium' | 'low' | undefined,
    resolutionState: undefined as 'resolved' | 'unresolved' | undefined,
  })

  const filteredActivities = mockActivities.filter(activity => {
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
        <ActivityTimeline activities={filteredActivities} />
      </div>
      <div className="w-80 border-l border-gray-200 bg-white p-4">
        <ActivityFilters filters={filters} onFiltersChange={setFilters} />
      </div>
    </div>
  )
}

