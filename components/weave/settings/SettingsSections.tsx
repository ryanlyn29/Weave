'use client'

import { useState } from 'react'
import { Dropdown } from '@/components/ui/Dropdown'
import { Checkbox } from '@/components/ui/Checkbox'
import { Slider } from '@/components/ui/Slider'
import { Modal } from '@/components/ui/Modal'

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

  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: true,
  })

  const [mlSettings, setMlSettings] = useState({
    importanceSensitivity: 0.7,
    resurfacingFrequency: 'medium' as 'low' | 'medium' | 'high',
  })

  const [policyModalOpen, setPolicyModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose which entity types trigger notifications
        </p>
        <div className="space-y-3">
          {(['plans', 'decisions', 'promises', 'memories'] as const).map((type) => (
            <label key={type} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 capitalize">{type}</span>
              <Checkbox
                checked={notifications[type]}
                onChange={(checked) => setNotifications({ ...notifications, [type]: checked })}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Voice Playback Style</h3>
        <p className="text-xs text-gray-500 mb-4">
          Customize how ElevenLabs voices sound
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">Voice enabled</span>
            <Checkbox
              checked={voiceSettings.enabled}
              onChange={(checked) => setVoiceSettings({ ...voiceSettings, enabled: checked })}
            />
          </label>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Voice style</label>
            <Dropdown
              value={voiceSettings.style}
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'casual', label: 'Casual' },
                { value: 'warm', label: 'Warm' },
              ]}
              onChange={(value) => setVoiceSettings({ ...voiceSettings, style: value as any })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Playback speed: {voiceSettings.playbackSpeed.toFixed(2)}x
            </label>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={voiceSettings.playbackSpeed}
              onChange={(value) => setVoiceSettings({ ...voiceSettings, playbackSpeed: value })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">ML Behavior Tuning</h3>
        <p className="text-xs text-gray-500 mb-4">
          Adjust how WEAVE extracts and surfaces information
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Importance sensitivity: {Math.round(mlSettings.importanceSensitivity * 100)}%
            </label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={mlSettings.importanceSensitivity}
              onChange={(value) => setMlSettings({ ...mlSettings, importanceSensitivity: value })}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Higher = more selective about what gets saved
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Resurfacing frequency</label>
            <Dropdown
              value={mlSettings.resurfacingFrequency}
              options={[
                { value: 'low', label: 'Low - Only highly relevant' },
                { value: 'medium', label: 'Medium - Balanced' },
                { value: 'high', label: 'High - More proactive' },
              ]}
              onChange={(value) => setMlSettings({ ...mlSettings, resurfacingFrequency: value as any })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy & Retention</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-2">Data retention</p>
            <p className="text-xs text-gray-500 mb-3">
              Your data is stored securely and only accessible to your trusted groups
            </p>
            <button 
              onClick={() => setPolicyModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View retention policy →
            </button>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="text-sm text-red-600 hover:text-red-700">
              Delete all data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Accessibility</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">High contrast mode</span>
            <Checkbox 
              checked={accessibility.highContrast} 
              onChange={(checked) => setAccessibility({ ...accessibility, highContrast: checked })} 
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">Reduced motion</span>
            <Checkbox 
              checked={accessibility.reducedMotion} 
              onChange={(checked) => setAccessibility({ ...accessibility, reducedMotion: checked })} 
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">Screen reader optimized</span>
            <Checkbox 
              checked={accessibility.screenReaderOptimized} 
              onChange={(checked) => setAccessibility({ ...accessibility, screenReaderOptimized: checked })} 
            />
          </label>
        </div>
      </div>

      <Modal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        title="Data Retention Policy"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Data Storage:</strong> Your conversations and extracted entities are stored securely on our servers.
            </p>
            <p>
              <strong>Retention Period:</strong> Data is retained for as long as your account is active. You can delete data at any time.
            </p>
            <p>
              <strong>Access:</strong> Only members of your trusted groups can access shared conversations.
            </p>
            <p>
              <strong>Deletion:</strong> When you delete data, it is permanently removed from our servers within 30 days.
            </p>
          </div>
          <button
            onClick={() => setPolicyModalOpen(false)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

