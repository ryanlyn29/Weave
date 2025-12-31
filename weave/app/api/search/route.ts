import { NextRequest, NextResponse } from 'next/server'
import { SearchResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  const { query } = await request.json()
  
  // Mock search results
  const results: SearchResult[] = [
    {
      id: '1',
      type: 'entity',
      title: 'Weekend Hiking Trip',
      snippet: 'Hiking trip planned for Sunday at 8am',
      confidence: 0.95,
      whyReturned: 'Matches intent: "weekend plans"',
      sourceThreadId: 'thread1',
      entityId: 'entity1',
      timestamp: '2024-01-15T09:00:00Z',
    },
  ]

  return NextResponse.json({ results })
}

