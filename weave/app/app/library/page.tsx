'use client'

import { useState } from 'react'
import { LibraryTable } from '@/components/library/LibraryTable'
import { LibraryFilters } from '@/components/library/LibraryFilters'
import { LibraryUtilityPanel } from '@/components/library/LibraryUtilityPanel'
import { mockEntities } from '@/lib/mockData'

const entityTypes = ['plan', 'decision', 'recommendation', 'promise', 'memory'] as const

export default function LibraryPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    ownerId: undefined as string | undefined,
    timeframe: 'all' as 'day' | 'week' | 'month' | 'all',
  })

  const filteredEntities = mockEntities.filter(entity => {
    if (selectedType !== 'all' && entity.type !== selectedType) return false
    if (filters.type.length > 0 && !filters.type.includes(entity.type)) return false
    if (filters.status.length > 0 && !filters.status.includes(entity.status)) return false
    return true
  })

  const counts = entityTypes.reduce((acc, type) => {
    const typeEntities = mockEntities.filter(e => e.type === type)
    acc[type] = {
      total: typeEntities.length,
      unresolved: typeEntities.filter(e => e.status !== 'resolved' && e.status !== 'done').length,
    }
    return acc
  }, {} as Record<string, { total: number; unresolved: number }>)

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-gray-200 bg-white p-4">
        <nav className="space-y-1">
          <button
            onClick={() => setSelectedType('all')}
            className={`w-full text-left px-3 py-2 rounded-bubble text-sm ${
              selectedType === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {entityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left px-3 py-2 rounded-bubble text-sm flex items-center justify-between ${
                selectedType === type ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="capitalize">{type}s</span>
              <div className="flex items-center gap-2">
                {counts[type].unresolved > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-warning/20 text-warning rounded">
                    {counts[type].unresolved}
                  </span>
                )}
                <span className="text-xs text-gray-500">{counts[type].total}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6">
          <LibraryTable entities={filteredEntities} />
        </div>
      </div>
      <div className="w-80 border-l border-gray-200 bg-white p-4">
        <LibraryFilters filters={filters} onFiltersChange={setFilters} />
        <LibraryUtilityPanel entities={filteredEntities} />
      </div>
    </div>
  )
}

