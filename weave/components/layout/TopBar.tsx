'use client'

import { usePathname } from 'next/navigation'
import { CheckCircle2, Clock } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/app/inbox': 'Inbox',
  '/app/library': 'Library',
  '/app/search': 'Search',
  '/app/activity': 'Activity',
  '/app/profile': 'Profile',
  '/app/settings': 'Settings',
}

export function TopBar() {
  const pathname = usePathname()
  const title = pathname?.startsWith('/app/thread/') 
    ? 'Thread' 
    : pageTitles[pathname || ''] || 'WEAVE'
  
  const isSynced = true
  const lastUpdate = '2 min ago'

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-base font-medium text-gray-900">{title}</h2>
        {pathname?.startsWith('/app/thread/') && (
          <span className="text-xs text-gray-500">Weekend Plans</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isSynced ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-success" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-warning" />
              <span>Syncing...</span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-400">Updated {lastUpdate}</div>
      </div>
    </header>
  )
}

