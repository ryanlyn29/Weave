'use client'

import { ProfilePanels } from '@/components/profile/ProfilePanels'
import { mockUsers } from '@/lib/mockData'

export default function ProfilePage() {
  const currentUser = mockUsers[0] // In real app, get from auth

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <ProfilePanels user={currentUser} />
      </div>
    </div>
  )
}

