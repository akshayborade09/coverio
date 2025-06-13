import { NextRequest, NextResponse } from 'next/server';
import { FreeOpenParseService } from '@/lib/free-openparse-service';

let parseService: FreeOpenParseService | null = null;

async function getParseService() {
  if (!parseService) {
    parseService = new FreeOpenParseService();
    await parseService.initialize();
  }
  return parseService;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const service = await getParseService();
    const result = await service.processURL(url);

    return NextResponse.json({
      success: true,
      message: 'URL processed successfully',
      data: result
    });

  } catch (error) {
    console.error('URL processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'URL processing failed' },
      { status: 500 }
    );
  }
}