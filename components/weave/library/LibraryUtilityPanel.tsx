'use client'

import { useState } from 'react'
import { ExtractedEntity, LibraryFilter } from '@/lib/weaveTypes'
import { Play, Download, Archive } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { api, ApiError } from '@/lib/api-client'

interface LibraryUtilityPanelProps {
  entities: ExtractedEntity[]
  filters?: LibraryFilter
}

export function LibraryUtilityPanel({ entities, filters }: LibraryUtilityPanelProps) {
  const [playModalOpen, setPlayModalOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    try {
      setExporting(true)
      const blob = await api.exportLibrary(filters || {})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `weave-library-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting library:', error)
      if (error instanceof ApiError) {
        alert(`Failed to export: ${error.message}`)
      } else {
        alert('Failed to export library. Please try again.')
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Bulk Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-2xl text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Archive className="w-3 h-3" />
            Resolve selected
          </button>
          <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-2xl text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Archive className="w-3 h-3" />
            Archive
          </button>
          <button
            onClick={handleExport}
            className="w-full text-left px-3 py-2 bg-gray-50 rounded-2xl text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Voice Recall</h3>
        <button 
          onClick={() => setPlayModalOpen(true)}
          className="w-full text-left px-3 py-2 bg-blue-50 rounded-2xl text-xs text-blue-700 hover:bg-blue-100 flex items-center gap-2"
        >
          <Play className="w-3 h-3" />
          Play batch summary
        </button>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {entities.length} items shown. All items are bidirectionally linked to their source chat messages.
        </p>
      </div>

      <Modal
        isOpen={playModalOpen}
        onClose={() => setPlayModalOpen(false)}
        title="Batch Voice Summary"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Playing voice summary for {entities.length} selected items...
          </p>
          <div className="flex items-center justify-center py-4">
            <button className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
              <Play className="w-6 h-6 ml-1" />
            </button>
          </div>
          <button
            onClick={() => setPlayModalOpen(false)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

