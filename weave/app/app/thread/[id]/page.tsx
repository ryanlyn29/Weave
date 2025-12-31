'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MessageList } from '@/components/thread/MessageList'
import { ContextRail } from '@/components/thread/ContextRail'
import { Composer } from '@/components/thread/Composer'
import { mockMessages, mockThreads } from '@/lib/mockData'

export default function ThreadPage() {
  const params = useParams()
  const id = params.id as string
  const thread = mockThreads.find(t => t.id === id)
  const messages = mockMessages[id] || []

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">
        Thread not found
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} threadId={id} />
        </div>
        <div className="border-t border-gray-200 p-4">
          <Composer threadId={id} />
        </div>
      </div>
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <ContextRail threadId={id} />
      </div>
    </div>
  )
}

