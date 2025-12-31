'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CheckCircle2, Clock, Bell, X } from 'lucide-react'
import { mockThreads } from '@/lib/weaveMockData'
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs'

const pageTitles: Record<string, string> = {
  '/app/inbox': 'Inbox',
  '/app/library': 'Library',
  '/app/search': 'Search',
  '/app/activity': 'Activity',
  '/app/profile': 'Profile',
  '/app/settings': 'Settings',
}

interface Notification {
  id: string
  type: 'nudge' | 'memory' | 'entity_update'
  title: string
  message: string
  threadId?: string
  entityId?: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'nudge',
    title: 'Unresolved nudge',
    message: 'Weekend hiking trip needs confirmation',
    threadId: 'thread1',
    timestamp: '2024-01-15T10:00:00Z',
    read: false,
  },
  {
    id: 'notif2',
    type: 'memory',
    title: 'Memory resurfaced',
    message: 'Previous discussion about React architecture',
    threadId: 'thread2',
    timestamp: '2024-01-15T09:30:00Z',
    read: false,
  },
  {
    id: 'notif3',
    type: 'entity_update',
    title: 'Entity updated',
    message: 'Decision status changed to confirmed',
    threadId: 'thread2',
    entityId: 'entity3',
    timestamp: '2024-01-15T08:00:00Z',
    read: true,
  },
]

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  
  // Extract thread ID from pathname if on thread page
  const threadId = pathname?.startsWith('/app/thread/') 
    ? pathname.split('/app/thread/')[1]?.split('?')[0]
    : null
  
  const thread = threadId ? mockThreads.find(t => t.id === threadId) : null
  const title = pathname?.startsWith('/app/thread/') 
    ? (thread?.title || 'Thread')
    : pageTitles[pathname || ''] || 'WEAVE'
  
  const isSynced = true
  const lastUpdate = '2 min ago'
  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    if (notification.threadId) {
      router.push(`/app/thread/${notification.threadId}`)
      setNotificationsOpen(false)
    }
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative">
        {/* Page title on the left */}
        <div className="flex items-center gap-4">
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
        </div>
        
        {/* Status text and notification icon on the right */}
        <div className="flex items-center gap-4">
          {/* Subtle status text */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isSynced ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Synced</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-yellow-500" />
                <span>Syncing...</span>
              </>
            )}
            <span className="text-gray-400">·</span>
            <span className="text-gray-400">Updated {lastUpdate}</span>
          </div>
          
          {/* Notification icon on far right */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Notification Drawer */}
      {notificationsOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="absolute top-14 right-6 w-80 bg-white border border-gray-200 rounded-2xl z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs font-medium text-gray-900">
                          {notification.title}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

