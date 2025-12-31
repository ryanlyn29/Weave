'use client'

import { useState, useEffect } from 'react'
import { LibraryTable } from '@/components/weave/library/LibraryTable'
import { LibraryFilters } from '@/components/weave/library/LibraryFilters'
import { LibraryUtilityPanel } from '@/components/weave/library/LibraryUtilityPanel'
import { CollapsibleSidebar } from '@/components/weave/layout/CollapsibleSidebar'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import { api, ExtractedEntity, ApiError } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { LibraryFilter } from '@/lib/weaveTypes'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

const entityTypes = ['plan', 'decision', 'recommendation', 'promise', 'memory'] as const

type LoadingState = 'loading' | 'success' | 'error' | 'empty'

export default function LibraryPage() {
  const { authReady, user } = useAuth()
  const isAuthenticated = !!user
  const [selectedType, setSelectedType] = useState<string>('all')
  const [filters, setFilters] = useLocalStorage<LibraryFilter>('library-filters', {
    type: [],
    status: [],
    ownerId: undefined,
    timeframe: 'all',
  })
  const [state, setState] = useState<LoadingState>('loading')
  const [entities, setEntities] = useState<ExtractedEntity[]>([])

  useEffect(() => {
    const loadEntities = async () => {
      // Wait for auth to be ready
      if (!authReady) {
        return
      }

      // Only load if authenticated
      if (!isAuthenticated) {
        setState('empty')
        setEntities([])
        return
      }

      try {
        setState('loading')
        
        const result = await api.getLibrary({
          type: selectedType !== 'all' ? selectedType : undefined,
          status: filters.status && filters.status.length > 0 ? filters.status.join(',') : undefined,
          ownerId: filters.ownerId,
          timeframe: filters.timeframe || 'all',
        })
        
        // Handle null response (user not authenticated)
        if (!result) {
          setState('empty')
          setEntities([])
          return
        }
        
        if (result.entities.length === 0) {
          setState('empty')
        } else {
          setEntities(result.entities)
          setState('success')
        }
      } catch (error) {
        console.error('Error loading library:', error)
        setState('error')
      }
    }

    if (typeof window !== 'undefined') {
      loadEntities()
    }
  }, [selectedType, filters, authReady, isAuthenticated])

  const filteredEntities = entities.filter(entity => {
    if (selectedType !== 'all' && entity.type !== selectedType) return false
    if (filters.type && filters.type.length > 0 && !filters.type.includes(entity.type)) return false
    if (filters.status && filters.status.length > 0 && !filters.status.includes(entity.status)) return false
    return true
  })

  const counts = entityTypes.reduce((acc, type) => {
    const typeEntities = entities.filter(e => e.type === type)
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
            className={`w-full text-left px-3 py-2 rounded-2xl text-sm ${
              selectedType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {entityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left px-3 py-2 rounded-2xl text-sm flex items-center justify-between ${
                selectedType === type ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="capitalize">{type}s</span>
              <div className="flex items-center gap-2">
                {counts[type].unresolved > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
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
          {state === 'loading' && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeleton key={i} lines={3} />
              ))}
            </div>
          )}
          {state === 'error' && (
            <ErrorState
              message="Failed to load library. Please check your connection."
              onRetry={() => window.location.reload()}
            />
          )}
          {state === 'empty' && (
            <EmptyState
              icon={BookOpen}
              title="No entities yet"
              description="Entities extracted from your conversations will appear here. Start chatting to see them populate."
            />
          )}
          {state === 'success' && (
            filteredEntities.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No matching entities"
                description="Try adjusting your filters to see more results."
              />
            ) : (
              <LibraryTable entities={filteredEntities} />
            )
          )}
        </div>
      </div>
      <div className="relative">
        <CollapsibleSidebar
          storageKey="library-utility-panel"
          position="right"
          width={320}
        >
          <div className="p-4 h-full">
            <LibraryFilters filters={filters} onFiltersChange={setFilters} />
            <LibraryUtilityPanel entities={filteredEntities} filters={filters} />
          </div>
        </CollapsibleSidebar>
      </div>
    </div>
  )
}

