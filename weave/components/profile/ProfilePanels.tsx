'use client'

import { User } from '@/lib/mockData'
import Link from 'next/link'
import { Settings, Download } from 'lucide-react'

interface ProfilePanelsProps {
  user: User
}

export function ProfilePanels({ user }: ProfilePanelsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Link
            href="/app/settings"
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-bubble text-sm hover:bg-gray-200"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
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

        <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
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

        <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Memory Reliability</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Accuracy score</span>
                <span className="text-sm font-medium text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              Based on entity extraction accuracy and recall precision
            </div>
          </div>
        </div>

        <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Trusted Groups</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Family</div>
            <div className="text-sm text-gray-700">Work Team</div>
            <div className="text-sm text-gray-700">Close Friends</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
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
            <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <Download className="w-4 h-4" />
              Export all data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

