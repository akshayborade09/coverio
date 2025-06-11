"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"

interface BottomNavigationProps {
  inputValue?: string
  setInputValue?: (value: string) => void
}

export default function BottomNavigation({ inputValue = "", setInputValue }: BottomNavigationProps) {
  const pathname = usePathname()
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [previousHeight, setPreviousHeight] = useState<string>("24px")
  const [wasAtMaxHeight, setWasAtMaxHeight] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const navItems = [
    {
      href: "/",
      icon: "home",
      label: "Home",
      isCircular: true,
    },
    {
      href: "/cover-letter",
      icon: "cover-letter",
      label: "Cover letter",
      isCircular: false,
    },
    {
      href: "/my-space",
      icon: "my-space",
      label: "My Space",
      isCircular: false,
    }
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
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
  if (isFullScreen && pathname === "/") {
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
              className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
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
              className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
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
      {/* Progressive gradient and blur overlay from bottom */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40">
        {/* Progressive blur layers from bottom (12px) to top (0px) */}
        {Array.from({ length: 12 }, (_, i) => (
          <div 
            key={i}
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${(i + 1) * 1}vh`,
              background: `linear-gradient(to top, rgba(0,0,0,${1 - (i * 0.08)}) 0%, rgba(0,0,0,0) 100%)`,
              backdropFilter: `blur(${12 - i}px)`,
              WebkitBackdropFilter: `blur(${12 - i}px)`,
            }}
          />
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 z-50">
        {/* Chat Input Box - Only show on home page */}
        {pathname === "/" && (
          <div className="mb-4">
            <div className="bg-[#000000] outline outline-1 outline-offset-[-0.50px] outline-white/10 rounded-3xl p-4 w-full relative">
              {/* Text Input Area */}
              <div className="mb-4">
                <textarea
                  ref={textareaRef}
                  placeholder="Write something about yourself"
                  className="chat-textarea bg-transparent border-none outline-none w-full text-white text-base font-sans font-normal leading-6 placeholder:text-white placeholder:opacity-40 resize-none overflow-hidden"
                  value={inputValue}
                  onChange={(e) => setInputValue?.(e.target.value)}
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
                  className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                    boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                    borderRadius: '44.45px',
                    // outline: '2px rgba(255, 255, 255, 0.20) solid',
                    outlineOffset: '-2px',
                    backdropFilter: 'blur(10.67px)',
                  }}
                >
                  <CustomIcon name="attach" size={24} className="text-white" />
                </button>
                <button 
                  className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                    boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                    borderRadius: '44.45px',
                    // outline: '2px rgba(255, 255, 255, 0.20) solid',
                    outlineOffset: '-2px',
                    backdropFilter: 'blur(10.67px)',
                  }}
                >
                  <CustomIcon name="send" size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div 
          className="p-[1px] rounded-[991.36px] inline-flex w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.2) 60%)',
          }}
        >
          <div 
            className="w-full p-2 bg-gradient-to-br from-white/10 via-gray-200/10 to-stone-300/10 rounded-[991.36px] shadow-[0px_1.982710838317871px_47.585060119628906px_-1.982710838317871px_rgba(0,0,0,0.18)] backdrop-blur-xl inline-flex justify-start items-center gap-1.5 overflow-hidden"
          >
            {navItems.map((item) => {
              const active = isActive(item.href)
              
              if (item.isCircular) {
                // Home button - circular design with active/inactive states
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-12 h-12 p-3 rounded-full flex justify-center items-center"
                    style={{
                      background: active 
                        ? 'linear-gradient(137deg, rgba(255, 255, 255, 0.77) 0%, rgba(113.69, 113.69, 113.69, 0.62) 95%)'
                        : 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                      boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                      borderRadius: '44.45px',
                      outline: active 
                        ? 'none'
                        : '1px rgba(255, 255, 255, 0.10) solid',
                      outlineOffset: active ? '-2px' : '-1px',
                      backdropFilter: 'blur(10.67px)',
                    }}
                  >
                    <CustomIcon name={item.icon} size={24} className="text-white" />
                  </Link>
                )
              } else {
                // Other buttons - rectangular design with active/inactive states
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex-1 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
                    style={{
                      background: active 
                        ? 'linear-gradient(137deg, rgba(255, 255, 255, 0.77) 0%, rgba(113.69, 113.69, 113.69, 0.62) 95%)'
                        : 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                      boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                      borderRadius: '44.45px',
                      outline: active 
                        ? 'none'
                        : '1px rgba(255, 255, 255, 0.10) solid',
                      outlineOffset: active ? '-2px' : '-1px',
                      backdropFilter: 'blur(10.67px)',
                    }}
                  >
                    <CustomIcon name={item.icon} size={24} className="text-white" />
                    <div 
                      className="text-center flex justify-center flex-col text-white"
                      style={{
                        fontSize: '14.43px',
                        fontWeight: '510',
                        lineHeight: '22.02px',
                      }}
                    >
                      {item.label}
                    </div>
                  </Link>
                )
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
} 