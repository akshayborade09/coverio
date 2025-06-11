"use client"

import { useState, useEffect, useRef } from "react"
import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"

export default function CoverLetterPage() {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState({ title: '', bullets: [''] })
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [bulletToDelete, setBulletToDelete] = useState<number | null>(null)
  const [draggedBullet, setDraggedBullet] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [draggedBulletIndex, setDraggedBulletIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)

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

  const handleReorderDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault()
    setDraggedBulletIndex(index)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStartY(clientY)
    setDragCurrentY(clientY)
  }

  const handleReorderDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggedBulletIndex === null) return
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragCurrentY(clientY)
  }

  const handleReorderDragEnd = () => {
    if (draggedBulletIndex !== null && dragOverIndex !== null && draggedBulletIndex !== dragOverIndex) {
      const newBullets = [...editContent.bullets]
      const draggedItem = newBullets[draggedBulletIndex]
      newBullets.splice(draggedBulletIndex, 1)
      newBullets.splice(dragOverIndex, 0, draggedItem)
      setEditContent(prev => ({ ...prev, bullets: newBullets }))
    }
    
    setDraggedBulletIndex(null)
    setDragOverIndex(null)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <>
      {/* Full-Screen Editor */}
      {editingSection && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button 
              onClick={handleCloseEditor}
              className="w-12 h-12 flex items-center justify-center"
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

          {/* Editor Content */}
          <div className="flex-1 px-4 pb-20 overflow-y-auto overflow-x-hidden">
            {/* Delete Confirmation Toast */}
            {showDeleteToast && (
              <div className="fixed bottom-16 left-4 right-4 z-10 mb-4">
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

            {/* Title Editor */}
            <div className="mb-6">
              <input 
                type="text"
                value={editContent.title}
                onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-transparent text-white text-2xl font-serif border-none outline-none opacity-60 placeholder-gray-500"
                placeholder="Section title..."
              />
            </div>

            {/* Bullets Editor */}
            <div className="space-y-4">
              {editContent.bullets.map((bullet, index) => (
                <div 
                  key={index} 
                  className={`relative transition-all duration-300 ${
                    draggedBulletIndex === index ? 'opacity-50 scale-105' : ''
                  } ${
                    dragOverIndex === index ? 'border-t-2 border-blue-400' : ''
                  }`}
                  onMouseMove={draggedBulletIndex !== null ? handleReorderDragMove : undefined}
                  onTouchMove={draggedBulletIndex !== null ? handleReorderDragMove : undefined}
                  onMouseUp={handleReorderDragEnd}
                  onTouchEnd={handleReorderDragEnd}
                  onMouseEnter={() => {
                    if (draggedBulletIndex !== null && draggedBulletIndex !== index) {
                      setDragOverIndex(index)
                    }
                  }}
                  style={{
                    transform: draggedBulletIndex === index 
                      ? `translateY(${dragCurrentY - dragStartY}px)` 
                      : 'translateY(0px)'
                  }}
                >
                  {/* Main Bullet Content */}
                  <div 
                    className="flex items-start gap-3 transition-transform duration-300 ease-out"
                    style={{
                      transform: draggedBullet === index ? `translateX(${dragOffset}px)` : 'translateX(0px)',
                      backgroundColor: draggedBullet === index ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      borderRadius: draggedBullet === index ? '16px' : '0px',
                      padding: '12px 8px 8px 0px',
                      transition: 'transform 0.3s ease-out, background-color 0.3s ease-out, border-radius 0.3s ease-out'
                    }}
                    onTouchStart={(e) => handleDragStart(e, index)}
                    onMouseDown={(e) => handleDragStart(e, index)}
                    onTouchMove={handleDragMove}
                    onMouseMove={isDragging ? handleDragMove : undefined}
                    onTouchEnd={handleDragEnd}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                  >
                    {/* Drag Handle Bar */}
                    <div 
                      className="flex flex-col justify-center items-center cursor-grab active:cursor-grabbing py-2"
                      onMouseDown={(e) => handleReorderDragStart(e, index)}
                      onTouchStart={(e) => handleReorderDragStart(e, index)}
                    >
                      <CustomIcon name="bars-two" size={16} className="text-white opacity-30" />
                    </div>

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
                      ref={(el) => {
                        if (el) {
                          el.style.height = 'auto';
                          el.style.height = el.scrollHeight + 'px';
                        }
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
              <button 
                onClick={() => setEditContent(prev => ({ ...prev, bullets: [...prev.bullets, ''] }))}
                className="flex items-center gap-2 text-[#ffffff] opacity-70 py-2"
              >
                <CustomIcon name="plus" size={16} />
                <span>Add bullet point</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-3 p-4">
            <button 
              onClick={handleCloseEditor}
              className="flex-1 py-3 px-4 text-[#ffffff] opacity-70"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              Discard
            </button>
            <button 
              onClick={() => {
                // Save logic here
                handleCloseEditor()
              }}
              className="flex-1 py-3 px-4 text-[#ffffff]"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="text-[#ffffff] relative pb-24">
        {/* Action Buttons - Fixed Top */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          {/* Progressive Blur Layers */}
          <div className="absolute inset-0" 
            style={{
              backdropFilter: 'blur(12px)',
              maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)',
            }}
          />
          
          {/* Background Gradient */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0) 100%)',
            }}
          />
          
          {/* Top section */}
          <div className={`relative flex items-end justify-end gap-3 px-6 py-4 transition-transform duration-300 ease-in-out ${
            isNavVisible && !isDragging ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <button 
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
              <CustomIcon name="summarise" size={20} />
              <span>Summarise</span>
            </button>
            <button 
              className="w-12 h-12 flex items-center justify-center"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="play" size={20} className="text-[#ffffff]" />
            </button>
            <button 
              className="w-12 h-12 flex items-center justify-center"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255, 255, 255, 0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
            >
              <CustomIcon name="share" size={20} className="text-[#ffffff]" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pt-20 space-y-6">
          {/* Proven Impact Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Proven Impact</h2>
              <button className="text-[#ffffff] opacity-70" onClick={() => handleEditSection('proven-impact')}>
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
              <button className="text-[#ffffff] opacity-70" onClick={() => handleEditSection('core-strengths')}>
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
              <button className="text-[#ffffff] opacity-70">
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
      </div>

      {/* Bottom Navigation */}
      {!isInputFocused && <BottomNavigation />}
    </>
  )
}
