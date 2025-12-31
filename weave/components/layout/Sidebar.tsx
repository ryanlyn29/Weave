'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Inbox, 
  Library, 
  Search, 
  Activity, 
  User 
} from 'lucide-react'

const navItems = [
  { href: '/app/inbox', label: 'Inbox', icon: Inbox, count: 3 },
  { href: '/app/library', label: 'Library', icon: Library, count: 12 },
  { href: '/app/search', label: 'Search', icon: Search },
  { href: '/app/activity', label: 'Activity', icon: Activity, count: 5 },
  { href: '/app/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-gray-900">WEAVE</h1>
      </div>
      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-bubble mb-1 transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/app/settings"
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Settings
        </Link>
      </div>
    </aside>
  )
}

