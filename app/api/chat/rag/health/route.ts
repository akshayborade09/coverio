import { NextResponse } from 'next/server';
import { OllamaService } from '@/lib/ollama-service';

export async function GET() {
  try {
    const ollamaService = new OllamaService();
    
    const isOllamaAvailable = await ollamaService.isAvailable();
    const models = isOllamaAvailable ? await ollamaService.listModels() : [];

    return NextResponse.json({
      status: 'healthy',
      services: {
        ollama: {
          available: isOllamaAvailable,
          models: models
        },
        chromadb: true, // ChromaDB is embedded
        openparse: true // Open Parse is embedded
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Health check failed'
    }, { status: 500 });
  }
}