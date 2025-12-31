'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Inbox, 
  Library, 
  Search, 
  Activity, 
  User,
  Settings,
  ChevronDown,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useRef, useEffect } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

const navItems = [
  { href: '/app/inbox', label: 'Inbox', icon: Inbox, count: 3 },
  { href: '/app/library', label: 'Library', icon: Library, count: 12 },
  { href: '/app/search', label: 'Search', icon: Search },
  { href: '/app/activity', label: 'Activity', icon: Activity, count: 5 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen])

  const handleSignOut = async () => {
    try {
      const auth = await getFirebaseAuth()
      await firebaseSignOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col relative">
      {/* Logo at top */}
      <div className="p-4 ">
        <Link href="/" className="block">
          <h1 className="text-lg font-medium text-gray-900">WEAVE</h1>
        </Link>
      </div>
      
      {/* Primary nav items */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
        
        {/* Settings button - moved higher in nav */}
        <Link
          href="/app/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 transition-colors mt-1 ${
            pathname === '/app/settings' || pathname?.startsWith('/app/settings/')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">Settings</span>
        </Link>
        
        {/* Profile button */}
        <Link
          href="/app/profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 transition-colors ${
            pathname === '/app/profile' || pathname?.startsWith('/app/profile/')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">Profile</span>
        </Link>
      </nav>
      
      {/* User profile section at bottom - with dropdown */}
      <div className="p-4 border-t border-gray-200 relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-full flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors -m-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">{userName}</div>
            <div className="text-xs text-gray-500 truncate">{userEmail}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown menu */}
        {profileMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm z-50">
            {/* Menu items */}
            <Link
              href="/app/settings"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </Link>
            <Link
              href="/app/help"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Help and support</span>
            </Link>
            
            {/* User info section */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{userName}</div>
                  <div className="text-xs text-gray-500 truncate">{userEmail}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={() => {
                setProfileMenuOpen(false)
                handleSignOut()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

