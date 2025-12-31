'use client'

import { Dropdown } from '@/components/ui/Dropdown'
import { Checkbox } from '@/components/ui/Checkbox'

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
            <label key={type} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <Checkbox
                checked={filters.type?.includes(type) || false}
                onChange={(checked) => {
                  const newTypes = checked
                    ? [...(filters.type || []), type]
                    : (filters.type || []).filter(t => t !== type)
                  onFiltersChange({ ...filters, type: newTypes })
                }}
              />
              <span className="capitalize">{type.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Importance</label>
        <Dropdown
          value={filters.importance || 'all'}
          options={[
            { value: 'all', label: 'All' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
          onChange={(value) => onFiltersChange({ ...filters, importance: value === 'all' ? undefined : value as any })}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Resolution State</label>
        <Dropdown
          value={filters.resolutionState || 'all'}
          options={[
            { value: 'all', label: 'All' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'unresolved', label: 'Unresolved' },
          ]}
          onChange={(value) => onFiltersChange({ ...filters, resolutionState: value === 'all' ? undefined : value as any })}
          className="w-full"
        />
      </div>
    </div>
  )
}

