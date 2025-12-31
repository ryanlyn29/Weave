'use client'

import { useState } from 'react'
import { mockThreads, mockEntities } from '@/lib/weaveMockData'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'

interface ContextPreviewProps {
  threadId: string
}

export function ContextPreview({ threadId }: ContextPreviewProps) {
  const [resolveModalOpen, setResolveModalOpen] = useState(false)
  const [nudgeModalOpen, setNudgeModalOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  
  const thread = mockThreads.find(t => t.id === threadId)
  if (!thread) return null

  const threadEntities = mockEntities.filter(e => e.threadId === threadId)
  const activePlans = threadEntities.filter(e => e.type === 'plan' && e.status !== 'cancelled')
  const openQuestions = threadEntities.filter(e => e.status === 'proposed')
  const recentDecisions = threadEntities.filter(e => e.type === 'decision' && e.status === 'confirmed')

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Key Entities</h3>
          <div className="space-y-3">
            {threadEntities.slice(0, 5).map((entity) => (
              <div key={entity.id} className="bg-white rounded-2xl p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{entity.type}</div>
                    <div className="text-sm font-medium text-gray-900">{entity.title}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    entity.status === 'confirmed' || entity.status === 'done' 
                      ? 'bg-green-100 text-green-700' 
                      : entity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
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
                <div key={entity.id} className="bg-white rounded-2xl p-3 border border-gray-200">
                  <div className="text-sm text-gray-900">{entity.title}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => {
                        setSelectedEntity(entity.id)
                        setResolveModalOpen(true)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
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
              <div key={entity.id} className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{entity.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Needs attention</div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEntity(entity.id)
                      setNudgeModalOpen(true)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
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
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Open full thread →
          </Link>
        </div>
      </div>

      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Decision"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Mark this decision as resolved? This will update the status and notify participants.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Handle resolve action
                setResolveModalOpen(false)
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
            >
              Resolve
            </button>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={nudgeModalOpen}
        onClose={() => setNudgeModalOpen(false)}
        title="Send Nudge"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send a reminder to participants about this pending item?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Handle nudge action
                setNudgeModalOpen(false)
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
            >
              Send Nudge
            </button>
            <button
              onClick={() => setNudgeModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

