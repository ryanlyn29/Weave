import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Mock entity extraction
  const entity = {
    id: `entity_${Date.now()}`,
    type: 'plan', // Would be determined by ML
    title: 'Extracted Plan',
    description: body.content,
    status: 'proposed',
    ownerId: body.senderId,
    threadId: body.threadId,
    messageId: body.messageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    importanceScore: 0.7,
  }

  return NextResponse.json({ entity })
}

