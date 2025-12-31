import { NextResponse } from 'next/server'
import { mockActivities } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockActivities)
}

