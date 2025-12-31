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
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const timeframe = searchParams.get('timeframe') || 'all'
    
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      // In production, add Firebase ID token here
    }
    
    const queryParams = new URLSearchParams()
    if (type) queryParams.append('type', type)
    if (status) queryParams.append('status', status)
    queryParams.append('timeframe', timeframe)
    
    const response = await fetch(`${BACKEND_URL}/v1/library?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to query library' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying to backend:', error)
    return NextResponse.json(
      { error: 'Failed to query library' },
      { status: 500 }
    )
  }
}
