'use client'

import { LibraryFilter } from '@/lib/types'

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
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Status</label>
          <div className="space-y-1">
            {statuses.map((status) => (
              <label key={status} className="flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status)}
                  onChange={(e) => {
                    const newStatuses = e.target.checked
                      ? [...(filters.status || []), status]
                      : (filters.status || []).filter(s => s !== status)
                    onFiltersChange({ ...filters, status: newStatuses })
                  }}
                  className="rounded border-gray-300"
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Timeframe</label>
          <select
            value={filters.timeframe}
            onChange={(e) => onFiltersChange({ ...filters, timeframe: e.target.value as any })}
            className="w-full text-xs border border-gray-300 rounded-bubble px-2 py-1 bg-white"
          >
            <option value="all">All time</option>
            <option value="day">Last 24 hours</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
          </select>
        </div>
      </div>
    </div>
  )
}

