import { useEffect, useState } from 'react'

export function useFullscreen() {
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let isScrollingDown = false
    let lastScrollY = 0

    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    const isChrome = () => {
      return /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent)
    }

    const hideChromeUI = () => {
      if (isMobile() && isChrome()) {
        // Method 1: Trigger minimal-ui behavior through viewport manipulation
        const viewport = document.querySelector('meta[name=viewport]')
        if (viewport) {
          const currentContent = viewport.getAttribute('content') || ''
          if (!currentContent.includes('minimal-ui')) {
            viewport.setAttribute('content', currentContent + ', minimal-ui')
          }
        }

        // Method 2: Use scroll momentum to force UI hiding
        if (window.scrollY > 0) {
          // Small scroll to trigger Chrome's auto-hide behavior
          window.scrollBy(0, 1)
          setTimeout(() => window.scrollBy(0, -1), 0)
        }

        // Method 3: Force minimum height to be larger than viewport
        document.body.style.minHeight = `${window.innerHeight + 1}px`
        
        // Method 4: Request fullscreen for supported browsers
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          try {
            document.documentElement.requestFullscreen()
          } catch (e) {
            // Silently fail if fullscreen is not supported
          }
        }
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      isScrollingDown = currentScrollY > lastScrollY
      lastScrollY = currentScrollY

      setIsScrolling(true)
      
      // Clear existing timeout
      clearTimeout(scrollTimeout)
      
      // Hide browser UI when scrolling down
      if (isScrollingDown && currentScrollY > 10) {
        hideChromeUI()
      }
      
      // Reset scrolling state after scroll ends
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const handleTouchStart = () => {
      // Prepare for potential UI hiding on touch
      if (isMobile() && window.scrollY > 0) {
        hideChromeUI()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Force browser UI to hide on mobile during scroll
      if (isMobile() && window.scrollY > 20) {
        hideChromeUI()
        
        // Additional technique: brief scroll adjustment
        const touch = e.touches[0]
        if (touch) {
          requestAnimationFrame(() => {
            window.scrollBy(0, 0.1)
            setTimeout(() => window.scrollBy(0, -0.1), 0)
          })
        }
      }
    }

    const handleResize = () => {
      // Update minimum height on resize (orientation change)
      if (isMobile()) {
        document.body.style.minHeight = `${window.innerHeight + 1}px`
      }
    }

    const handleFocus = () => {
      // When page gains focus, ensure UI is hidden
      setTimeout(() => {
        if (isMobile() && window.scrollY > 0) {
          hideChromeUI()
        }
      }, 100)
    }

    // Initialize mobile optimizations
    if (isMobile()) {
      // Set initial minimum height
      document.body.style.minHeight = `${window.innerHeight + 1}px`
      
      // Initial UI hide attempt
      setTimeout(hideChromeUI, 100)
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('focus', handleFocus, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('focus', handleFocus)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return { isScrolling }
} 