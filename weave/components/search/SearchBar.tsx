'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const examplePrompts = [
  'when did we decide on colors?',
  'what promises are still pending?',
  'show me weekend plans',
  'find memories about family dinner',
]

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by intent (e.g., 'when did we decide on colors?')"
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-bubble-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-2">Example prompts:</div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(prompt)
                onSearch(prompt)
              }}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-bubble hover:bg-gray-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

