import { NextResponse } from 'next/server'
import { mockThreads, mockMessages } from '@/lib/mockData'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const thread = mockThreads.find(t => t.id === id)
  const messages = mockMessages[id] || []

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  }

  return NextResponse.json({ thread, messages })
}

