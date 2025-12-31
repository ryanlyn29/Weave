'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuthReady } from '@/lib/hooks/useAuthReady'
import { Play, Filter } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

function formatDistanceToNow(date: Date): string {
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
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'plan' | 'decision' | 'promise' | 'memory'>('all')
  const [playModalOpen, setPlayModalOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  
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
          <button className="p-1 hover:bg-gray-100 rounded-2xl">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {(['all', 'plan', 'decision', 'promise', 'memory'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs px-2 py-1 rounded-2xl ${
                filter === type
                  ? 'bg-blue-100 text-blue-700'
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
                <div key={entity.id} className="bg-white rounded-2xl p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900 mb-1">{entity.title}</div>
                  {entity.metadata?.date && (
                    <div className="text-xs text-gray-500">{entity.metadata.date}</div>
                  )}
                  {entity.voiceSummaryUrl && (
                    <button 
                      onClick={() => {
                        setSelectedEntity(entity.id)
                        setPlayModalOpen(true)
                      }}
                      className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
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
                <div key={entity.id} className="bg-white rounded-2xl p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">{entity.title}</div>
                  <button 
                    onClick={() => {
                      if (entity.messageId) {
                        router.push(`/app/thread/${threadId}?msg=${entity.messageId}`)
                      }
                    }}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-700"
                  >
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
                <div key={entity.id} className="bg-white rounded-2xl p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900 mb-1">{entity.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(entity.updatedAt))}
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
                <div key={entity.id} className="bg-white rounded-2xl p-2 border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">{entity.title}</div>
                  {entity.voiceSummaryUrl && (
                    <button 
                      onClick={() => {
                        setSelectedEntity(entity.id)
                        setPlayModalOpen(true)
                      }}
                      className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
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

      <Modal
        isOpen={playModalOpen}
        onClose={() => setPlayModalOpen(false)}
        title="Voice Summary"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Playing voice summary...
          </p>
          <div className="flex items-center justify-center py-4">
            <button className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
              <Play className="w-6 h-6 ml-1" />
            </button>
          </div>
          <button
            onClick={() => setPlayModalOpen(false)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

