'use client'

import { Message, mockUsers } from '@/lib/mockData'

function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
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
import { ActionChips } from './ActionChips'
import { Play } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  threadId: string
}

export function MessageList({ messages, threadId }: MessageListProps) {
  const groupedMessages = messages.reduce((acc, msg) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && lastGroup[0].senderId === msg.senderId) {
      lastGroup.push(msg)
    } else {
      acc.push([msg])
    }
    return acc
  }, [] as Message[][])

  return (
    <div className="p-6 space-y-6">
      {groupedMessages.map((group, groupIdx) => {
        const sender = mockUsers.find(u => u.id === group[0].senderId)
        const isFirstInGroup = groupIdx === 0 || groupedMessages[groupIdx - 1][0].senderId !== group[0].senderId

        return (
          <div key={group[0].id} className="flex gap-3">
            {isFirstInGroup && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
            )}
            <div className="flex-1 min-w-0">
              {isFirstInGroup && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-900">{sender?.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(group[0].timestamp), { addSuffix: true })}
                </span>
                </div>
              )}
              <div className="space-y-2">
                {group.map((msg) => (
                  <div key={msg.id} className="group">
                    {msg.type === 'text' ? (
                      <div className="inline-block max-w-[80%]">
                        <div className="bg-gray-100 rounded-bubble-lg px-3 py-2 text-sm text-gray-900">
                          {msg.content}
                        </div>
                        {msg.entities && msg.entities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {msg.entities.map((entityId) => (
                              <ActionChips key={entityId} entityId={entityId} messageId={msg.id} />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="inline-block max-w-[80%]">
                        <button className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-bubble-lg px-3 py-2 text-sm text-primary-700 hover:bg-primary-100 transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Voice message</span>
                          {msg.waveform && (
                            <div className="flex items-center gap-0.5 ml-2">
                              {msg.waveform.map((amp, i) => (
                                <div
                                  key={i}
                                  className="w-0.5 bg-primary-600 rounded-full"
                                  style={{ height: `${amp * 16}px` }}
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

