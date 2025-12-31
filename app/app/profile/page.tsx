'use client'

import { useState, useEffect } from 'react'
import { ProfilePanels } from '@/components/weave/profile/ProfilePanels'
import { api, User, ApiError } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorState } from '@/components/ui/ErrorState'

export default function ProfilePage() {
  const { authReady, user: authUser } = useAuth()
  const isAuthenticated = !!authUser
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      // Wait for auth to be ready
      if (!authReady) {
        return
      }

      // Only load if authenticated
      if (!isAuthenticated) {
        setUser(null)
        setError(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const currentUser = await api.getCurrentUser()
        
        // Handle null response
        if (!currentUser) {
          setUser(null)
          setError(null)
        } else {
          setUser(currentUser)
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Failed to load profile')
        }
        console.error('Error loading user profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      loadUser()
    }
  }, [authReady, isAuthenticated])

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <LoadingSkeleton lines={10} />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            message={error || 'Failed to load profile'}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    // Refresh page to update user data everywhere
    window.location.reload()
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <ProfilePanels user={user} onUserUpdate={handleUserUpdate} />
      </div>
    </div>
  )
}

