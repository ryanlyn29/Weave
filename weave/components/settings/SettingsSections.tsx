'use client'

import { useState } from 'react'

export function SettingsSections() {
  const [notifications, setNotifications] = useState({
    plans: true,
    decisions: true,
    promises: true,
    memories: false,
  })

  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    style: 'professional' as 'professional' | 'casual' | 'warm',
    playbackSpeed: 1.0,
  })

  const [mlSettings, setMlSettings] = useState({
    importanceSensitivity: 0.7,
    resurfacingFrequency: 'medium' as 'low' | 'medium' | 'high',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose which entity types trigger notifications
        </p>
        <div className="space-y-3">
          {(['plans', 'decisions', 'promises', 'memories'] as const).map((type) => (
            <label key={type} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">{type}</span>
              <input
                type="checkbox"
                checked={notifications[type]}
                onChange={(e) => setNotifications({ ...notifications, [type]: e.target.checked })}
                className="rounded border-gray-300"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Voice Playback Style</h3>
        <p className="text-xs text-gray-500 mb-4">
          Customize how ElevenLabs voices sound
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Voice enabled</span>
            <input
              type="checkbox"
              checked={voiceSettings.enabled}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, enabled: e.target.checked })}
              className="rounded border-gray-300"
            />
          </label>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Voice style</label>
            <select
              value={voiceSettings.style}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, style: e.target.value as any })}
              className="w-full text-sm border border-gray-300 rounded-bubble px-3 py-2 bg-white"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="warm">Warm</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Playback speed: {voiceSettings.playbackSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.playbackSpeed}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, playbackSpeed: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">ML Behavior Tuning</h3>
        <p className="text-xs text-gray-500 mb-4">
          Adjust how WEAVE extracts and surfaces information
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Importance sensitivity: {Math.round(mlSettings.importanceSensitivity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={mlSettings.importanceSensitivity}
              onChange={(e) => setMlSettings({ ...mlSettings, importanceSensitivity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Higher = more selective about what gets saved
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Resurfacing frequency</label>
            <select
              value={mlSettings.resurfacingFrequency}
              onChange={(e) => setMlSettings({ ...mlSettings, resurfacingFrequency: e.target.value as any })}
              className="w-full text-sm border border-gray-300 rounded-bubble px-3 py-2 bg-white"
            >
              <option value="low">Low - Only highly relevant</option>
              <option value="medium">Medium - Balanced</option>
              <option value="high">High - More proactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy & Retention</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-2">Data retention</p>
            <p className="text-xs text-gray-500 mb-3">
              Your data is stored securely and only accessible to your trusted groups
            </p>
            <button className="text-xs text-primary-600 hover:text-primary-700">
              View retention policy →
            </button>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="text-sm text-error hover:text-error/80">
              Delete all data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-bubble-lg p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Accessibility</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">High contrast mode</span>
            <input type="checkbox" className="rounded border-gray-300" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Reduced motion</span>
            <input type="checkbox" className="rounded border-gray-300" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Screen reader optimized</span>
            <input type="checkbox" checked className="rounded border-gray-300" />
          </label>
        </div>
      </div>
    </div>
  )
}

