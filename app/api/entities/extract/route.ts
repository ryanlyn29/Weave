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
    const { messageId, threadId, content } = body
    
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      // In production, add Firebase ID token here
    }
    
    const response = await fetch(`${BACKEND_URL}/v1/entities/extract`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messageId, threadId, content }),
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to extract entities' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to extract entities' },
      { status: 500 }
    )
  }
}
