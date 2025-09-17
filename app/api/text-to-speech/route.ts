import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, speed = 1.1 } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // For now, return an error to force fallback to browser TTS
    // This allows us to use the free browser voices exclusively
    return NextResponse.json(
      { error: 'Using free browser voices only' }, 
      { status: 503 }
    )

  } catch (error) {
    console.error('Text-to-speech API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}