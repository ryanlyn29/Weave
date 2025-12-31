'use client'

import { useState, useEffect } from 'react'
import { api, ExtractedEntity, ApiError } from '@/lib/api-client'
import { CheckCircle2, Library, MessageSquare, Send, ExternalLink } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import { EntityBreadcrumbs } from './EntityBreadcrumbs'

interface ActionChipsProps {
  entityId: string
  messageId: string
}

export function ActionChips({ entityId, messageId }: ActionChipsProps) {
  const router = useRouter()
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [libraryModalOpen, setLibraryModalOpen] = useState(false)
  const [decisionModalOpen, setDecisionModalOpen] = useState(false)
  const [nudgeModalOpen, setNudgeModalOpen] = useState(false)
  const [entity, setEntity] = useState<ExtractedEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const loadEntity = async () => {
      try {
        setLoading(true)
        const entityData = await api.getEntity(entityId)
        setEntity(entityData)
      } catch (error) {
        console.error('Error loading entity:', error)
      } finally {
        setLoading(false)
      }
    }

    if (entityId) {
      loadEntity()
    }
  }, [entityId])

  if (loading || !entity) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-2xl text-xs">
        <span className="text-blue-700">Loading...</span>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      setActionLoading(true)
      await api.saveEntity(entityId)
      setSaveModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving entity:', error)
      if (error instanceof ApiError) {
        alert(`Failed to save entity: ${error.message}`)
      } else {
        alert('Failed to save entity. Please try again.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddToLibrary = async () => {
    try {
      setActionLoading(true)
      await api.addToLibrary(entityId)
      setLibraryModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error adding to library:', error)
      if (error instanceof ApiError) {
        alert(`Failed to add to library: ${error.message}`)
      } else {
        alert('Failed to add to library. Please try again.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkAsDecision = async () => {
    try {
      setActionLoading(true)
      await api.markAsDecision(entityId)
      setDecisionModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error marking as decision:', error)
      if (error instanceof ApiError) {
        alert(`Failed to mark as decision: ${error.message}`)
      } else {
        alert('Failed to mark as decision. Please try again.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleNudge = async () => {
    // Nudge functionality - could send notification or update
    try {
      setActionLoading(true)
      // For now, just update status to prompt action
      await api.updateEntityStatus(entityId, 'pending')
      setNudgeModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error nudging entity:', error)
      if (error instanceof ApiError) {
        alert(`Failed to nudge: ${error.message}`)
      } else {
        alert('Failed to nudge. Please try again.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-2xl text-xs">
        <span className="text-blue-700 font-medium">{entity.title}</span>
        <div className="flex items-center gap-1 ml-1">
          <button 
            onClick={() => setSaveModalOpen(true)}
            className="p-0.5 hover:bg-blue-100 rounded" 
            title="Save"
            disabled={actionLoading}
          >
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
          </button>
          <button 
            onClick={() => setLibraryModalOpen(true)}
            className="p-0.5 hover:bg-blue-100 rounded" 
            title="Add to Library"
            disabled={actionLoading}
          >
            <Library className="w-3 h-3 text-blue-600" />
          </button>
          <button 
            onClick={() => setDecisionModalOpen(true)}
            className="p-0.5 hover:bg-blue-100 rounded" 
            title="Mark decision"
            disabled={actionLoading || entity.type === 'decision'}
          >
            <MessageSquare className="w-3 h-3 text-blue-600" />
          </button>
          <button 
            onClick={() => setNudgeModalOpen(true)}
            className="p-0.5 hover:bg-blue-100 rounded" 
            title="Nudge"
            disabled={actionLoading}
          >
            <Send className="w-3 h-3 text-blue-600" />
          </button>
          <button
            onClick={() => router.push(`/app/entity/${entityId}`)}
            className="p-0.5 hover:bg-blue-100 rounded"
            title="View Entity"
          >
            <ExternalLink className="w-3 h-3 text-blue-600" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Entity"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Save "{entity.title}" for later reference?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setSaveModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        title="Add to Library"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add "{entity.title}" to your library for easy access?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAddToLibrary}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Adding...' : 'Add to Library'}
            </button>
            <button
              onClick={() => setLibraryModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title="Mark as Decision"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Mark "{entity.title}" as a decision? This will update its type and notify participants.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAsDecision}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Updating...' : 'Mark as Decision'}
            </button>
            <button
              onClick={() => setDecisionModalOpen(false)}
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
        title="Nudge"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send a reminder about "{entity.title}"? This will mark it as pending and notify relevant participants.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleNudge}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Sending...' : 'Send Nudge'}
            </button>
            <button
              onClick={() => setNudgeModalOpen(false)}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

