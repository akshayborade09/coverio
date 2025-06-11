import { useEffect, useState } from 'react'

export function useFullscreen() {
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      
      // Clear existing timeout
      clearTimeout(scrollTimeout)
      
      // Hide browser UI when scrolling
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        // For desktop browsers
        try {
          document.documentElement.requestFullscreen()
        } catch (e) {
          // Silently fail if fullscreen is not supported
        }
      }
      
      // Reset scrolling state after scroll ends
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const handleTouchMove = () => {
      // Force browser UI to hide on mobile
      if (window.scrollY > 50) {
        window.scrollTo(0, window.scrollY + 1)
        setTimeout(() => window.scrollTo(0, window.scrollY - 1), 0)
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleTouchMove)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return { isScrolling }
} 