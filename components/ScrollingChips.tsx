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
                  background: 'linear-gradient(15deg, rgba(255,255,255,0.06) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
                  boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)'
                }}
              >
                <span className="text-white opacity-70 text-sm font-medium font-open-sauce">
                  {chip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 