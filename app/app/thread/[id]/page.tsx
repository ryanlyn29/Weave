'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { MessageList } from '@/components/weave/thread/MessageList'
import { ContextRail } from '@/components/weave/thread/ContextRail'
import { Composer } from '@/components/weave/thread/Composer'
import { api, Thread, Message, ApiError } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { useSSE } from '@/lib/sse-context'
import { CollapsibleSidebar } from '@/components/weave/layout/CollapsibleSidebar'
import { MessageSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { MessageSquare } from 'lucide-react'

type LoadingState = 'loading' | 'success' | 'error' | 'not-found'

export default function ThreadPage() {
  const { authReady, user } = useAuth()
  const { subscribe } = useSSE()
  const isAuthenticated = !!user
  const params = useParams()
  const id = params.id as string
  const [state, setState] = useState<LoadingState>('loading')
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const loadThread = async () => {
      if (!id) return

      // Wait for auth to be ready
      if (!authReady) {
        return
      }

      // Only load if authenticated
      if (!isAuthenticated) {
        setState('not-found')
        return
      }

      try {
        setState('loading')
        
        // Load thread and messages in parallel
        const [threadData, messagesData] = await Promise.all([
          api.getThread(id),
          api.getMessages(id)
        ])
        
        // Handle null responses
        if (!threadData || !messagesData) {
          setState('not-found')
          return
        }
        
        setThread(threadData)
        setMessages(messagesData)
        setState('success')
        
        // Mark thread as read
        try {
          await api.markThreadRead(id)
        } catch (err) {
          console.error('Failed to mark thread as read:', err)
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setState('not-found')
        } else {
          console.error('Error loading thread:', error)
          setState('error')
        }
      }
    }

    if (id && typeof window !== 'undefined') {
      loadThread()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authReady, isAuthenticated])

  // Subscribe to SSE events for real-time message updates
  useEffect(() => {
    if (!id || !isAuthenticated) return

    // Subscribe to message_created events
    const unsubscribeMessage = subscribe('message_created', (eventType, data) => {
      // Only handle messages for this thread
      if (data.threadId === id && data.message) {
        const newMessage = data.message as Message
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          if (prev.some(m => m.id === newMessage.id)) {
            return prev
          }
          // Add new message and sort by timestamp
          return [...prev, newMessage].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        })
      }
    })

    // Subscribe to thread_updated events
    const unsubscribeThread = subscribe('thread_updated', (eventType, data) => {
      // Only handle updates for this thread
      if (data.threadId === id && data.thread) {
        setThread(data.thread as Thread)
      }
    })

    // Subscribe to entity_extracted events
    const unsubscribeEntity = subscribe('entity_extracted', (eventType, data) => {
      // Only handle entities for this thread
      if (data.threadId === id) {
        // Reload thread to refresh entity list in context rail
        reloadThread()
      }
    })

    // Cleanup subscriptions
    return () => {
      unsubscribeMessage()
      unsubscribeThread()
      unsubscribeEntity()
    }
  }, [id, isAuthenticated, subscribe])

  const reloadThread = async () => {
    if (!id || !isAuthenticated) return

    try {
      const [threadData, messagesData] = await Promise.all([
        api.getThread(id),
        api.getMessages(id)
      ])
      
      if (threadData && messagesData) {
        setThread(threadData)
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Error reloading thread:', error)
    }
  }

  if (state === 'loading') {
    return (
      <div className="flex h-full">
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="w-80 border-l border-gray-200 bg-white p-4">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState
          message="Failed to load thread. Please check your connection."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (state === 'not-found' || !thread) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="Thread not found"
          description="This thread may have been deleted or you don't have access to it."
        />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full">
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Start the conversation by sending the first message."
            />
          </div>
          <div className="p-4 border-t border-gray-200 bg-white">
            <Composer threadId={id} onMessageSent={reloadThread} />
          </div>
        </div>
        <div className="w-80 border-l border-gray-200 bg-white">
          <ContextRail threadId={id} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} threadId={id} />
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <Composer 
            threadId={id}
            onMessageSent={reloadThread}
          />
        </div>
      </div>
      <div className="relative">
        <CollapsibleSidebar
          storageKey="thread-context-rail"
          position="right"
          width={320}
        >
          <ContextRail threadId={id} />
        </CollapsibleSidebar>
      </div>
    </div>
  )
}

