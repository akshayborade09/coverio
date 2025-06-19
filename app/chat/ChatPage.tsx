"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomIcon from '../../components/CustomIcon'
import { TextShimmer } from '@/components/core/text-shimmer'
import { PuffLoader } from 'react-spinners'
import { useCustomToast } from '@/components/Toast'

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
  const { showDocumentGeneration } = useCustomToast()

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
      setTimeout(() => setShowWaitingPrompt(true), 200);
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
    // Use the document generation toast
    showDocumentGeneration({
      onComplete: () => {
        // Navigate to cover letter ID 1 after generation completes
        console.log('Document generation completed!');
        router.push('/cover-letter?id=1');
      }
    });
  };

  const handleAttachmentTap = (attachment: File) => {
    // Handle attachment tap - could open in new tab, show preview, etc.
    if (attachment.type.startsWith('image/')) {
      // For images, open in new tab
      const url = URL.createObjectURL(attachment);
      window.open(url, '_blank');
    } else {
      // For other files, could trigger download or show preview
      console.log('Opening attachment:', attachment.name);
      // You could implement file preview logic here
    }
  };

  const handleMessageTap = (message: UIMessage) => {
    // Handle message tap - could copy to clipboard, show options, etc.
    if (message.content) {
      // Copy message content to clipboard
      navigator.clipboard.writeText(message.content).then(() => {
        console.log('Message copied to clipboard');
        // Could show a toast notification here
      });
    }
  };

  const handleEmptyStateTap = () => {
    // Focus the input when tapping the empty state
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputAreaTap = () => {
    // Focus input when tapping the input area
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  // Scroll to bottom when messages or waiting prompt changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showWaitingPrompt])

  return (
    <div className="flex flex-col h-screen bg-[#0d0c0c]">
      {/* Back Button */}
      <div className="fixed top-0 left-0 right-0 h-20 z-30">
        {/* Progressive blur layers */}
        <div className="absolute inset-0" style={{ background: '#0d0c0c' }}></div>
        <div className="absolute inset-0" style={{ background: 'transparent' }}></div>
        <div className="absolute inset-0" style={{ background: 'transparent' }}></div>
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
              className="px-5 h-12 flex items-center justify-center rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                minWidth: '110px',
                fontSize: '1rem',
                background: 'linear-gradient(180deg, rgba(12, 31, 98, 0.5) 0%, rgba(16, 79, 137, 0.3) 100%)', 
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.05) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)'
              }}
              onClick={handleGenerate}
            >
              <span className="text-white">Generate document</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className={`flex-1 p-4 space-y-4 pb-44 pt-20 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {messages.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center text-center text-white opacity-60 select-none h-full cursor-pointer transition-opacity hover:opacity-80 active:opacity-100" 
            style={{ overflow: 'hidden' }}
            onClick={handleEmptyStateTap}
          >
            <div className="flex flex-col items-center justify-center flex-1 h-full">
              <h1 className="text-2xl font-bold mb-2 font-playfair">Need a document? Just ask</h1>
              <p className="text-gray-400 font-open-sauce">Our AI agent creates it instantly</p>
            </div>
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
                    <div 
                      className="relative w-16 h-16 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      style={{
                        borderRadius: '16px',
                        background: message.attachment.type.includes('pdf')
                          ? '#FF4B4B'
                          : message.attachment.type.includes('doc')
                          ? '#3BB3FF'
                          : message.attachment.type.includes('xls')
                          ? '#3BCB7F'
                          : '#222',
                      }}
                      onClick={() => handleAttachmentTap(message.attachment!)}
                    >
                      {message.attachment.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(message.attachment)}
                          alt={message.attachment.name}
                          className="object-cover w-16 h-16"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg select-none">
                          {message.attachment.type.includes('pdf') && 'PDF'}
                          {message.attachment.type.includes('doc') && 'DOC'}
                          {message.attachment.type.includes('xls') && 'XLS'}
                          {!message.attachment.type.match(/pdf|doc|xls/) && 'FILE'}
                        </span>
                      )}
                    </div>
                    <span className="text-white text-[10px] mt-1 px-1 truncate w-16 text-center select-none opacity-50" title={message.attachment.name}>
                      {message.attachment.name}
                    </span>
                  </div>
                )}
                {/* Message content */}
                {message.content && (
                  <div
                    className={`max-w-[80%] p-3 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                      message.role === 'user'
                        ? 'bg-[#2a2a2a] text-white'
                        : 'bg-[#2a2a2a]/80 text-white'
                    }`}
                    style={{ borderRadius: '24px' }}
                    onClick={() => handleMessageTap(message)}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                )}
                {/* Show prompt only for the last user message without attachment, and only if no document in chat */}
                {message.role === 'user' && message.content && !message.attachment && isLastUserMessage && showWaitingPrompt && !hasAnyDocument && (
                  <div className="mt-6 w-full flex flex-col gap-2 justify-start">
                    <div className="flex items-center gap-2">
                      <PuffLoader size={22} color="#fff" speedMultiplier={1.2} />
                      <TextShimmer className="font-open-sauce-one text-sm text-white/70" duration={1}>
                        Waiting for your insightful content and documents
                      </TextShimmer>
                    </div>
                    <div className="mt-2">
                      <TextShimmer className="font-open-sauce-one text-xs font-light text-white/50 leading-relaxed" duration={1}>
                        Please add some documents with the details about your requirement and AI will create a document for you
                      </TextShimmer>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#202020] text-white p-3 rounded-2xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]">
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
            className={`flex flex-col p-3 rounded-2xl transition-colors cursor-text ${
              isInputFocused ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
            }`}
            style={{
              outline: '1px solid rgba(255, 255, 255, 0.1)',
              outlineOffset: '-1px',
              minHeight: attachedFile ? '120px' : undefined,
            }}
            onClick={handleInputAreaTap}
          >
            {/* Attachment Preview (first row) */}
            {attachedFile && (
              <div className="flex flex-col items-start mb-3">
                <div 
                  className="relative w-16 h-16 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  style={{
                    borderRadius: '16px',
                    background: attachedFile.type.includes('pdf')
                      ? '#FF4B4B'
                      : attachedFile.type.includes('doc')
                      ? '#3BB3FF'
                      : attachedFile.type.includes('xls')
                      ? '#3BCB7F'
                      : '#222',
                  }}
                  onClick={() => handleAttachmentTap(attachedFile)}
                >
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
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white/30 rounded-full text-white hover:bg-white/50 transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click
                      setAttachedFile(null);
                    }}
                    style={{ zIndex: 2 }}
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>
                <span className="text-white text-[10px] mt-1 px-1 truncate w-16 text-center select-none opacity-50" title={attachedFile.name}>
                  {attachedFile.name}
                </span>
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