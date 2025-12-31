import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

async function getAuthToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null
    return session.user.email || null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { threadId, content, type, voiceUrl, tags, context, commentary, calendarEvent } = body
    
    if (!threadId || (!content && !voiceUrl)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      // In production, add Firebase ID token here
    }
    
    // Transform request to match backend format
    const backendBody = {
      threadId,
      type: type || (voiceUrl ? 'voice' : 'text'),
      content: content || '',
      audioUrl: voiceUrl || null,
      tags: tags || [],
      context: context || null,
      commentary: commentary || null,
      calendarEvent: calendarEvent || null,
    }
    
    const response = await fetch(`${BACKEND_URL}/v1/messages/send`, {
      method: 'POST',
      headers,
      body: JSON.stringify(backendBody),
    })
    
    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: 'Failed to send message', details: error },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // Transform response to match frontend expectations
    return NextResponse.json({
      message: data.message,
      extractedEntities: data.extractedEntities || [],
      updatedThread: data.updatedThread,
      success: true,
    })
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
