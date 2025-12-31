'use client'

import { LibraryFilter } from '@/lib/weaveTypes'
import { Dropdown } from '@/components/ui/Dropdown'
import { Checkbox } from '@/components/ui/Checkbox'

interface LibraryFiltersProps {
  filters: LibraryFilter
  onFiltersChange: (filters: LibraryFilter) => void
}

export function LibraryFilters({ filters, onFiltersChange }: LibraryFiltersProps) {
  const entityTypes = ['plan', 'decision', 'recommendation', 'promise', 'memory'] as const
  const statuses = ['proposed', 'confirmed', 'changed', 'cancelled', 'done', 'pending', 'resolved'] as const

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Type</label>
          <div className="space-y-1">
            {entityTypes.map((type) => (
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
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Status</label>
          <div className="space-y-1">
            {statuses.map((status) => (
              <label key={status} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <Checkbox
                  checked={filters.status?.includes(status) || false}
                  onChange={(checked) => {
                    const newStatuses = checked
                      ? [...(filters.status || []), status]
                      : (filters.status || []).filter(s => s !== status)
                    onFiltersChange({ ...filters, status: newStatuses })
                  }}
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Timeframe</label>
          <Dropdown
            value={filters.timeframe || 'all'}
            options={[
              { value: 'all', label: 'All time' },
              { value: 'day', label: 'Last 24 hours' },
              { value: 'week', label: 'Last week' },
              { value: 'month', label: 'Last month' },
            ]}
            onChange={(value) => onFiltersChange({ ...filters, timeframe: value as any })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

