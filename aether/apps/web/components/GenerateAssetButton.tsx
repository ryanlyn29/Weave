'use client'

import { useState } from 'react'
import { useAetherStore } from '@/lib/store'
import { wsManager } from '@/lib/websocket'
import { generateAsset } from '@/lib/ai'

export function GenerateAssetButton() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const currentUser = useAetherStore((state) => state.currentUser)

  const handleGenerate = async () => {
    if (!prompt.trim() || !currentUser) return

    setIsGenerating(true)
    try {
      const response = await generateAsset({
        prompt: prompt.trim(),
        position: currentUser.position,
        userId: currentUser.id,
        chunkID: currentUser.chunkID,
      })

      // Spawn asset in world
      wsManager.sendAssetSpawn({
        type: response.asset.type,
        position: response.asset.position,
        scale: response.asset.scale,
        color: response.asset.color,
      })

      setPrompt('')
    } catch (error) {
      console.error('Error generating asset:', error)
      alert('Failed to generate asset. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Generate asset (e.g., 'Red Dragon')"
          className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-2xl text-sm font-medium transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  )
}


