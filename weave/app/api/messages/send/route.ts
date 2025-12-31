import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Mock implementation
  const message = {
    id: `msg_${Date.now()}`,
    threadId: body.threadId,
    senderId: body.senderId,
    type: body.type || 'text',
    content: body.content,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json({ message })
}

