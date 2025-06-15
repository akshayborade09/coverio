import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, documents } = await request.json()
    // Process the message and documents but don't send any response
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process chat request' 
      },
      { status: 500 }
    )
  }
} 