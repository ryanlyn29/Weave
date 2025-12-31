'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/weave/layout/Sidebar'
import { TopBar } from '@/components/weave/layout/TopBar'
import { BackendOfflineBanner } from '@/components/ui/BackendOfflineBanner'
import { FirebaseConfigError } from '@/components/ui/FirebaseConfigError'
import { AppGuard } from '@/components/auth/AppGuard'
import { CommandMenu } from '@/components/ui/CommandMenu'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isOnboarding = pathname === '/app/onboarding'
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)

  // Keyboard shortcut: Cmd+K or Ctrl+K to open command menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandMenuOpen(prev => !prev)
      }
      if (e.key === 'Escape' && commandMenuOpen) {
        setCommandMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandMenuOpen])

  // Onboarding page doesn't use the persistent shell
  if (isOnboarding) {
    return <AppGuard>{children}</AppGuard>
  }

  return (
    <AppGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BackendOfflineBanner />
          <FirebaseConfigError />
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      </div>
    </AppGuard>
  )
}

