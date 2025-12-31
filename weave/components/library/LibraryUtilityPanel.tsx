'use client'

import { ExtractedEntity } from '@/lib/mockData'
import { Play, Download, Archive } from 'lucide-react'

interface LibraryUtilityPanelProps {
  entities: ExtractedEntity[]
}

export function LibraryUtilityPanel({ entities }: LibraryUtilityPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Bulk Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-bubble text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Archive className="w-3 h-3" />
            Resolve selected
          </button>
          <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-bubble text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Archive className="w-3 h-3" />
            Archive
          </button>
          <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-bubble text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Voice Recall</h3>
        <button className="w-full text-left px-3 py-2 bg-primary-50 rounded-bubble text-xs text-primary-700 hover:bg-primary-100 flex items-center gap-2">
          <Play className="w-3 h-3" />
          Play batch summary
        </button>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {entities.length} items shown. All items are bidirectionally linked to their source chat messages.
        </p>
      </div>
    </div>
  )
}

