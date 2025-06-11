"use client"

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { useMessages, useModel } from '@/lib/providers'
import CustomIcon from './CustomIcon'

interface ChatProps {
  type?: 'general' | 'cover-letter'
  placeholder?: string
  onCoverLetterGenerated?: (content: string) => void
}

export default function Chat({ 
  type = 'general', 
  placeholder = "Type a message...",
  onCoverLetterGenerated 
}: ChatProps) {
  const { selectedModel } = useModel()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      model: selectedModel,
      type: type
    },
    onFinish: (message) => {
      // If this is a cover letter chat and we got a response, trigger callback
      if (type === 'cover-letter' && onCoverLetterGenerated) {
        onCoverLetterGenerated(message.content)
      }
    },
    initialMessages: []
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-white opacity-60">
            <CustomIcon name="home" size={48} className="mb-4" />
            <h2 className="text-xl font-medium mb-2">
              {type === 'cover-letter' ? 'Cover Letter Assistant' : 'AI Chat'}
            </h2>
            <p className="text-sm">
              {type === 'cover-letter' 
                ? 'Share your job description and let me help you create a compelling cover letter'
                : 'Start a conversation with AI'
              }
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#202020] text-white'
            }`}>
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#202020] text-white p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white opacity-60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white opacity-60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm opacity-60">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div 
            className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
              isInputFocused ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
            }`}
            style={{
              outline: '1px solid rgba(255, 255, 255, 0.1)',
              outlineOffset: '-1px',
            }}
          >
            <button 
              type="button"
              className="w-8 h-8 flex items-center justify-center text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <CustomIcon name="attach" size={20} />
            </button>
            
            <input
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none"
              disabled={isLoading}
            />
            
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`w-8 h-8 flex items-center justify-center transition-opacity ${
                input.trim() && !isLoading ? 'text-blue-400 opacity-100' : 'text-white opacity-30'
              }`}
            >
              <CustomIcon name="send" size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 