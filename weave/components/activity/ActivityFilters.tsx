'use client'

import { ActivityItem } from '@/lib/types'

interface ActivityFiltersProps {
  filters: {
    person?: string
    type?: string[]
    importance?: 'high' | 'medium' | 'low'
    resolutionState?: 'resolved' | 'unresolved'
  }
  onFiltersChange: (filters: any) => void
}

const activityTypes = ['decision_made', 'item_resolved', 'memory_resurfaced', 'nudge_sent'] as const

export function ActivityFilters({ filters, onFiltersChange }: ActivityFiltersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filters</h3>
      
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Type</label>
        <div className="space-y-1">
          {activityTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={filters.type?.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...(filters.type || []), type]
                    : (filters.type || []).filter(t => t !== type)
                  onFiltersChange({ ...filters, type: newTypes })
                }}
                className="rounded border-gray-300"
              />
              <span className="capitalize">{type.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Importance</label>
        <select
          value={filters.importance || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, importance: e.target.value === 'all' ? undefined : e.target.value })}
          className="w-full text-xs border border-gray-300 rounded-bubble px-2 py-1 bg-white"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Resolution State</label>
        <select
          value={filters.resolutionState || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, resolutionState: e.target.value === 'all' ? undefined : e.target.value })}
          className="w-full text-xs border border-gray-300 rounded-bubble px-2 py-1 bg-white"
        >
          <option value="all">All</option>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Unresolved</option>
        </select>
      </div>
    </div>
  )
}

