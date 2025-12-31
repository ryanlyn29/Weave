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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter required' },
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
    
    const response = await fetch(`${BACKEND_URL}/v1/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to search' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}
