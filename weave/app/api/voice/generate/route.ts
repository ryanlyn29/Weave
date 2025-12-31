import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { text, style } = await request.json()
  
  // Mock ElevenLabs integration
  // In production, this would call ElevenLabs API
  const audioUrl = `/audio/generated_${Date.now()}.mp3`

  return NextResponse.json({ audioUrl })
}

