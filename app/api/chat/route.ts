import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

// Cover letter specific system prompt
const COVER_LETTER_SYSTEM_PROMPT = `You are a professional cover letter writing assistant. Your expertise includes:

1. Creating compelling, personalized cover letters
2. Highlighting relevant experience that matches job requirements
3. Adapting tone and style for different industries and roles
4. Structuring content with clear opening, body, and closing sections
5. Avoiding generic templates and creating unique, engaging content

When generating cover letters, always:
- Ask clarifying questions if job details are unclear
- Tailor content to the specific role and company
- Use action verbs and quantifiable achievements
- Keep a professional yet engaging tone
- Structure content in clear sections

If users provide job descriptions or resumes, analyze them carefully to create highly targeted content.`

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gpt-4o-mini', type = 'general' } = await req.json()

    // Select the appropriate AI model
    let selectedModel
    switch (model) {
      case 'gpt-4o':
        selectedModel = openai('gpt-4o')
        break
      case 'gpt-4o-mini':
        selectedModel = openai('gpt-4o-mini')
        break
      case 'claude-3-haiku-20240307':
        selectedModel = anthropic('claude-3-haiku-20240307')
        break
      case 'claude-3-sonnet-20240229':
        selectedModel = anthropic('claude-3-sonnet-20240229')
        break
      case 'gemini-1.5-flash':
        selectedModel = google('gemini-1.5-flash')
        break
      default:
        selectedModel = openai('gpt-4o-mini')
    }

    // Use cover letter specific system prompt if type is cover-letter
    const systemPrompt = type === 'cover-letter' 
      ? COVER_LETTER_SYSTEM_PROMPT 
      : 'You are a helpful AI assistant.'

    // Prepare messages with system prompt
    const messagesWithSystem = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ]

    const result = await streamText({
      model: selectedModel,
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 