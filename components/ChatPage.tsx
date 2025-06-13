import { useEffect, useRef, useState } from 'react'

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus()

    // Handle keyboard visibility
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (!visualViewport) return

      // On iOS, when the keyboard appears, it reduces the visual viewport height
      const isKeyboardOpen = visualViewport.height < window.innerHeight
      setIsKeyboardVisible(isKeyboardOpen)

      if (isKeyboardOpen && inputRef.current) {
        // Scroll the input into view when keyboard appears
        inputRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add your chat messages here */}
      </div>

      {/* Input area - fixed at bottom but moves above keyboard */}
      <div 
        className="w-full p-4 bg-gray-800 transition-all duration-300"
        style={{
          position: 'fixed',
          bottom: isKeyboardVisible ? window.visualViewport?.height : 0,
          left: 0,
          right: 0,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none"
            placeholder="Type your message..."
            rows={3}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(15deg, rgba(255,255,255,0.06) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
        </div>
      </div>
    </div>
  )
} 