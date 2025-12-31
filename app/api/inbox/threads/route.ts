import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

async function getAuthToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null
    
    // In production, get Firebase ID token from session
    // For now, return a placeholder - backend will handle auth
    return session.user.email || null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sortBy = searchParams.get('sortBy') || 'recent'
    
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      // In production, add Firebase ID token here
      // headers['Authorization'] = `Bearer ${firebaseIdToken}`
    }
    
    const response = await fetch(`${BACKEND_URL}/v1/threads?sort=${sortBy}`, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch threads', details: error },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    
    // Transform response to match frontend expectations
    return NextResponse.json({
      threads: data,
      total: data.length,
    })
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    )
  }
}
