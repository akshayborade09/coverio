'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const RotateIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    {/* Phone outline */}
    <rect
      x="6"
      y="2"
      width="12"
      height="20"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    {/* Screen */}
    <rect
      x="7"
      y="4"
      width="10"
      height="16"
      rx="1"
      fill="currentColor"
      opacity="0.3"
    />
    {/* Rotation arrows */}
    <path
      d="M2 8C2 4.68629 4.68629 2 8 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
    <path
      d="M22 16C22 19.3137 19.3137 22 16 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-pulse"
    />
    {/* Arrow heads */}
    <path
      d="M8 2L6 4L8 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    />
    <path
      d="M16 22L18 20L16 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    />
  </svg>
)

const MobileIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    {/* Phone outline */}
    <rect
      x="6"
      y="2"
      width="12"
      height="20"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    {/* Screen */}
    <rect
      x="7"
      y="4"
      width="10"
      height="16"
      rx="1"
      fill="currentColor"
      opacity="0.3"
    />
    {/* Signal bars */}
    <path
      d="M20 8V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 12V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 16V14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default function LandscapeMessage() {
  const [isLandscape, setIsLandscape] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
    
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const isLandscapeMode = window.innerWidth > window.innerHeight
        console.log('Orientation check:', {
          width: window.innerWidth,
          height: window.innerHeight,
          isLandscape: isLandscapeMode,
          isMobile: isMobile
        })
        setIsLandscape(isLandscapeMode)
      }
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [isMobile])

  // For testing - show the message if you add ?test=landscape or ?test=desktop to the URL
  const isTestMode = typeof window !== 'undefined' && (
    window.location.search.includes('test=landscape') || 
    window.location.search.includes('test=desktop')
  )

  console.log('LandscapeMessage render:', {
    mounted,
    isMobile,
    isLandscape,
    isTestMode,
    shouldShow: isTestMode || (isMobile && isLandscape) || (!isMobile)
  })

  // Show in test mode or when conditions are met
  if (!mounted) return null
  
  // Show on desktop (non-mobile) or mobile in landscape, or in test mode
  const shouldShow = isTestMode || (isMobile && isLandscape) || (!isMobile)
  
  if (!shouldShow) {
    return null
  }

  // Determine which message to show
  const isDesktopMessage = !isMobile || (isTestMode && window.location.search.includes('test=desktop'))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-white/10 p-8 text-center backdrop-blur-md max-w-sm mx-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          {isDesktopMessage ? <MobileIcon /> : <RotateIcon />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {isDesktopMessage ? 'Open on Mobile' : 'Rotate Your Device'}
          </h3>
          <p className="text-sm text-white/80">
            {isDesktopMessage 
              ? 'For a better experience, please open this app on your mobile device'
              : 'For a better experience, please rotate your device to portrait mode'
            }
          </p>
          {isTestMode && (
            <p className="text-xs text-white/60">
              Test mode - add ?test=landscape or ?test=desktop to URL
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 