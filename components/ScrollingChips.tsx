import { useEffect, useRef, useState } from 'react'

interface ScrollingChipsProps {
  onChipClick: (chip: string) => void
  onFileSelect?: (file: File) => void
}

const CHIPS = [
  'Company Research',
  'Cover Letter',
  'Elevator Pitches',
  'Career Journey Narrative',
  'Interviewer Research',
  'Strength & Weakness',
  'See yourself in 5 years',
  'Q&A for interviews',
  'Last-Minute Revision'
]

export default function ScrollingChips({ onChipClick, onFileSelect }: ScrollingChipsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const scrollPosition = useRef(0)
  const dragStartX = useRef(0)
  const dragStartScroll = useRef(0)
  const animationFrame = useRef<number>()

  const updateScroll = (newPosition: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const maxScroll = container.scrollWidth - container.clientWidth
    
    // Normalize the position to stay within bounds
    if (newPosition < 0) {
      newPosition = maxScroll / 3
    } else if (newPosition > maxScroll) {
      newPosition = maxScroll / 3
    }

    scrollPosition.current = newPosition
    container.scrollLeft = newPosition
  }

  const animate = () => {
    if (!isHovered && !isDragging && scrollContainerRef.current) {
      const scrollSpeed = 0.3
      updateScroll(scrollPosition.current + scrollSpeed)
    }
    animationFrame.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Initialize scroll position to middle section
    const initialPosition = container.scrollWidth / 3
    updateScroll(initialPosition)

    // Start animation
    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  const handleDragStart = (clientX: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    setIsDragging(true)
    dragStartX.current = clientX
    dragStartScroll.current = scrollPosition.current
  }

  const handleDragMove = (clientX: number) => {
    const container = scrollContainerRef.current
    if (!isDragging || !container) return

    const diff = dragStartX.current - clientX
    const newPosition = dragStartScroll.current + diff
    updateScroll(newPosition)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleDragMove(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    handleDragMove(e.touches[0].clientX)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileSelect) {
      onFileSelect(file)
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddLink = () => {
    window.location.href = '/chat?from=portfolio'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      <div 
        ref={scrollContainerRef}
        className="w-[100vw] overflow-x-hidden relative left-[50%] -translate-x-1/2 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsDragging(false)
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleDragEnd}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'pan-x'
        }}
      >
        <div className="flex gap-2 py-2" style={{ width: 'max-content', paddingInline: '5vw' }}>
          {[...CHIPS, ...CHIPS, ...CHIPS].map((chip, index) => (
            <div 
              key={`${chip}-${index}`}
              onClick={() => !isDragging && onChipClick(chip)}
              className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div 
                className="py-3 px-4 rounded-[76.948px]"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'linear-gradient(15deg, rgba(255,255,255,0.04) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
                  boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)'
                }}
              >
                <span style={{ 
                  fontSize: '14px',
                  fontFamily: '"Open Sauce One", "Inter", sans-serif',
                  fontWeight: 500,
                  color: '#ffffff',
                  opacity: 0.7,
                }}>
                  {chip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 py-3 px-6 rounded-[76.948px] transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'linear-gradient(15deg, rgba(255,255,255,0.06) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
            boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 2V9H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15L12 18L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ 
            fontSize: '14px',
            fontFamily: '"Open Sauce One", "Inter", sans-serif',
            fontWeight: 500,
            color: '#ffffff',
            opacity: 0.7,
          }}>
            Upload Document
          </span>
        </button>

        <button
          onClick={handleAddLink}
          className="flex items-center gap-2 py-3 px-6 rounded-[76.948px] transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'linear-gradient(15deg, rgba(255,255,255,0.06) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
            boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 16H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 8H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ 
            fontSize: '14px',
            fontFamily: '"Open Sauce One", "Inter", sans-serif',
            fontWeight: 500,
            color: '#ffffff',
            opacity: 0.7,
          }}>
            Add Link
          </span>
        </button>
      </div>
    </div>
  )
} 