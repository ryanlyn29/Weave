'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, EntityRelationship, ApiError } from '@/lib/api-client'
import { Link, X, Plus } from 'lucide-react'

interface EntityRelationsProps {
  entityId: string
}

export function EntityRelations({ entityId }: EntityRelationsProps) {
  const router = useRouter()
  const [relationships, setRelationships] = useState<EntityRelationship[]>([])
  const [loading, setLoading] = useState(true)
  const [showLinkModal, setShowLinkModal] = useState(false)

  useEffect(() => {
    const loadRelationships = async () => {
      try {
        setLoading(true)
        const data = await api.getEntityRelationships(entityId)
        if (data) {
          setRelationships(data)
        }
      } catch (error) {
        console.error('Error loading relationships:', error)
      } finally {
        setLoading(false)
      }
    }

    if (entityId) {
      loadRelationships()
    }
  }, [entityId])

  const handleDeleteLink = async (rel: EntityRelationship) => {
    try {
      await api.deleteEntityLink(rel.sourceEntityId, rel.targetEntityId, rel.linkType)
      setRelationships(prev => prev.filter(r => r.id !== rel.id))
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Relations</h3>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Relations</h3>
        <button
          onClick={() => setShowLinkModal(true)}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Link to another entity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {relationships.length === 0 ? (
        <p className="text-sm text-gray-500">No relationships yet</p>
      ) : (
        <div className="space-y-2">
          {relationships.map((rel) => {
            const relatedEntity = rel.sourceEntityId === entityId ? rel.targetEntity : rel.sourceEntity
            const isOutgoing = rel.sourceEntityId === entityId

            return (
              <div
                key={rel.id}
                className="flex items-start justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {rel.linkType.toLowerCase().replace('_', ' ')} {isOutgoing ? '→' : '←'}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/app/entity/${relatedEntity.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-700 truncate block"
                  >
                    {relatedEntity.title}
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteLink(rel)}
                  className="p-1 text-gray-400 hover:text-red-600 ml-2"
                  title="Remove link"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showLinkModal && (
        <LinkEntityModal
          entityId={entityId}
          onClose={() => setShowLinkModal(false)}
          onLinkCreated={(rel) => {
            setRelationships(prev => [...prev, rel])
            setShowLinkModal(false)
          }}
        />
      )}
    </div>
  )
}

function LinkEntityModal({
  entityId,
  onClose,
  onLinkCreated,
}: {
  entityId: string
  onClose: () => void
  onLinkCreated: (rel: EntityRelationship) => void
}) {
  // Simplified modal - in production, would include entity search/selection
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Link Entity</h3>
        <p className="text-sm text-gray-600 mb-4">
          Entity linking UI - Search and select entity to link (implementation needed)
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
