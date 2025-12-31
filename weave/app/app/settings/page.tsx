'use client'

import { SettingsSections } from '@/components/settings/SettingsSections'

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <SettingsSections />
      </div>
    </div>
  )
}

