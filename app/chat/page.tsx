"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"
import FileCard from "@/components/FileCard"

interface DocumentData {
  name: string
  size: number
  type: string
  file?: File
  thumbnailUrl?: string
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSource = searchParams?.get('from') // 'write' or 'document'
  const topic = searchParams?.get('topic')
  
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Array<{id: string, content: string, isUser: boolean}>>([])
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentData[]>([])
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [previousHeight, setPreviousHeight] = useState<string>("24px")
  const [wasAtMaxHeight, setWasAtMaxHeight] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLDivElement>(null)

  // Track if we've already created a session for this chat
  const [sessionCreated, setSessionCreated] = useState(false);

  useEffect(() => {
    // Check if coming from document upload
    if (fromSource === 'document') {
      const docData = localStorage.getItem('selectedDocument')
      if (docData) {
        try {
          const parsedDoc = JSON.parse(docData)
          setSelectedDocuments([parsedDoc])
          localStorage.removeItem('selectedDocument')
        } catch (error) {
          console.error('Error parsing document data:', error)
        }
      }
    }

    // Check if coming from chip selection
    const selectedChip = localStorage.getItem('selectedChip')
    if (selectedChip) {
      setInputValue(selectedChip)
      localStorage.removeItem('selectedChip')
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }

    // If coming from write-own or write-your-own, clear and focus input
    if (fromSource === 'write-own' || fromSource === 'write-your-own') {
      setInputValue("")
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }

    // Handle keyboard visibility and input positioning
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (!visualViewport) return

      const isKeyboardOpen = visualViewport.height < window.innerHeight
      setIsKeyboardVisible(isKeyboardOpen)

      if (isKeyboardOpen && chatInputRef.current) {
        // Calculate the distance from bottom of viewport to input
        const inputRect = chatInputRef.current.getBoundingClientRect()
        const distanceFromBottom = window.innerHeight - inputRect.bottom

        // If input is too close to keyboard, scroll it up
        if (distanceFromBottom < 100) {
          const scrollAmount = 100 - distanceFromBottom
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          })
        }
      }
    }

    // Add resize listener for keyboard
    window.visualViewport?.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [fromSource])

  const handleBack = () => {
    router.push('/')
  }

  const handleAttach = () => {
    // Check if already at limit before opening file picker
    if (selectedDocuments.length >= 3) {
      setErrorMessage('Only 3 attachments allowed')
      setShowErrorToast(true)
      setTimeout(() => setShowErrorToast(false), 2000)
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      
      // Check if adding these files would exceed the limit
      if (selectedDocuments.length + newFiles.length > 3) {
        setErrorMessage('Only 3 attachments allowed')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 2000)
        return
      }
      
      // Process each file
      newFiles.forEach(file => {
        // Create thumbnail for image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const newDoc = {
              name: file.name,
              size: file.size,
              type: file.type,
              file: file,
              thumbnailUrl: e.target?.result as string
            }
            setSelectedDocuments(prev => [...prev, newDoc])
          }
          reader.readAsDataURL(file)
        } else {
          // For non-image files (PDF, DOC, etc.)
          const newDoc = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
          }
          setSelectedDocuments(prev => [...prev, newDoc])
        }
      })
      
      // Focus on text input after document upload
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
    }
  }

  const handleRemoveDocument = (index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index))
  }

  // Helper to add or update a chat session in localStorage and move it to the top
  function upsertChatSessionInHistory(session) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    // Remove any existing session with the same id
    const filtered = history.filter((s) => s.id !== session.id);
    // Add updated session to the top
    filtered.unshift(session);
    localStorage.setItem('chatHistory', JSON.stringify(filtered));
  }

  const handleSend = () => {
    if (inputValue.trim() || selectedDocuments.length > 0) {
      let sessionId = '';
      if ((fromSource === 'write-own' || fromSource === 'write-your-own')) {
        // Use the same session id if already created, else new
        if (!sessionCreated) {
          sessionId = Date.now().toString();
          setSessionCreated(true);
        } else {
          // Find the latest session id from localStorage
          const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          sessionId = history.length > 0 ? history[0].id : Date.now().toString();
        }
      } else {
        // For other chat types, use a generic id (could be improved for multi-session)
        sessionId = 'default';
      }
      // Always upsert the session on every send
      const newSession = {
        id: sessionId,
        prompt: inputValue.trim() || 'Write something about yourself',
        date: new Date().toISOString(),
        documents: selectedDocuments,
        type: fromSource || 'chat',
      };
      upsertChatSessionInHistory(newSession);
      const newMessage = {
        id: Date.now().toString(),
        content: inputValue.trim(),
        isUser: true
      }
      setMessages(prev => [...prev, newMessage])
      setInputValue("")
      setIsTyping(false)
      
      // Remove documents after sending
      if (selectedDocuments.length > 0) {
        setSelectedDocuments([])
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

  const renderDocumentThumbnail = (document: DocumentData) => {
    // For images, show the actual image thumbnail
    if (document.type.startsWith('image/') && document.thumbnailUrl) {
      return (
        <img
          src={document.thumbnailUrl}
          alt={document.name}
          className="w-full h-full object-cover rounded-lg"
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'cover'
          }}
        />
      )
    }

    // For PDF files, show PDF thumbnail
    if (document.type.includes('pdf')) {
      return (
        <div 
          className="w-full h-full rounded-lg flex items-center justify-center text-white"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#FF3B3B'
          }}
        >
          <div className="text-lg font-bold">PDF</div>
        </div>
      )
    }

    // For DOC files, show DOC thumbnail
    if (document.type.includes('doc') || document.type.includes('word')) {
      return (
        <div 
          className="w-full h-full rounded-lg flex items-center justify-center text-white"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#3BADFF'
          }}
        >
          <div className="text-lg font-bold">DOC</div>
        </div>
      )
    }

    // Default file thumbnail
    return (
      <div 
        className="w-full h-full rounded-lg flex flex-col items-center justify-center text-white bg-gray-600"
        style={{
          width: '64px',
          height: '64px'
        }}
      >
        <CustomIcon name="file" size={24} className="mb-1" />
        <div className="text-xs opacity-80 text-center px-1 leading-tight">
          {document.name.length > 8 
            ? document.name.substring(0, 8) + '..' 
            : document.name}
        </div>
      </div>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Determine placeholder based on source
  let chatPlaceholder = "Add context about your document";
  if (fromSource === 'write-own' || fromSource === 'write-your-own') {
    chatPlaceholder = "Write something about yourself";
  } else if (fromSource === 'write') {
    chatPlaceholder = "Write your own information";
  } else if (fromSource === 'portfolio') {
    chatPlaceholder = "Enter your portfolio URL or share details about your work";
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
          
          {/* Document Preview at top - Full size */}
          {selectedDocuments.length > 0 && (
            <div className="px-4 mb-4">
              <div className="flex gap-3 flex-wrap">
                {selectedDocuments.map((document, index) => (
                  <div key={index} className="relative inline-block">
                    <div 
                      className="relative overflow-hidden rounded-xl"
                      style={{ 
                        width: '64px', 
                        height: '64px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {renderDocumentThumbnail(document)}
                      
                      {/* Cancel button */}
                      <div 
                        className="absolute top-0 right-0"
                        style={{ 
                          zIndex: 10,
                          padding: '2px'
                        }}
                      >
                        <button
                          onClick={() => handleRemoveDocument(index)}
                          className="flex items-center justify-center"
                        >
                          <CustomIcon name="cancel-attach" size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* File info below thumbnail */}
                    <div className="mt-2 max-w-[64px]">
                      <div className="text-xs text-white opacity-60 text-center leading-tight truncate">
                        {document.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Expandable textarea area */}
          <div className="flex-1 px-4 mb-3">
            <textarea
              ref={textareaRef}
              placeholder={chatPlaceholder}
              className="bg-transparent border-none outline-none w-full h-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                // Update typing state based on input content
                setIsTyping(e.target.value.trim().length > 0)
              }}
            />
          </div>
          
          {/* Attach and Send buttons */}
          <div className="flex justify-between gap-2 px-4 pb-4">
            <button 
              onClick={handleAttach}
              disabled={selectedDocuments.length >= 3}
              className="w-10` h-10 p-3 rounded-full flex justify-center items-center gap-1.5 disabled:opacity-50"
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
              disabled={!inputValue.trim() && selectedDocuments.length === 0}
              className="w-10 h-10 p-3 rounded-full flex justify-center items-center gap-1.5 disabled:opacity-50"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="send" size={24} className="text-white" />
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
        multiple
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
        <div 
          className="p-4 "
          ref={chatInputRef}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transform: isKeyboardVisible ? 'translateY(-20px)' : 'translateY(0)',
            transition: 'transform 0.3s ease-out',
            zIndex: 50
          }}
        >
          <div 
            className="rounded-3xl p-3 w-full relative"
            style={{
              background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.05) 0%, rgba(113.69, 113.69, 113.69, 0.08) 95%)',
              boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
              outline: '1px rgba(255, 255, 255, 0.05) solid',
              outlineOffset: '-1px',
              backdropFilter: 'blur(10.67px)',
            }}
          >
            {/* Document Preview */}
            {selectedDocuments.length > 0 && (
              <div 
                className="transition-all duration-300 overflow-hidden"
                style={{
                  marginBottom: isTyping ? '6px' : '16px',
                  height: isTyping ? `${Math.ceil(72 * 0.4) + 8}px` : 'auto'
                }}
              >
                <div 
                  className="flex gap-3 flex-wrap transition-all duration-300 cursor-pointer"
                  style={{
                    transform: isTyping ? 'scale(0.5)' : 'scale(1)',
                    transformOrigin: 'top left'
                  }}
                  onClick={() => {
                    if (isTyping) {
                      setIsTyping(false)
                      textareaRef.current?.focus()
                    }
                  }}
                >
                  {selectedDocuments.map((document, index) => (
                    <div key={index} className="relative inline-block">
                      <div 
                        className={`relative overflow-hidden ${isTyping ? 'rounded-full' : 'rounded-xl'} transition-all duration-300`}
                        style={{ 
                          width: '64px', 
                          height: '64px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {renderDocumentThumbnail(document)}
                        
                        {/* Cancel button - only show when not typing */}
                        {!isTyping && (
                          <div 
                            className="absolute top-0 right-0"
                            style={{ 
                              zIndex: 10,
                              padding: '2px'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveDocument(index)
                              }}
                              className="flex items-center justify-center"
                            >
                              <CustomIcon name="cancel-attach" size={24} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* File info below thumbnail - hide when typing */}
                                              {!isTyping && (
                          <div className="mt-2 max-w-[64px]">
                            <div className="text-xs text-white opacity-60 text-center leading-tight truncate">
                            {document.name}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input Area */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                placeholder={chatPlaceholder}
                className="bg-transparent border-none outline-none w-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none overflow-hidden"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  // Update typing state based on input content
                  setIsTyping(e.target.value.trim().length > 0)
                }}
                onFocus={() => {
                  // Additional mobile keyboard handling on focus
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                  if (isMobile) {
                    setTimeout(() => {
                      chatInputRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end' 
                      })
                    }, 300) // Delay for keyboard animation
                  }
                }}
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
                disabled={selectedDocuments.length >= 3}
                className="w-10 h-10 p-3 rounded-full flex justify-center items-center gap-1.5 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  backdropFilter: 'blur(10.67px)',
                }}
              >
                <CustomIcon name="attach" size={20} className="text-white" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() && selectedDocuments.length === 0}
                className="w-10 h-10 p-3 rounded-full flex justify-center items-center gap-1.5 disabled:opacity-50"
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

        {/* Error Toast */}
        {showErrorToast && (
          <div 
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0px 4px 20px rgba(255, 107, 107, 0.3)'
            }}
          >
            <div className="text-white text-sm font-medium">
              {errorMessage}
            </div>
          </div>
        )}
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