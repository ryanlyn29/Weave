'use client'

import { useRouter } from 'next/navigation'
import { Thread } from '@/lib/weaveTypes'
import { mockUsers } from '@/lib/weaveMockData'

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

interface ConversationListProps {
  threads: Thread[]
  selectedThread: string | null
  onSelectThread: (threadId: string) => void
}

export function ConversationList({ threads, selectedThread, onSelectThread }: ConversationListProps) {
  const router = useRouter()

  const getParticipants = (thread: Thread) => {
    return thread.participants
      .map(id => mockUsers.find(u => u.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const handleThreadClick = (threadId: string, e: React.MouseEvent) => {
    // If double-click or Ctrl/Cmd+click, navigate to full thread
    if (e.detail === 2 || e.ctrlKey || e.metaKey) {
      router.push(`/app/thread/${threadId}`)
    } else {
      // Single click selects for preview
      onSelectThread(threadId)
    }
  }

  const getImportanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-red-500'
    if (score >= 0.6) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {threads.map((thread) => {
        const isSelected = selectedThread === thread.id
        const participants = getParticipants(thread)
        const timeAgo = formatDistanceToNow(new Date(thread.lastActivity))

        return (
          <button
            key={thread.id}
            onClick={(e) => handleThreadClick(thread.id, e)}
            className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                  {thread.title || participants}
                </div>
                <div className="text-xs text-gray-500 line-clamp-1">
                  {thread.mlSummary || 'No summary available'}
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${getImportanceColor(thread.importanceScore)}`} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {thread.unresolvedCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                    {thread.unresolvedCount} unresolved
                  </span>
                )}
                {thread.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {thread.unreadCount} new
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

