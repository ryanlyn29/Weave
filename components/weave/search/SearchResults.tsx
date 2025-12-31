'use client'

import { SearchResult } from '@/lib/weaveTypes'
import Link from 'next/link'
import { MessageSquare, CheckCircle2, Mic } from 'lucide-react'

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

interface SearchResultsProps {
  query: string
  results: SearchResult[]
  isSearching: boolean
}

export function SearchResults({ query, results, isSearching }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        Searching...
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-gray-500 mb-2">Start typing to search</div>
        <div className="text-xs text-gray-400">
          Search by intent, not just keywords. Find what you need when you need it.
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-gray-500 mb-2">No results found</div>
        <div className="text-xs text-gray-400">
          Try rephrasing your search or using different keywords
        </div>
      </div>
    )
  }

  const groupedResults = {
    bestAnswer: results.filter(r => r.confidence >= 0.9),
    relatedDecisions: results.filter(r => r.type === 'entity' && r.title.toLowerCase().includes('decision')),
    supportingMessages: results.filter(r => r.type === 'message'),
    voiceNotes: results.filter(r => r.type === 'voice'),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {groupedResults.bestAnswer.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Best Answer</h3>
          <div className="space-y-3">
            {groupedResults.bestAnswer.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}

      {groupedResults.relatedDecisions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Related Decisions</h3>
          <div className="space-y-3">
            {groupedResults.relatedDecisions.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}

      {groupedResults.supportingMessages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Supporting Messages</h3>
          <div className="space-y-3">
            {groupedResults.supportingMessages.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}

      {groupedResults.voiceNotes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Voice Notes</h3>
          <div className="space-y-3">
            {groupedResults.voiceNotes.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ result }: { result: SearchResult }) {
  const getIcon = () => {
    switch (result.type) {
      case 'entity':
        return <CheckCircle2 className="w-4 h-4" />
      case 'message':
        return <MessageSquare className="w-4 h-4" />
      case 'voice':
        return <Mic className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {Math.round(result.confidence * 100)}% match
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{result.snippet}</p>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Why returned:</span> {result.whyReturned}
        </div>
        <Link
          href={`/app/thread/${result.sourceThreadId}${result.sourceMessageId ? `?msg=${result.sourceMessageId}` : ''}`}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Jump to source →
        </Link>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {formatDistanceToNow(new Date(result.timestamp))}
      </div>
    </div>
  )
}

