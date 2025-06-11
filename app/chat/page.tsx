"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"

interface DocumentData {
  name: string
  size: number
  type: string
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSource = searchParams.get('from') // 'write' or 'document'
  
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Array<{id: string, content: string, isUser: boolean}>>([])
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null)
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [previousHeight, setPreviousHeight] = useState<string>("24px")
  const [wasAtMaxHeight, setWasAtMaxHeight] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if coming from document upload
    if (fromSource === 'document') {
      const docData = localStorage.getItem('selectedDocument')
      if (docData) {
        try {
          const parsedDoc = JSON.parse(docData)
          setSelectedDocument(parsedDoc)
          // Clear from localStorage after loading
          localStorage.removeItem('selectedDocument')
        } catch (error) {
          console.error('Error parsing document data:', error)
        }
      }
    }
    
    // Auto-focus on textarea when coming from "Write about you"
    if (fromSource === 'write' && textareaRef.current) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [fromSource])

  const handleBack = () => {
    router.push('/')
  }

  const handleAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedDocument({
        name: file.name,
        size: file.size,
        type: file.type
      })
      
      // Focus on text input after document upload
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  const handleRemoveDocument = () => {
    setSelectedDocument(null)
  }

  const handleSend = () => {
    if (inputValue.trim() || selectedDocument) {
      const newMessage = {
        id: Date.now().toString(),
        content: inputValue.trim(),
        isUser: true
      }
      setMessages(prev => [...prev, newMessage])
      setInputValue("")
      
      // Remove document after sending
      if (selectedDocument) {
        setSelectedDocument(null)
      }
    }
  }

  const handleExpandClick = () => {
    if (textareaRef.current) {
      setPreviousHeight(textareaRef.current.style.height || "24px")
    }
    setWasAtMaxHeight(isAtMaxHeight)
    setIsFullScreen(true)
  }

  const handleCollapseClick = () => {
    setIsFullScreen(false)
    setTimeout(() => {
      if (textareaRef.current && previousHeight !== "24px") {
        textareaRef.current.style.height = previousHeight
        setIsAtMaxHeight(wasAtMaxHeight)
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
      }
    }, 100)
  }

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return 'file-text'
    if (type.includes('doc')) return 'file-text'
    if (type.includes('image')) return 'image'
    return 'file'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Full-screen chat input
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="flex flex-col h-full">
          {/* Collapse button */}
          <div className="flex justify-end items-center p-4">
            <button 
              onClick={handleCollapseClick}
              className="text-white opacity-60 hover:opacity-100 transition-opacity"
            >
              <CustomIcon name="collapse" size={24} />
            </button>
          </div>
          
          {/* Expandable textarea area */}
          <div className="flex-1 px-4 mb-3">
            <textarea
              placeholder={
                fromSource === 'write' 
                  ? "Write something about yourself" 
                  : fromSource === 'portfolio'
                  ? "Enter your portfolio URL or share details about your work"
                  : "Add context about your document"
              }
              className="bg-transparent border-none outline-none w-full h-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          
          {/* Attach and Send buttons */}
          <div className="flex justify-between gap-2 px-4 pb-4">
            <button 
              onClick={handleAttach}
              className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="attach" size={24} className="text-white" />
            </button>
            <button 
              onClick={handleSend}
              className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="send" size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col h-screen text-[#ffffff] relative overflow-hidden">
        {/* Header with Back Button */}
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5 m-4"
            style={{
              background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
              boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
              borderRadius: '44.45px',
              backdropFilter: 'blur(10.67px)',
            }}
          >
            <CustomIcon name="back" size={20} className="text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              {/* Empty state - no text */}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-[#000000] outline outline-1 outline-offset-[-0.50px] outline-white/10 rounded-3xl p-4 w-full relative">
            {/* Document Preview */}
            {selectedDocument && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <div 
                    className="w-24 h-24 bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-white/10 relative"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <CustomIcon 
                      name={getDocumentIcon(selectedDocument.type)} 
                      size={32} 
                      className="text-white opacity-60 mb-1" 
                    />
                    <span className="text-xs text-white opacity-60 text-center px-1 leading-tight">
                      {selectedDocument.name.length > 12 
                        ? selectedDocument.name.substring(0, 12) + '...' 
                        : selectedDocument.name}
                    </span>
                    <span className="text-xs text-white opacity-40">
                      {formatFileSize(selectedDocument.size)}
                    </span>
                    
                    {/* Cancel button */}
                    <button
                      onClick={handleRemoveDocument}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Text Input Area */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                placeholder={
                  fromSource === 'write' 
                    ? "Write something about yourself" 
                    : fromSource === 'portfolio'
                    ? "Enter your portfolio URL or share details about your work"
                    : "Add context about your document"
                }
                className="bg-transparent border-none outline-none w-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none overflow-hidden"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const scrollHeight = target.scrollHeight;
                  const maxHeight = 6 * 24;
                  const newHeight = Math.min(scrollHeight, maxHeight);
                  target.style.height = newHeight + 'px';
                  
                  const atMaxHeight = scrollHeight > maxHeight;
                  setIsAtMaxHeight(atMaxHeight);
                  
                  if (!isFullScreen) {
                    setPreviousHeight(newHeight + 'px');
                    setWasAtMaxHeight(atMaxHeight);
                  }
                }}
                style={{
                  minHeight: '24px',
                  maxHeight: '120px',
                }}
                rows={1}
              />
            </div>
            
            {/* Expand icon */}
            {isAtMaxHeight && (
              <div className="absolute top-4 right-4">
                <button 
                  onClick={handleExpandClick}
                  className="text-white opacity-60 hover:opacity-100 transition-opacity"
                >
                  <CustomIcon name="expand" size={20} />
                </button>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between gap-2">
              <button 
                onClick={handleAttach}
                className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  backdropFilter: 'blur(10.67px)',
                }}
              >
                <CustomIcon name="attach" size={24} className="text-white" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() && !selectedDocument}
                className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  backdropFilter: 'blur(10.67px)',
                }}
              >
                <CustomIcon name="send" size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
} 