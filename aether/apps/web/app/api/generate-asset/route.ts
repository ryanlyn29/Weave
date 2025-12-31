import { NextRequest, NextResponse } from 'next/server'
import { generateAsset } from '@/lib/ai'
import { GenerateAssetRequest } from '../../../../../packages/shared/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateAssetRequest = await request.json()

    if (!body.prompt || !body.position || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await generateAsset(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating asset:', error)
    return NextResponse.json(
      { error: 'Failed to generate asset' },
      { status: 500 }
    )
  }
}


