'use client'

import { mockEntities } from '@/lib/mockData'
import { Save, Library, CheckCircle2 } from 'lucide-react'

interface ActionChipsProps {
  entityId: string
  messageId: string
}

export function ActionChips({ entityId, messageId }: ActionChipsProps) {
  const entity = mockEntities.find(e => e.id === entityId)
  if (!entity) return null

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-bubble px-2 py-1 text-xs">
      <span className="text-gray-700">{entity.type}: {entity.title}</span>
      <div className="flex items-center gap-1 ml-2">
        <button className="p-0.5 hover:bg-gray-100 rounded" title="Save">
          <Save className="w-3 h-3 text-gray-500" />
        </button>
        <button className="p-0.5 hover:bg-gray-100 rounded" title="Add to Library">
          <Library className="w-3 h-3 text-gray-500" />
        </button>
        {entity.type === 'decision' && (
          <button className="p-0.5 hover:bg-gray-100 rounded" title="Mark as decision">
            <CheckCircle2 className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  )
}

