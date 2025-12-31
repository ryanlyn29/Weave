'use client'

import { mockThreads, mockEntities } from '@/lib/mockData'
import { Link } from 'next/link'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface ContextPreviewProps {
  threadId: string
}

export function ContextPreview({ threadId }: ContextPreviewProps) {
  const thread = mockThreads.find(t => t.id === threadId)
  if (!thread) return null

  const threadEntities = mockEntities.filter(e => e.threadId === threadId)
  const activePlans = threadEntities.filter(e => e.type === 'plan' && e.status !== 'cancelled')
  const openQuestions = threadEntities.filter(e => e.status === 'proposed')
  const recentDecisions = threadEntities.filter(e => e.type === 'decision' && e.status === 'confirmed')
  const linkedMemories = threadEntities.filter(e => e.type === 'memory')

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Key Entities</h3>
          <div className="space-y-3">
            {threadEntities.slice(0, 5).map((entity) => (
              <div key={entity.id} className="bg-white rounded-bubble p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{entity.type}</div>
                    <div className="text-sm font-medium text-gray-900">{entity.title}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    entity.status === 'confirmed' || entity.status === 'done' 
                      ? 'bg-success/20 text-success' 
                      : entity.status === 'pending'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {entity.status}
                  </span>
                </div>
                {entity.metadata?.date && (
                  <div className="text-xs text-gray-500 mt-2">
                    {entity.metadata.date} {entity.metadata.time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Open Decisions</h3>
          <div className="space-y-2">
            {openQuestions.length > 0 ? (
              openQuestions.map((entity) => (
                <div key={entity.id} className="bg-white rounded-bubble p-3 border border-gray-200">
                  <div className="text-sm text-gray-900">{entity.title}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      Resolve
                    </button>
                    <Link href={`/app/thread/${threadId}?entity=${entity.id}`} className="text-xs text-gray-500 hover:text-gray-700">
                      Jump to message
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No open decisions</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Pending Nudges</h3>
          <div className="space-y-2">
            {threadEntities.filter(e => e.status === 'pending').map((entity) => (
              <div key={entity.id} className="bg-warning/10 rounded-bubble p-3 border border-warning/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{entity.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Needs attention</div>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    Nudge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Link
            href={`/app/thread/${threadId}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Open full thread →
          </Link>
        </div>
      </div>
    </div>
  )
}

