import { NextResponse } from 'next/server'
import { mockThreads } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockThreads)
}

