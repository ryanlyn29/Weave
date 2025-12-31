'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchResult } from '@/lib/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setResults([
        {
          id: '1',
          type: 'entity',
          title: 'Weekend Hiking Trip',
          snippet: 'Hiking trip planned for Sunday at 8am. Alex will bring snacks.',
          confidence: 0.95,
          whyReturned: 'Matches intent: "weekend plans" and contains date/time',
          sourceThreadId: 'thread1',
          entityId: 'entity1',
          timestamp: '2024-01-15T09:00:00Z',
        },
        {
          id: '2',
          type: 'decision',
          title: 'Use React for frontend',
          snippet: 'Team decision to use React for the frontend architecture.',
          confidence: 0.88,
          whyReturned: 'Matches intent: "decisions about technology"',
          sourceThreadId: 'thread2',
          entityId: 'entity3',
          timestamp: '2024-01-15T08:00:00Z',
        },
      ])
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <SearchResults 
          query={query} 
          results={results} 
          isSearching={isSearching} 
        />
      </div>
    </div>
  )
}

