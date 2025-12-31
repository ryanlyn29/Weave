'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/weave/search/SearchBar'
import { SearchResults } from '@/components/weave/search/SearchResults'
import { api, SearchResult, ApiError } from '@/lib/api-client'
import { useAuth } from '@/components/auth/AuthProvider'
import { EmptyState } from '@/components/ui/EmptyState'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setQuery(searchQuery)
    setIsSearching(true)
    setHasSearched(true)

    try {
      const searchResults = await api.search(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Error searching:', error)
      if (error instanceof ApiError) {
        // Handle specific error cases
        setResults([])
      } else {
        setResults([])
      }
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {!hasSearched ? (
          <EmptyState
            icon={Search}
            title="Search your conversations"
            description="Type what you're looking for. WEAVE understands intent, not just keywords. Try 'when did we decide on colors?' or 'weekend plans'."
          />
        ) : (
          <SearchResults 
            query={query} 
            results={results} 
            isSearching={isSearching} 
          />
        )}
      </div>
    </div>
  )
}

