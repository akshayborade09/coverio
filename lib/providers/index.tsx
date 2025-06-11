"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Toaster } from 'sonner'

// Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

// Messages Context for Chat
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface MessagesContextType {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const MessagesContext = createContext<MessagesContextType | null>(null)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <MessagesContext.Provider value={{
      messages,
      addMessage,
      clearMessages,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider')
  }
  return context
}

// Model Context for AI Model Selection
interface ModelContextType {
  selectedModel: string
  setSelectedModel: (model: string) => void
  availableModels: { id: string; name: string; provider: string }[]
}

const ModelContext = createContext<ModelContextType | null>(null)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  
  const availableModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  ]

  return (
    <ModelContext.Provider value={{
      selectedModel,
      setSelectedModel,
      availableModels,
    }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error('useModel must be used within ModelProvider')
  }
  return context
}

// Main Providers Wrapper
export function ZolaProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ModelProvider>
        <MessagesProvider>
          <Toaster position="top-center" />
          {children}
        </MessagesProvider>
      </ModelProvider>
    </QueryClientProvider>
  )
} 