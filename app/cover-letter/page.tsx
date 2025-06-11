"use client"

import { useState, useEffect, useRef } from "react"
import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import { useFullscreen } from "@/hooks/useFullscreen"

export default function CoverLetterPage() {
  const { isScrolling } = useFullscreen()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState({ title: '', bullets: [''] })
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [bulletToDelete, setBulletToDelete] = useState<number | null>(null)
  const [draggedBullet, setDraggedBullet] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  // Section data
  const sections = {
    'proven-impact': {
      title: 'Proven Impact',
      bullets: [
        '778% user growth and 99% Day 1 retention through strategic design improvements',
        '40% increase in monthly active users and resolved critical Day 0 retention issues',
        '1,500%+ session growth rates by optimizing user flows and engagement patterns',
        'Consistently improved retention across Day 1, Day 7, and Day 30 metrics'
      ]
    },
    'core-strengths': {
      title: 'Core Strengths',
      bullets: [
        'Cross-industry expertise: Mobility, fintech, parenting solutions, and international markets',
        'End-to-end ownership: From strategy and prototyping to developer handoff and metrics analysis',
        'Technical innovation: AI workflows for design-to-code automation and'
      ]
    },
    // ... other sections will be added
  }

  const handleEditSection = (sectionKey: string) => {
    const section = sections[sectionKey as keyof typeof sections]
    if (section) {
      setEditContent({ title: section.title, bullets: [...section.bullets] })
      setEditingSection(sectionKey)
    }
  }

  const handleCloseEditor = () => {
    setEditingSection(null)
    setEditContent({ title: '', bullets: [''] })
  }

  const handleDeleteBullet = (index: number) => {
    setBulletToDelete(index)
    setShowDeleteToast(true)
  }

  const confirmDeleteBullet = () => {
    if (bulletToDelete !== null) {
      const newBullets = editContent.bullets.filter((_, i) => i !== bulletToDelete)
      setEditContent(prev => ({ ...prev, bullets: newBullets }))
    }
    setShowDeleteToast(false)
    setBulletToDelete(null)
  }

  const cancelDeleteBullet = () => {
    setShowDeleteToast(false)
    setBulletToDelete(null)
  }

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent, index: number) => {
    setIsDragging(true)
    setDraggedBullet(index)
    setDragOffset(0)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || draggedBullet === null) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    
    // Only allow left swipe (negative offset)
    const offset = Math.min(0, clientX - dragStartX)
    setDragOffset(Math.max(offset, -60)) // Reduced from -80 to -60
  }

  const handleDragEnd = () => {
    if (dragOffset < -30) { // Reduced threshold from -40 to -30
      // Keep delete button visible if swiped more than 30px
      setDragOffset(-60) // Reduced from -80 to -60
    } else {
      // Reset if not swiped enough
      setDragOffset(0)
      setDraggedBullet(null)
    }
    setIsDragging(false)
  }

  const resetDrag = () => {
    setDragOffset(0)
    setDraggedBullet(null)
    setIsDragging(false)
  }

  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  const handleSummarise = () => {
    showFeedbackMessage('Generating cover letter summary...')
    // Add actual summarise logic here
    console.log('Summarise action triggered')
  }

  const handlePlay = () => {
    showFeedbackMessage('Playing cover letter audio...')
    // Add actual play logic here
    console.log('Play action triggered')
  }

  const handleShare = () => {
    showFeedbackMessage('Opening share options...')
    // Add actual share logic here
    console.log('Share action triggered')
  }

  const handleSectionEdit = (sectionKey: string, sectionTitle: string) => {
    showFeedbackMessage(`Editing ${sectionTitle} section...`)
    handleEditSection(sectionKey)
  }



  useEffect(() => {
    // Enable natural scrolling for cover letter page only
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    const handleTouchStart = () => {
      // Gentle browser UI hiding - only once per session
      if (isMobile && window.scrollY === 0 && !isUserScrolling) {
        window.scrollTo(0, 1)
      }
    }

    const triggerBrowserUIHide = () => {
      // Single gentle scroll on page load only
      if (isMobile && window.scrollY === 0) {
        window.scrollTo(0, 1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    
    // Trigger browser UI hiding only once on page load
    if (isMobile) {
      setTimeout(triggerBrowserUIHide, 500)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [lastScrollY])

  return (
    <div className="cover-letter-page">
      {/* Full-Screen Editor */}
      {editingSection && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Header with Editable Title and Close Button */}
          <div className="flex items-center justify-between gap-4 p-4">
            <input 
              type="text"
              value={editContent.title}
              onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 bg-transparent text-white text-2xl font-serif border-none outline-none opacity-80 placeholder-gray-400"
              placeholder="Section title"
            />
            <button 
              onClick={handleCloseEditor}
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="close" size={20} className="text-[#ffffff]" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Delete Confirmation Toast */}
            {showDeleteToast && (
              <div className="fixed bottom-20 left-4 right-4 z-10">
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                    boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                    outline: '1px rgba(255, 255, 255, 0.10) solid',
                    outlineOffset: '-1px',
                    backdropFilter: 'blur(10.67px)',
                  }}
                >
                  <span className="text-white text-sm font-medium flex-1">Delete the bullet point?</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={confirmDeleteBullet}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full transition-colors"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={cancelDeleteBullet}
                      className="w-6 h-6 flex items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <CustomIcon name="close" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bullet Points Section */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="space-y-4 py-2">
              {editContent.bullets.map((bullet, index) => (
                <div 
                  key={index} 
                  className="relative"
                >
                  {/* Main Bullet Content */}
                  <div 
                    className="flex items-start"
                    style={{
                      transform: draggedBullet === index ? `translateX(${dragOffset}px)` : 'translateX(0px)',
                      backgroundColor: draggedBullet === index ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      borderRadius: draggedBullet === index ? '16px' : '0px',
                      padding: '12px 8px 8px 0px',
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out, background-color 0.2s ease-out, border-radius 0.2s ease-out'
                    }}
                    onTouchStart={(e) => handleDragStart(e, index)}
                    onMouseDown={(e) => handleDragStart(e, index)}
                    onTouchMove={handleDragMove}
                    onMouseMove={isDragging ? handleDragMove : undefined}
                    onTouchEnd={handleDragEnd}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                  >


                    <textarea
                      value={bullet}
                      onChange={(e) => {
                        const newValue = e.target.value
                        const newBullets = [...editContent.bullets]
                        
                        if (newValue === '' && editContent.bullets.length > 1) {
                          // Remove the bullet if it's empty and there are multiple bullets
                          newBullets.splice(index, 1)
                        } else {
                          // Update the bullet content
                          newBullets[index] = newValue
                        }
                        
                        setEditContent(prev => ({ ...prev, bullets: newBullets }))
                      }}
                      onFocus={() => {
                        resetDrag()
                        setIsInputFocused(true)
                      }}
                      onBlur={() => setIsInputFocused(false)}
                      className="flex-1 bg-transparent text-white text-lg font-sans border-none outline-none opacity-80 placeholder-gray-500"
                      placeholder="Bullet point..."
                      style={{
                        resize: 'none',
                        overflow: 'hidden',
                        height: 'auto',
                        minHeight: 'auto'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>

                  {/* Delete Button - Hidden by default, scales in smoothly */}
                  {editContent.bullets.length > 1 && draggedBullet === index && (
                    <div 
                      className="absolute right-0 w-12 h-12 flex items-center justify-center bg-red-500 rounded-full shadow-lg"
                      style={{
                        top: '8px', // Align with bullet point position (8px padding + bullet alignment)
                        transform: isDragging ? 'scale(0)' : 'scale(1)',
                        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <button 
                        onClick={() => handleDeleteBullet(index)}
                        className="w-full h-full flex items-center justify-center text-white"
                      >
                        <CustomIcon name="trash" size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
                {/* Add Bullet Button */}
                <div className="pt-4">
                  <button 
                    onClick={() => setEditContent(prev => ({ ...prev, bullets: [...prev.bullets, ''] }))}
                    className="flex items-center gap-2 text-[#ffffff] py-3 px-4"
                    style={{
                      background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                      boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                      borderRadius: '44.45px',
                      outline: '1px rgba(255, 255, 255, 0.10) solid',
                      outlineOffset: '-1px',
                      backdropFilter: 'blur(10.67px)',
                    }}
                  >
                    <CustomIcon name="plus" size={16} />
                    <span>Add bullet point</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4">
            <button 
              onClick={() => {
                showFeedbackMessage('Changes saved successfully!')
                // Save logic here
                handleCloseEditor()
              }}
              className="w-full py-3 px-4 text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0px 4px 16px rgba(34, 197, 94, 0.3)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="text-[#ffffff] relative">
                        {/* Header - Fixed with Progressive Blur */}
        <div className="fixed top-0 left-0 right-0 z-50 h-20" style={{ transform: 'translateZ(0)' }}>
          {/* Single progressive blur layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)'
              }}
            ></div>
          </div>
          <div className="flex justify-end items-center p-4 relative z-10 h-full">
            <div className="flex gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={handleSummarise}
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  outline: '1px rgba(255, 255, 255, 0.10) solid',
                  outlineOffset: '-1px',
                  backdropFilter: 'blur(10.67px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.35) 0%, rgba(113.69, 113.69, 113.69, 0.25) 40%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)'
                }}
              >
                <CustomIcon name="summarise" size={20} />
                <span>Summarise</span>
              </button>
              <button 
                className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
                onClick={handlePlay}
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  outline: '1px rgba(255, 255, 255, 0.10) solid',
                  outlineOffset: '-1px',
                  backdropFilter: 'blur(10.67px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.35) 0%, rgba(113.69, 113.69, 113.69, 0.25) 40%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)'
                }}
              >
                <CustomIcon name="play" size={20} className="text-[#ffffff]" />
              </button>
              <button 
                className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
                onClick={handleShare}
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  borderRadius: '44.45px',
                  outline: '1px rgba(255, 255, 255, 0.10) solid',
                  outlineOffset: '-1px',
                  backdropFilter: 'blur(10.67px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.35) 0%, rgba(113.69, 113.69, 113.69, 0.25) 40%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)'
                }}
              >
                <CustomIcon name="share" size={20} className="text-[#ffffff]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content px-4 pb-32 pt-20 space-y-6">
          {/* Proven Impact Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Proven Impact</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('proven-impact', 'Proven Impact')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>778% user growth and 99% Day 1 retention through strategic design improvements</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>40% increase in monthly active users and resolved critical Day 0 retention issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>1,500%+ session growth rates by optimizing user flows and engagement patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Consistently improved retention across Day 1, Day 7, and Day 30 metrics</span>
              </li>
            </ul>
          </div>

          {/* Core Strengths Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Core Strengths</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('core-strengths', 'Core Strengths')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Cross-industry expertise: Mobility, fintech, parenting solutions, and international markets</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>End-to-end ownership: From strategy and prototyping to developer handoff and metrics analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Technical innovation: AI workflows for design-to-code automation and</span>
              </li>
            </ul>
          </div>

          {/* Technical Skills Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Technical Skills</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('technical-skills', 'Technical Skills')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Advanced proficiency in Figma, Sketch, Adobe Creative Suite, and Framer</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Frontend development: React, TypeScript, CSS3, and responsive design principles</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Data analysis tools: Mixpanel, Google Analytics, Hotjar, and A/B testing platforms</span>
              </li>
            </ul>
          </div>

          {/* Professional Experience Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Professional Experience</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('professional-experience', 'Professional Experience')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>5+ years leading design teams at high-growth startups and established companies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Successfully launched 15+ mobile applications across iOS and Android platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Managed design systems serving millions of users across multiple product lines</span>
              </li>
            </ul>
          </div>

          {/* Leadership & Collaboration Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Leadership & Collaboration</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('leadership-collaboration', 'Leadership & Collaboration')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Led cross-functional teams of 12+ designers, developers, and product managers</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Established design workflows that reduced handoff time by 60% and improved quality</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Mentored junior designers, with 90% receiving promotions within 18 months</span>
              </li>
            </ul>
          </div>

          {/* Education & Certifications Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Education & Certifications</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('education-certifications', 'Education & Certifications')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Master's in Human-Computer Interaction from Stanford University</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Google UX Design Professional Certificate and Nielsen Norman Group UX certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Certified Scrum Product Owner (CSPO) and Design Sprint facilitator</span>
              </li>
            </ul>
          </div>

          {/* Notable Projects Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Notable Projects</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('notable-projects', 'Notable Projects')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Redesigned checkout flow resulting in 34% reduction in cart abandonment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Created accessibility-first design system adopted by 8 product teams</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Led AI-powered personalization features that increased user engagement by 250%</span>
              </li>
            </ul>
          </div>

          {/* Industry Recognition Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Industry Recognition</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('industry-recognition', 'Industry Recognition')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Featured speaker at UX Week 2023 and Design + Research Conference</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Published research on mobile UX patterns in Journal of User Experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Winner of Best Mobile App Design at TechCrunch Design Awards 2022</span>
              </li>
            </ul>
          </div>

          {/* Cross-functional Expertise Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Cross-functional Expertise</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('cross-functional-expertise', 'Cross-functional Expertise')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Product strategy: Market research, competitive analysis, and roadmap planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Business impact: Revenue optimization, conversion rate analysis, and growth metrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Engineering collaboration: API design consultation and technical feasibility assessment</span>
              </li>
            </ul>
          </div>

          {/* Innovation & Strategy Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Innovation & Strategy</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={() => handleSectionEdit('innovation-strategy', 'Innovation & Strategy')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Pioneered design-to-code automation reducing development time by 40%</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Developed predictive UX models using machine learning for user behavior analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ffffff] mr-3">•</span>
                <span>Created frameworks for rapid prototyping adopted across 3 different organizations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className="fixed bottom-20 left-4 right-4 z-40 flex justify-center">
            <div 
              className="px-6 py-3 rounded-full text-white text-sm font-medium transform transition-all duration-300"
              style={{
                background: 'linear-gradient(137deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
                boxShadow: '0px 4px 16px rgba(34, 197, 94, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {feedbackMessage}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        {!isInputFocused && <BottomNavigation />}
      </div>
    </div>
  )
}
