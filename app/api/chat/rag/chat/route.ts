import { NextRequest, NextResponse } from 'next/server';
import { FreeOpenParseService } from '@/lib/free-openparse-service';
import { OllamaService } from '@/lib/ollama-service';

let parseService: FreeOpenParseService | null = null;
let ollamaService: OllamaService | null = null;

async function getServices() {
  if (!parseService) {
    parseService = new FreeOpenParseService();
    await parseService.initialize();
  }
  
  if (!ollamaService) {
    ollamaService = new OllamaService();
  }
  
  return { parseService, ollamaService };
}

export async function POST(request: NextRequest) {
  try {
    const { query, conversationHistory = [] } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const { parseService, ollamaService } = await getServices();

    // Check if Ollama is available
    const isOllamaAvailable = await ollamaService.isAvailable();
    if (!isOllamaAvailable) {
      return NextResponse.json({
        error: 'Ollama service is not available. Please make sure Ollama is running locally.',
        suggestion: 'Run "ollama serve" in your terminal'
      }, { status: 503 });
    }

    // Search for relevant documents
    const searchResults = await parseService.search(query, 5);

    // Prepare context
    const context = searchResults
      .map((result: any) => {
        const source = result.metadata?.filename || result.metadata?.url || 'Unknown source';
        return `Source: ${source}\nContent: ${result.content}\n`;
      })
      .join('\n---\n\n');

    // Create enhanced prompt
    const systemPrompt = `You are a helpful AI assistant that answers questions based on provided document context. 

Context from processed documents and web pages:
${context}

Instructions:
- Answer based primarily on the provided context
- If the context doesn't fully answer the question, acknowledge this
- Cite sources when possible (mention filename or URL)
- Be concise but comprehensive
- If no relevant context is found, say so clearly

User question: ${query}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query }
    ];

    const response = await ollamaService.chat(messages);

    // Extract source information
    const sources = searchResults.map((result: any) => ({
      filename: result.metadata?.filename,
      url: result.metadata?.url,
      score: result.score,
      type: result.metadata?.source || 'unknown'
    }));

    return NextResponse.json({
      success: true,
      response,
      sources,
      contextUsed: searchResults.length > 0,
      model: 'Local Ollama Model'
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}