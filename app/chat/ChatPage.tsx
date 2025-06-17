"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomIcon from '../../components/CustomIcon'
import { TextShimmer } from '@/components/core/text-shimmer'
import { PuffLoader } from 'react-spinners'

interface UIMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  attachment?: File | null
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [showWaitingPrompt, setShowWaitingPrompt] = useState(false)

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
    // Check if there's a chip value in the query parameter
    const chip = searchParams.get('chip')
    if (chip) {
      setInput(`Create a ${chip} of`)
      // Focus the input immediately to maximize mobile keyboard reliability
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.click()
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
        }
      }, 0)
    }
  }, [searchParams])

  // Fallback: tap anywhere to focus input if it has value and is not focused
  useEffect(() => {
    function handleTapToFocus(e: MouseEvent) {
      if (input && inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus()
        inputRef.current.click()
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
      }
    }
    document.addEventListener('click', handleTapToFocus)
    return () => document.removeEventListener('click', handleTapToFocus)
  }, [input])

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
      textarea.blur(); // Close the keyboard on mobile
    }
    setIsLoading(true);

    // Show waiting prompt after delay if no attachment
    if (!attachedFile) {
      setShowWaitingPrompt(false);
      setTimeout(() => setShowWaitingPrompt(true), 1200);
    } else {
      setShowWaitingPrompt(false);
    }

    try {
      // ... existing code ...
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerate = () => {
    // Placeholder: implement generation logic here
    alert('Generate action triggered!');
  };

  // Determine if the last user message has an attachment
  const lastUserMessageWithAttachment = messages.length > 0 && (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].attachment) {
        return true;
      }
    }
    return false;
  })();

  // Helper to check if any message has an attachment
  const hasAnyDocument = messages.some(msg => msg.attachment);

  return (
    <div className="flex flex-col h-screen bg-[#0d0c0c]">
      {/* Back Button */}
      <div className="fixed top-0 left-0 right-0 h-20 z-30">
        {/* Progressive blur layers */}
        <div className="absolute inset-0" style={{
          // backdropFilter: 'blur(8px)',
          background: 'linear-gradient(to bottom, rgba(13,12,12,1) 0%, rgba(13,12,12,1) 20%, rgba(13,12,12,0.8) 40%, rgba(13,12,12,0.6) 60%, rgba(13,12,12,0) 100%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(0px)',
          background: 'linear-gradient(to bottom, rgba(13,12,12,0) 0%, rgba(13,12,12,0.6) 25%, rgba(13,12,12,0.4) 50%, rgba(13,12,12,0) 75%)'
        }}></div>
        <div className="absolute inset-0" style={{
          backdropFilter: 'blur(0px)',
          background: 'linear-gradient(to bottom, rgba(13,12,12,0) 0%, rgba(13,12,12,0.3) 50%, rgba(13,12,12,0.1) 75%, rgba(13,12,12,0) 100%)'
        }}></div>
        {/* Back Button on the left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
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
        {/* Generate Button on the right */}
        {lastUserMessageWithAttachment && (
          <div className="absolute top-4 right-4">
            <button
              className="px-3 h-12 flex items-center justify-center rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                minWidth: '110px',
                fontSize: '1rem',
                background: 'linear-gradient(137deg, rgba(255,255,255,0) 0%, rgba(113,113,113,0.19) 40%)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
                WebkitBackdropFilter: 'blur(10.67px)'
              }}
              onClick={handleGenerate}
            >
              <span className="text-white">Generate</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40 pt-20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center text-white opacity-60">
            <h1 className="text-2xl font-bold mb-2 font-playfair">Need a document? Just ask</h1>
            <p className="text-gray-400 font-open-sauce">Our AI agent creates it instantly</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {messages.map((message: UIMessage, index) => {
            // Check if this is the last user message
            const isLastUserMessage = messages.slice(index + 1).every(msg => msg.role !== 'user');
            
            return (
              <div
                key={index}
                className={`flex flex-col items-end ${message.role === 'user' ? 'justify-end' : 'justify-start items-start'}`}
              >
                {/* Document thumbnail above message */}
                {message.attachment && (
                  <div className="mb-1 flex flex-col items-end">
                    <div className="relative w-16 h-16 flex flex-col items-center justify-center overflow-hidden"
                      style={{
                        borderRadius: '16px',
                        background: message.attachment.type.includes('pdf')
                          ? '#FF4B4B'
                          : message.attachment.type.includes('doc')
                          ? '#3BB3FF'
                          : message.attachment.type.includes('xls')
                          ? '#3BCB7F'
                          : '#222',
                      }}>
                      <span className="text-white font-bold text-lg select-none">
                        {message.attachment.type.includes('pdf') && 'PDF'}
                        {message.attachment.type.includes('doc') && 'DOC'}
                        {message.attachment.type.includes('xls') && 'XLS'}
                        {!message.attachment.type.match(/pdf|doc|xls/) && 'FILE'}
                      </span>
                    </div>
                    <span className="text-white text-[10px] mt-1 px-1 truncate w-16 text-center select-none opacity-50" title={message.attachment.name}>
                      {message.attachment.name}
                    </span>
                  </div>
                )}
                {/* Message content */}
                {message.content && (
                  <div
                    className={`max-w-[80%] p-3 ${
                      message.role === 'user'
                        ? 'bg-[#2a2a2a] text-white'
                        : 'bg-[#2a2a2a]/80 text-white'
                    }`}
                    style={{ borderRadius: '24px' }}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                )}
                {/* Show prompt only for the last user message without attachment, and only if no document in chat */}
                {message.role === 'user' && message.content && !message.attachment && isLastUserMessage && showWaitingPrompt && !hasAnyDocument && (
                  <div className="mt-6 w-full flex items-center gap-2 justify-start">
                    <PuffLoader size={22} color="#fff" speedMultiplier={1.2} />
                    <TextShimmer className="font-open-sauce-one text-sm text-white/70" duration={1}>
                      Waiting for your insightful content and documents
                    </TextShimmer>
                  </div>
                )}
              </div>
            );
          })}
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
      <div className="fixed bottom-0 left-0 right-0 px-4 p-4 bg-[#0d0c0c] z-20">
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
                <div className="relative w-16 h-16 flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    borderRadius: '16px',
                    background: attachedFile.type.includes('pdf')
                      ? '#FF4B4B'
                      : attachedFile.type.includes('doc')
                      ? '#3BB3FF'
                      : attachedFile.type.includes('xls')
                      ? '#3BCB7F'
                      : '#222',
                  }}>
                  {attachedFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(attachedFile)}
                      alt={attachedFile.name}
                      className="object-cover w-16 h-16"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg select-none">
                      {attachedFile.type.includes('pdf') && 'PDF'}
                      {attachedFile.type.includes('doc') && 'DOC'}
                      {attachedFile.type.includes('xls') && 'XLS'}
                      {!attachedFile.type.match(/pdf|doc|xls/) && 'FILE'}
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white/30 rounded-full text-white hover:bg-white/50"
                    onClick={() => setAttachedFile(null)}
                    style={{ zIndex: 2 }}
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>
                {!attachedFile.type.startsWith('image/') && (
                  <span className="text-white text-[10px] mt-1 px-1 truncate w-16 text-center select-none opacity-50" title={attachedFile.name}>
                    {attachedFile.name}
                  </span>
                )}
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