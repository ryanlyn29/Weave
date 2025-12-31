'use client'

import { useState } from 'react'
import { ConversationList } from '@/components/inbox/ConversationList'
import { ContextPreview } from '@/components/inbox/ContextPreview'
import { mockThreads } from '@/lib/mockData'

export default function InboxPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'attention' | 'unresolved' | 'custom'>('recent')

  return (
    <div className="flex h-full">
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Conversations</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-bubble px-2 py-1 bg-white"
            >
              <option value="recent">Recent</option>
              <option value="attention">Needs attention</option>
              <option value="unresolved">Unresolved first</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        <ConversationList
          threads={mockThreads}
          selectedThread={selectedThread}
          onSelectThread={setSelectedThread}
        />
      </div>
      <div className="flex-1 bg-gray-50">
        {selectedThread ? (
          <ContextPreview threadId={selectedThread} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            Select a conversation to view context
          </div>
        )}
      </div>
    </div>
  )
}

