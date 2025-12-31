import { NextRequest, NextResponse } from 'next/server'
import { mockEntities } from '@/lib/mockData'

export async function POST(request: NextRequest) {
  const filters = await request.json()
  
  // Mock filtering
  let filtered = mockEntities
  
  if (filters.type?.length > 0) {
    filtered = filtered.filter(e => filters.type.includes(e.type))
  }
  
  if (filters.status?.length > 0) {
    filtered = filtered.filter(e => filters.status.includes(e.status))
  }

  return NextResponse.json({ entities: filtered })
}

