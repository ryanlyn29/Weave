'use client'

import { useState } from 'react'
import { ConversationList } from '@/components/weave/inbox/ConversationList'
import { ContextPreview } from '@/components/weave/inbox/ContextPreview'
import { api, Thread } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { Dropdown } from '@/components/ui/Dropdown'
import { ConversationSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Inbox, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

type LoadingState = 'loading' | 'success' | 'error' | 'empty'

export default function InboxPage() {
  const { authReady, user } = useAuth()
  const router = useRouter()
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'attention' | 'unresolved' | 'custom'>('recent')
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeMessage, setComposeMessage] = useState('')
  const [composeLoading, setComposeLoading] = useState(false)
  const [isGroupChat, setIsGroupChat] = useState(false)

  // Use SWR for data fetching with automatic revalidation
  const sortParam = sortBy === 'recent' ? undefined : sortBy
  const { data: threads = [], error, isLoading, mutate } = useSWR<Thread[]>(
    authReady && user ? `/v1/threads${sortParam ? `?sort=${sortParam}` : ''}` : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  // Determine state based on SWR state
  const state: LoadingState = !authReady || !user
    ? 'loading'
    : isLoading
    ? 'loading'
    : error
    ? 'error'
    : threads.length === 0
    ? 'empty'
    : 'success'

  const sortOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'attention', label: 'Needs attention' },
    { value: 'unresolved', label: 'Unresolved first' },
    { value: 'custom', label: 'Custom' },
  ]

  const handleCompose = async () => {
    if (!composeMessage.trim()) {
      return
    }

    setComposeLoading(true)
    try {
      const result = await api.createThread({
        content: composeMessage,
        isGroupChat: isGroupChat,
        participantIds: isGroupChat ? [] : undefined,
      })

      if (result && result.updatedThread) {
        // Refresh threads list using SWR mutate
        mutate()
        setComposeOpen(false)
        setComposeMessage('')
        setIsGroupChat(false)
        
        // Navigate to the newly created thread
        router.push(`/app/thread/${result.updatedThread.id}`)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      alert('Failed to create conversation. Please try again.')
    } finally {
      setComposeLoading(false)
    }
  }

  // Threads are already sorted by backend
  const sortedThreads = threads

  return (
    <>
      <div className="flex h-full">
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Conversations</h3>
              <button
                onClick={() => setComposeOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Compose</span>
              </button>
            </div>
            {state === 'success' && (
              <Dropdown
                value={sortBy}
                options={sortOptions}
                onChange={(value) => setSortBy(value as any)}
                className="w-40 mt-2"
              />
            )}
          </div>
        {state === 'loading' && (
          <div className="flex-1 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        )}
        {state === 'error' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <ErrorState
              message="Failed to load conversations. Please check your connection."
              onRetry={() => mutate()}
            />
          </div>
        )}
        {state === 'empty' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <EmptyState
              icon={Inbox}
              title="No conversations yet"
              description="Start a conversation or wait for someone to message you. Your conversations will appear here."
            />
          </div>
        )}
        {state === 'success' && (
          <ConversationList
            threads={sortedThreads}
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
          />
        )}
      </div>
      <div className="flex-1 bg-gray-50">
        {selectedThread ? (
          <ContextPreview threadId={selectedThread} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Select a conversation</p>
              <p className="text-xs text-gray-400">Click a conversation to view its context and entities</p>
            </div>
          </div>
        )}
      </div>
      
    </div>

    {/* Compose Modal */}
    <Modal
      isOpen={composeOpen}
      onClose={() => {
        setComposeOpen(false)
        setComposeMessage('')
        setIsGroupChat(false)
      }}
      title="New Conversation"
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGroupChat}
                onChange={(e) => setIsGroupChat(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Group chat</span>
            </label>
          </div>
          <textarea
            value={composeMessage}
            onChange={(e) => setComposeMessage(e.target.value)}
            placeholder={isGroupChat ? "Type your message to start a new group conversation..." : "Type your message to start a new conversation..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
          />
          <p className="mt-2 text-xs text-gray-500">
            {isGroupChat ? "Start a new group conversation by sending your first message." : "Start a new conversation by sending your first message."}
          </p>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCompose}
            disabled={!composeMessage.trim() || composeLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {composeLoading ? 'Sending...' : 'Send'}
          </button>
          <button
            onClick={() => {
              setComposeOpen(false)
              setComposeMessage('')
              setIsGroupChat(false)
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  </>
  )
}
