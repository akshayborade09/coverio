import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight
      const progress = Math.min((scrollPosition / maxScroll) * 100, 100)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getBlurAmount = () => {
    // Smooth transition between blur values
    if (scrollProgress <= 30) {
      // Linear interpolation between 12px and 8px from 0% to 30%
      return 12 - (scrollProgress / 30) * 4
    } else if (scrollProgress <= 75) {
      // Linear interpolation between 8px and 0px from 30% to 75%
      return 8 - ((scrollProgress - 30) / 45) * 8
    }
    return 0
  }

  const blurAmount = getBlurAmount()

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-[var(--blur-amount)]" 
      style={{ 
        '--blur-amount': `${blurAmount}px`,
        maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Coverio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/chat"
              className={`text-sm font-medium ${
                pathname === '/chat'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Chat
            </Link>
            <Link
              href="/history"
              className={`text-sm font-medium ${
                pathname === '/history'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              History
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/chat"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/chat'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              href="/history"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/history'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              History
            </Link>
          </div>
        </div>
      )}
    </header>
  )
} 