"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CustomIcon from '../../components/CustomIcon'

interface UIMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  attachment?: File | null
}

export default function ChatPage() {
  const router = useRouter()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Check if there's a selected chip from localStorage
    const selectedChip = localStorage.getItem('selectedChip')
    if (selectedChip) {
      setInput(selectedChip)
      // Clear the localStorage
      localStorage.removeItem('selectedChip')
      // Focus the input after a longer delay to ensure it's rendered and keyboard opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          // Force focus and selection to ensure keyboard opens on mobile
          inputRef.current.click()
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
        }
      }, 300)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    const newMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      attachment: attachedFile
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setAttachedFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '24px';
    }
    setIsLoading(true);

    try {
      // ... existing code ...
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#181818]">
      {/* Back Button */}
      <div className="fixed top-0 left-0 right-0 h-20 z-30">
        {/* Progressive blur layers */}
        <div className="absolute inset-0" style={{
          // backdropFilter: 'blur(8px)',
          background: 'linear-gradient(to bottom, rgba(24,24,24,1) 0%, rgba(24,24,24,1) 20%, rgba(24,24,24,0.8) 40%, rgba(24,24,24,0.6) 60%, rgba(24,24,24,0) 100%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(0px)',
          background: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,0.6) 25%, rgba(24,24,24,0.4) 50%, rgba(24,24,24,0) 75%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(0px)',
          background: 'linear-gradient(to bottom, rgba(24,24,24,0) 0%, rgba(24,24,24,0.3) 50%, rgba(24,24,24,0.1) 75%, rgba(24,24,24,0) 100%)'
        }}></div>
        <div className="absolute top-4 left-4">
          <button
            className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(137deg, rgba(255,255,255,0) 0%, rgba(113,113,113,0.19) 40%)',
              borderRadius: '44.45px',
              outline: '1px rgba(255,255,255,0.10) solid',
              outlineOffset: '-1px',
              backdropFilter: 'blur(10.67px)'
            }}
            onClick={() => router.back()}
          >
            <CustomIcon name="back" size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40 pt-20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center text-white opacity-60">
            <h1 className="text-2xl font-bold mb-2 font-playfair">Need a document? Just ask</h1>
            <p className="text-gray-400 font-open-sauce">Our AI agent creates it instantly</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {messages.map((message: UIMessage, index) => (
            <div
              key={index}
              className={`flex flex-col items-end ${message.role === 'user' ? 'justify-end' : 'justify-start items-start'}`}
            >
              {/* Attachment above bubble for user messages */}
              {message.attachment && message.role === 'user' && (
                <div className="mb-1 flex flex-col items-end">
                  <div className="relative w-16 h-16 flex items-center justify-center bg-[#222] rounded-lg outline outline-1 outline-white/10 overflow-hidden">
                    {message.attachment.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(message.attachment)}
                        alt={message.attachment.name}
                        className="object-cover w-16 h-16"
                      />
                    ) : (
                      <CustomIcon name="document" size={40} className="text-white opacity-80" />
                    )}
                  </div>
                </div>
              )}
              {message.content && (
                <div
                  className={`max-w-[80%] p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#2a2a2a] text-white'
                  }`}
                  style={{ borderRadius: '24px' }}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  {/* For assistant messages, show attachment inside bubble if present */}
                  {message.attachment && message.role !== 'user' && (
                    <div className="mt-2 flex flex-col items-start">
                      <div className="relative w-16 h-16 flex items-center justify-center bg-[#222] rounded-lg outline outline-1 outline-white/10 overflow-hidden">
                        {message.attachment.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(message.attachment)}
                            alt={message.attachment.name}
                            className="object-cover w-16 h-16"
                          />
                        ) : (
                          <CustomIcon name="document" size={40} className="text-white opacity-80" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
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
      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-8 bg-[#181818] z-20">
        {/* File input outside the form to avoid form submission issues */}
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <form onSubmit={handleSubmit} className="relative">
          <div 
            className={`flex flex-col p-3 rounded-2xl transition-colors ${
              isInputFocused ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
            }`}
            style={{
              outline: '1px solid rgba(255, 255, 255, 0.1)',
              outlineOffset: '-1px',
              minHeight: attachedFile ? '120px' : undefined,
            }}
          >
            {/* Attachment Preview (first row) */}
            {attachedFile && (
              <div className="flex flex-col items-start mb-3">
                <div className="relative w-16 h-16 flex items-center justify-center bg-[#222] rounded-lg outline outline-1 outline-white/10 overflow-hidden">
                  {attachedFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(attachedFile)}
                      alt={attachedFile.name}
                      className="object-cover w-16 h-16"
                    />
                  ) : (
                    <CustomIcon name="document" size={40} className="text-white opacity-80" />
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-black/70 rounded-full text-white hover:bg-black"
                    style={{ transform: 'translate(30%,-30%)' }}
                    onClick={() => setAttachedFile(null)}
                  >
                    <CustomIcon name="close" size={14} />
                  </button>
                </div>
              </div>
            )}
            {/* Icons Row (third row) */}
            <div className="flex flex-col gap-5 w-full">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Type a message..."
                className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none min-h-[24px] max-h-[96px] overflow-y-auto"
                rows={1}
                disabled={isLoading}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
                }}
              />
              <div className="flex items-center justify-between w-full">
                <button 
                  type="button"
                  className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                    borderRadius: '44.45px',
                    outline: '1px rgba(255,255,255,0.10) solid',
                    outlineOffset: '-1px',
                    backdropFilter: 'blur(10.67px)'
                  }}
                  onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
                >
                  <CustomIcon name="attach" size={24} className="text-white" />
                </button>
                <button 
                  type="submit"
                  disabled={(!input.trim() && !attachedFile) || isLoading}
                  className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                    borderRadius: '44.45px',
                    outline: '1px rgba(255,255,255,0.10) solid',
                    outlineOffset: '-1px',
                    backdropFilter: 'blur(10.67px)'
                  }}
                >
                  <CustomIcon name="send" size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}