'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { HeroSection } from '@/components/home/HeroSection'
import { ExampleSnippet } from '@/components/home/ExampleSnippet'
import { InteractiveDemo } from '@/components/home/InteractiveDemo'
import { ValueGrid } from '@/components/home/ValueGrid'
import { Footer as HomeFooter } from '@/components/home/Footer'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-medium text-gray-900">
            WEAVE
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/app/inbox" className="hover:text-gray-900 transition-colors">
              Inbox
            </Link>
            <Link href="/app/library" className="hover:text-gray-900 transition-colors">
              Library
            </Link>
            <Link href="/app/search" className="hover:text-gray-900 transition-colors">
              Search
            </Link>
            <Link href="/app/activity" className="hover:text-gray-900 transition-colors">
              Activity
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-gray-600">{session.user?.name || session.user?.email}</span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:text-gray-900 px-4 py-2"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link href="/auth">
                  <Button className="bg-blue-600 rounded-2xl text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <HeroSection />

      <ExampleSnippet />

      <InteractiveDemo />

      <ValueGrid />

      <HomeFooter />
    </div>
  )
}
