'use client'

import { useState } from 'react'
import { mockEntities } from '@/lib/mockData'
import { Play, Filter } from 'lucide-react'

function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

interface ContextRailProps {
  threadId: string
}

export function ContextRail({ threadId }: ContextRailProps) {
  const [filter, setFilter] = useState<'all' | 'plan' | 'decision' | 'promise' | 'memory'>('all')
  
  const threadEntities = mockEntities.filter(e => e.threadId === threadId)
  const filteredEntities = filter === 'all' 
    ? threadEntities 
    : threadEntities.filter(e => e.type === filter)

  const activePlans = filteredEntities.filter(e => e.type === 'plan' && e.status !== 'cancelled')
  const openQuestions = filteredEntities.filter(e => e.status === 'proposed')
  const recentDecisions = filteredEntities.filter(e => e.type === 'decision' && e.status === 'confirmed')
  const linkedMemories = filteredEntities.filter(e => e.type === 'memory')

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Context</h3>
          <button className="p-1 hover:bg-gray-100 rounded-bubble">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {(['all', 'plan', 'decision', 'promise', 'memory'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs px-2 py-1 rounded-bubble ${
                filter === type
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {activePlans.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Active Plans</h4>
            <div className="space-y-2">
              {activePlans.map((entity) => (
                <div key={entity.id} className="bg-white rounded-bubble p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900 mb-1">{entity.title}</div>
                  {entity.metadata?.date && (
                    <div className="text-xs text-gray-500">{entity.metadata.date}</div>
                  )}
                  {entity.voiceSummaryUrl && (
                    <button className="mt-2 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                      <Play className="w-3 h-3" />
                      Play summary
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {openQuestions.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Open Questions</h4>
            <div className="space-y-2">
              {openQuestions.map((entity) => (
                <div key={entity.id} className="bg-white rounded-bubble p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">{entity.title}</div>
                  <button className="mt-1 text-xs text-primary-600 hover:text-primary-700">
                    Jump to message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentDecisions.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Decisions</h4>
            <div className="space-y-2">
              {recentDecisions.map((entity) => (
                <div key={entity.id} className="bg-white rounded-bubble p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900 mb-1">{entity.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(entity.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {linkedMemories.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Linked Memories</h4>
            <div className="space-y-2">
              {linkedMemories.map((entity) => (
                <div key={entity.id} className="bg-white rounded-bubble p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">{entity.title}</div>
                  {entity.voiceSummaryUrl && (
                    <button className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                      <Play className="w-3 h-3" />
                      Play memory
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

