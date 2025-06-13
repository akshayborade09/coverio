import { useEffect, useRef, useState } from 'react'

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    // Focus the input field when the component mounts
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    // Handle keyboard visibility
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (!visualViewport) return

      // On mobile, when the keyboard appears, it reduces the visual viewport height
      const isKeyboardOpen = visualViewport.height < window.innerHeight
      setIsKeyboardVisible(isKeyboardOpen)

      if (isKeyboardOpen && inputRef.current) {
        // Ensure the input is visible above the keyboard
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = () => {
    const link = inputRef.current?.value
    if (link) {
      // Process the link
      console.log('Submitted link:', link)
      window.history.back()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 flex items-center gap-4">
        <button 
          onClick={() => window.history.back()}
          className="text-white opacity-70 hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium">Add Link</h1>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-32">
        {/* Add your chat content here */}
      </div>

      {/* Input area - fixed at bottom but moves above keyboard */}
      <div 
        className="fixed left-0 right-0 bottom-0 p-4 bg-gray-800 transition-all duration-300"
        style={{
          transform: `translateY(${isKeyboardVisible ? '-50vh' : '0'})`,
          zIndex: 1000,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            className="w-full p-4 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your link here..."
            rows={3}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(15deg, rgba(255,255,255,0.06) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
          <div className="mt-2 flex justify-end">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSubmit}
            >
              Add Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 