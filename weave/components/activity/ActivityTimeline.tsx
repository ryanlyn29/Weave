'use client'

import { ActivityItem } from '@/lib/types'

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
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Clock, MessageSquare } from 'lucide-react'

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'decision_made':
        return <CheckCircle2 className="w-4 h-4 text-success" />
      case 'item_resolved':
        return <CheckCircle2 className="w-4 h-4 text-success" />
      case 'memory_resurfaced':
        return <MessageSquare className="w-4 h-4 text-primary-600" />
      case 'nudge_sent':
        return <AlertCircle className="w-4 h-4 text-warning" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'decision_made':
        return 'Decision Made'
      case 'item_resolved':
        return 'Item Resolved'
      case 'memory_resurfaced':
        return 'Memory Resurfaced'
      case 'nudge_sent':
        return 'Nudge Sent'
      default:
        return type
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        No activity found
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-bubble-lg p-4 border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">
                    {getTypeLabel(activity.type)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-2">{activity.description}</p>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/app/thread/${activity.threadId}${activity.messageId ? `?msg=${activity.messageId}` : ''}`}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    View thread →
                  </Link>
                  {activity.entityId && (
                    <Link
                      href={`/app/library?entity=${activity.entityId}`}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View entity →
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {activity.importance >= 0.8 ? 'High' : activity.importance >= 0.5 ? 'Medium' : 'Low'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

