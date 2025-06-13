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
    const service = await getParseService();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await service.processDocument(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      message: 'Document processed successfully',
      data: result
    });

  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}