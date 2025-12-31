'use client'

import { useState } from 'react'
import { User } from '@/lib/api-client'
import Link from 'next/link'
import { Settings, Download, Edit2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { EditProfileModal } from './EditProfileModal'

interface ProfilePanelsProps {
  user: User
  onUserUpdate?: (user: User) => void
}

export function ProfilePanels({ user: initialUser, onUserUpdate }: ProfilePanelsProps) {
  const [user, setUser] = useState(initialUser)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    onUserUpdate?.(updatedUser)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm hover:bg-gray-200"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <Link
              href="/app/settings"
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUserUpdate}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Contribution Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages sent</span>
              <span className="text-sm font-medium text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entities created</span>
              <span className="text-sm font-medium text-gray-900">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Decisions made</span>
              <span className="text-sm font-medium text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Promises kept</span>
              <span className="text-sm font-medium text-gray-900">156</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Voice Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Voice messages</span>
              <span className="text-sm font-medium text-gray-900">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Voice briefings played</span>
              <span className="text-sm font-medium text-gray-900">128</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Voice capture used</span>
              <span className="text-sm font-medium text-gray-900">67</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Voice enabled: {user.voiceEnabled ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Memory Reliability</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Accuracy score</span>
                <span className="text-sm font-medium text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              Based on entity extraction accuracy and recall precision
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Trusted Groups</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Family</div>
            <div className="text-sm text-gray-700">Work Team</div>
            <div className="text-sm text-gray-700">Close Friends</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Data Footprint</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total messages</span>
            <span className="text-sm font-medium text-gray-900">1,247</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Entities stored</span>
            <span className="text-sm font-medium text-gray-900">89</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Storage used</span>
            <span className="text-sm font-medium text-gray-900">12.4 MB</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4" />
              Export all data
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Export all your WEAVE data including messages, entities, and settings?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Handle export
                setExportModalOpen(false)
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
            >
              Export
            </button>
            <button
              onClick={() => setExportModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

