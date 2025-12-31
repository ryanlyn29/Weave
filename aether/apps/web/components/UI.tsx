'use client'

import { useState } from 'react'
import { useAetherStore } from '@/lib/store'
import { GenerateAssetButton } from './GenerateAssetButton'

export function UI() {
  const isConnected = useAetherStore((state) => state.isConnected)
  const users = useAetherStore((state) => state.users)
  const assets = useAetherStore((state) => state.assets)
  const currentUser = useAetherStore((state) => state.currentUser)

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* Left Panel - Stats */}
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white pointer-events-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Users: {users.size} | Assets: {assets.size}
            </div>
            {currentUser && (
              <div className="text-xs text-gray-400">
                Position: ({currentUser.position.x.toFixed(1)},{' '}
                {currentUser.position.y.toFixed(1)},{' '}
                {currentUser.position.z.toFixed(1)})
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Actions */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <GenerateAssetButton />
        </div>
      </div>
    </div>
  )
}


