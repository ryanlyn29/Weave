'use client'

import { useState } from 'react'
import { MessageSquare, Mic, Plus } from 'lucide-react'

export function BottomBar() {
  const [isComposing, setIsComposing] = useState(false)

  return (
    <div className="h-16 bg-white border-t border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsComposing(!isComposing)}
          className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-bubble text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-bubble text-sm font-medium hover:bg-gray-50 transition-colors">
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">Voice</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-bubble text-sm font-medium hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add to Library</span>
        </button>
      </div>
    </div>
  )
}

