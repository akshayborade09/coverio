"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
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

interface ChatSession {
  id: string;
  prompt: string;
  date: string;
  documents: DocumentData[];
  type: string;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  documents?: DocumentData[];
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromSource = searchParams?.get('from') // 'write' or 'document'
  const topic = searchParams?.get('topic')
  
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentData[]>([])
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [previousHeight, setPreviousHeight] = useState<string>("24px")
  const [wasAtMaxHeight, setWasAtMaxHeight] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLDivElement>(null)

  const ALLOWED_FILE_TYPES = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
  };

  const isValidFileType = (file: File) => {
    return Object.keys(ALLOWED_FILE_TYPES).includes(file.type);
  };

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

  useEffect(() => {
    // Update viewport height on mount and resize
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Handle keyboard visibility
  useEffect(() => {
    const handleFocus = () => {
      setIsKeyboardVisible(true);
    };

    const handleBlur = () => {
      setIsKeyboardVisible(false);
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('focus', handleFocus);
      textarea.addEventListener('blur', handleBlur);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('focus', handleFocus);
        textarea.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const handleBack = () => {
    router.push('/')
  }

  const handleAttach = () => {
    // Check if already at limit before opening file picker
    if (selectedDocuments.length >= 1) {
      setErrorMessage('Only 1 attachment allowed')
      setShowErrorToast(true)
      setTimeout(() => setShowErrorToast(false), 2000)
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files) as File[]
      
      // Check if adding these files would exceed the limit
      if (selectedDocuments.length + newFiles.length > 1) {
        setErrorMessage('Only 1 attachment allowed')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 2000)
        return
      }
      
      // Process the file
      const file = newFiles[0] as File // Only take the first file
      if (!file) return

      // Validate file type
      if (!isValidFileType(file)) {
        setErrorMessage('Invalid file type. Allowed types: PDF, JPG, PNG, Word, Excel')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 2000)
        return
      }

        // Create thumbnail for image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
          const newDoc: DocumentData = {
              name: file.name,
              size: file.size,
              type: file.type,
              file: file,
              thumbnailUrl: e.target?.result as string
            }
          setSelectedDocuments([newDoc]) // Replace any existing document
          }
          reader.readAsDataURL(file)
        } else {
          // For non-image files (PDF, DOC, etc.)
        const newDoc: DocumentData = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
          }
        setSelectedDocuments([newDoc]) // Replace any existing document
        }
      
      // Focus on text input after document upload
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
    }
  }

  const handleRemoveDocument = (index: number) => {
    setSelectedDocuments((prev: DocumentData[]) => prev.filter((_, i: number) => i !== index))
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Allow sending if either there's text or documents
    if (!inputValue.trim() && selectedDocuments.length === 0) return

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      documents: selectedDocuments
    }
    
    setMessages([...messages, newMessage])
    setInputValue("")
    setIsTyping(false)

    // Remove documents after sending
    if (selectedDocuments.length > 0) {
      setSelectedDocuments([])
    }

    // Reset input box size
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'
    }
    setIsAtMaxHeight(false)
    setIsFullScreen(false)
    setPreviousHeight('24px')

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          documents: selectedDocuments
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setErrorMessage("Failed to send message. Please try again.")
      setShowErrorToast(true)
      setTimeout(() => setShowErrorToast(false), 3000)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
    // Optionally focus the input
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
    if (inputElement) {
      inputElement.focus()
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

  const renderMessageDocument = (document: DocumentData) => {
    return (
      <div 
        className="relative overflow-hidden rounded-xl"
        style={{ 
          width: '64px', 
          height: '64px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {renderDocumentThumbnail(document)}
      </div>
    )
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
        className="hidden"
      />
      
      {/* Fixed Background */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)',
          zIndex: 0
        }}
      />
      
      <div className="flex flex-col h-[100dvh] text-[#ffffff] relative overflow-hidden">
        {/* Fixed Header */}
        <div 
          className="fixed top-0 left-0 right-0 z-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.85) 100%)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
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
        </div>

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        {/* Empty State Content - Fixed in viewport */}
        {messages.length === 0 && (
          <div 
            className="fixed inset-x-0 z-10"
            style={{
              top: '120px',
              bottom: '120px', // Above input
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'top 0.3s ease-out'
            }}
          >
            <h1 className="text-2xl text-white mb-2 font-playfair text-center">
              Need a document? Just ask.
            </h1>
            <p className="text-white opacity-70 font-open-sauce text-center">
              Our AI agent creates it instantly
            </p>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div
          className="flex-1 overflow-y-auto relative z-10"
          ref={messagesContainerRef}
        >
          {/* Messages Area */}
          {messages.length > 0 && (
            <div className="px-4 py-4 space-y-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[80%]">
                    {message.isUser && message.documents && message.documents.length > 0 && (
                      <div className="flex justify-end mb-2">
                        {message.documents.map((doc, idx) => (
                          <div key={idx}>
                            {renderMessageDocument(doc)}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.content && (
                      <div 
                        className={`rounded-3xl p-3 text-sm ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
                        style={{
                          wordBreak: 'break-word'
                        }}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Sentinel div to keep scroll anchor at the bottom */}
              <div style={{ height: '1px' }} />
            </div>
          )}
        </div>

        {/* Fixed Input Area */}
        <div 
          className="flex-none p-4 relative z-10"
          ref={chatInputRef}
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0) 100%)',
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
                  {selectedDocuments.map((document: DocumentData, index: number) => (
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
                  setIsTyping(e.target.value.trim().length > 0)
                }}
                onFocus={() => {
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                  if (isMobile) {
                    setTimeout(() => {
                      chatInputRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end' 
                      })
                    }, 300)
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
                disabled={selectedDocuments.length >= 1}
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