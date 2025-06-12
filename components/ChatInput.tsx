"use client"

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import CustomIcon from './CustomIcon'

interface ChatInputProps {
  inputValue?: string
  setInputValue?: (value: string) => void
  onChatInputFocus?: (focused: boolean) => void
}

export default function ChatInput({ inputValue = "", setInputValue, onChatInputFocus }: ChatInputProps) {
  const pathname = usePathname()
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [previousHeight, setPreviousHeight] = useState<string>("24px")
  const [wasAtMaxHeight, setWasAtMaxHeight] = useState(false)
  const [isChatFocused, setIsChatFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Only show on home page
  if (pathname !== "/") {
    return null
  }

  const handleExpandClick = () => {
    // Save current state before expanding
    if (textareaRef.current) {
      setPreviousHeight(textareaRef.current.style.height || "24px")
    }
    setWasAtMaxHeight(isAtMaxHeight)
    setIsFullScreen(true)
  }

  const handleCollapseClick = () => {
    setIsFullScreen(false)
    // Restore textarea height after a short delay
    setTimeout(() => {
      if (textareaRef.current && previousHeight !== "24px") {
        textareaRef.current.style.height = previousHeight
        setIsAtMaxHeight(wasAtMaxHeight)
        // Scroll to bottom to show the last line of content
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
      }
    }, 100)
  }

  // Full-screen chat input
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Full-screen textarea */}
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
              placeholder="Write something about yourself"
              className="bg-transparent border-none outline-none w-full h-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none"
              value={inputValue}
              onChange={(e) => setInputValue?.(e.target.value)}
            />
          </div>
          
          {/* Attach and Send buttons above keyboard */}
          <div className="flex justify-between gap-2 px-4 pb-4" style={{ paddingBottom: '16px' }}>
            <button 
              className="w-16 h-16 p-3 rounded-full flex justify-center items-center gap-1.5"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outlineOffset: '-2px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="attach" size={24} className="text-white" />
            </button>
            <button 
              className="w-16 h-16 p-3 rounded-full flex justify-center items-center gap-1.5"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outlineOffset: '-2px',
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
      {/* Background overlay to fill empty space */}
      <div 
        className="fixed left-0 right-0 pointer-events-none z-20" 
        style={{ 
          bottom: 0, 
          height: 'calc(100px + 20vh)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)'
        }}
      />
      
      {/* Progressive gradient and blur overlay from bottom */}
      <div className="fixed left-0 right-0 pointer-events-none z-30" style={{ bottom: '88px' }}>
        {/* Progressive blur layers from bottom (12px) to top (0px) */}
        {Array.from({ length: 8 }, (_, i) => (
          <div 
            key={i}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${(i + 1) * 1}vh`,
              background: `linear-gradient(to top, rgba(0,0,0,${1 - (i * 0.08)}) 0%, rgba(0,0,0,0) 100%)`,
              backdropFilter: `blur(${8 - i}px)`,
              WebkitBackdropFilter: `blur(${8 - i}px)`,
            }}
          />
        ))}
      </div>
      
      <div 
        className="fixed left-0 right-0 px-4 z-40 transition-all duration-300 ease-in-out" 
        style={{ 
          bottom: isChatFocused ? '16px' : 'calc(88px + 12px)' 
        }}
      >
        {/* Chat Input Box */}
        <div className="mb-0">
          <div className="bg-[#000000] outline outline-1 outline-offset-[-0.50px] outline-white/10 rounded-3xl p-4 w-full relative">
            {/* Text Input Area */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                placeholder="Write something about yourself"
                className="chat-textarea bg-transparent border-none outline-none w-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none overflow-hidden"
                value={inputValue}
                onChange={(e) => setInputValue?.(e.target.value)}
                onFocus={() => {
                  setIsChatFocused(true)
                  onChatInputFocus?.(true)
                }}
                onBlur={() => {
                  setIsChatFocused(false)
                  onChatInputFocus?.(false)
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const scrollHeight = target.scrollHeight;
                  const maxHeight = 6 * 24; // 5 lines * 24px line-height + 1 line buffer
                  const newHeight = Math.min(scrollHeight, maxHeight);
                  target.style.height = newHeight + 'px';
                  
                  // Check if we're at max height
                  const atMaxHeight = scrollHeight > maxHeight;
                  setIsAtMaxHeight(atMaxHeight);
                  
                  // Update previous height for state restoration
                  if (!isFullScreen) {
                    setPreviousHeight(newHeight + 'px');
                    setWasAtMaxHeight(atMaxHeight);
                  }
                }}
                style={{
                  minHeight: '24px',
                  maxHeight: '120px', // 5 lines * 24px line-height
                }}
                rows={1}
              />
            </div>
            
            {/* Expand icon - show when at max height */}
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
            
            {/* Icons Area */}
            <div className="flex justify-between gap-2">
              <button 
                className="w-16 h-16 p-3 rounded-full flex justify-center items-center gap-1.5"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  outlineOffset: '-2px',
                  backdropFilter: 'blur(10.67px)',
                }}
              >
                <CustomIcon name="attach" size={24} className="text-white" />
              </button>
              <button 
                className="w-16 h-16 p-3 rounded-full flex justify-center items-center gap-1.5"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  outlineOffset: '-2px',
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