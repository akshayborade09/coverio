"use client"

import * as React from "react"
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, TouchEvent, MouseEvent, FocusEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"

interface Section {
  title: string
  bullets: string[]
}

interface CoverLetter {
  id?: string
  prompt?: string
  sections?: Record<string, Section>
  content?: string[]
}

interface EditContent {
  title: string
  bullets: string[]
}

interface DummyCoverLetter {
  sections: Record<string, Section>
  prompt?: string
  content?: string[]
}

interface DraggedPosition {
  top: number
  height: number
}

function EditPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionKey = searchParams ? searchParams.get('section') : null
  const coverLetterId = searchParams ? searchParams.get('coverLetter') : null
  const [editContent, setEditContent] = useState<EditContent>({ title: '', bullets: [''] })
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [bulletToDelete, setBulletToDelete] = useState<number | null>(null)
  const [draggedBullet, setDraggedBullet] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [draggedBulletPosition, setDraggedBulletPosition] = useState<DraggedPosition>({ top: 0, height: 0 })
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const dragAnimationRef = useRef<number | null>(null)
  const bulletRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Dummy cover letters (same as in main page)
  const dummyCoverLetters: (DummyCoverLetter | null)[] = [
    // 1st: current cover letter (sections)
    null,
    // 2nd: dummy content (sections)
    {
      sections: {
        'intro': {
          title: 'Introduction',
          bullets: [
            'Dear Hiring Manager,',
            'I am excited to apply for the Product Manager position.'
          ]
        },
        'experience': {
          title: 'Relevant Experience',
          bullets: [
            'Led cross-functional teams to deliver successful products.',
            'Proven track record in market research and agile development.'
          ]
        },
        'closing': {
          title: 'Closing',
          bullets: [
            'Thank you for considering my application.',
            'Sincerely, Akshay Borhade'
          ]
        }
      }
    },
    // 3rd: dummy content (sections)
    {
      sections: {
        'summary': {
          title: 'Tesla Company Culture Research',
          bullets: [
            "Tesla's company culture is defined by innovation, fast-paced execution, and a mission-driven approach.",
            'Employees are encouraged to take ownership and challenge the status quo.',
            'The environment is demanding but rewarding for those passionate about making a difference.'
          ]
        }
      }
    }
  ]

  // Main sections data (same as in main page)
  const mainSections = {
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
        'Technical innovation: AI workflows for design-to-code automation and rapid prototyping'
      ]
    },
    'technical-skills': {
      title: 'Technical Skills',
      bullets: [
        'Advanced proficiency in Figma, Sketch, Adobe Creative Suite, and Framer',
        'Frontend development: React, TypeScript, CSS3, and responsive design principles',
        'Data analysis tools: Mixpanel, Google Analytics, Hotjar, and A/B testing platforms'
      ]
    },
    'professional-experience': {
      title: 'Professional Experience',
      bullets: [
        '5+ years leading design teams at high-growth startups and established companies',
        'Successfully launched 15+ mobile applications across iOS and Android platforms',
        'Managed design systems serving millions of users across multiple product lines'
      ]
    },
    'leadership-collaboration': {
      title: 'Leadership & Collaboration',
      bullets: [
        'Led cross-functional teams of 12+ designers, developers, and product managers',
        'Established design workflows that reduced handoff time by 60% and improved quality',
        'Mentored junior designers, with 90% receiving promotions within 18 months'
      ]
    },
    'education-certifications': {
      title: 'Education & Certifications',
      bullets: [
        'Master\'s in Human-Computer Interaction from Stanford University',
        'Google UX Design Professional Certificate and Nielsen Norman Group UX certification',
        'Certified Scrum Product Owner (CSPO) and Design Sprint facilitator'
      ]
    },
    'notable-projects': {
      title: 'Notable Projects',
      bullets: [
        'Redesigned checkout flow resulting in 34% reduction in cart abandonment',
        'Created accessibility-first design system adopted by 8 product teams',
        'Led AI-powered personalization features that increased user engagement by 250%'
      ]
    },
    'industry-recognition': {
      title: 'Industry Recognition',
      bullets: [
        'Featured in Fast Company\'s "Most Creative People in Business" list for 2023',
        'Winner of UX Awards "Best Mobile App Design" for innovative fintech solutions',
        'Speaker at 12+ international design conferences including Figma Config and Adobe MAX'
      ]
    },
    'cross-functional-expertise': {
      title: 'Cross-functional Expertise',
      bullets: [
        'Collaborated with C-suite executives on product strategy and roadmap planning',
        'Partnered with engineering teams to ensure 95% design-to-code accuracy',
        'Worked with data science teams to implement ML-driven personalization features'
      ]
    },
    'innovation-strategy': {
      title: 'Innovation & Strategy',
      bullets: [
        'Pioneered AI-assisted design workflows that reduced concept-to-prototype time by 70%',
        'Established design research methodologies now used across 3 different companies',
        'Led strategic initiatives that contributed to $50M+ in additional revenue'
      ]
    }
  }

  // Initialize content based on coverLetterId and section
  useEffect(() => {
    let section = null
    
    // First try to find in localStorage
    if (typeof window !== 'undefined' && coverLetterId) {
      const localHistory = localStorage.getItem('chatHistory')
      if (localHistory) {
        try {
          const parsed = JSON.parse(localHistory)
          const session = parsed.find((s: CoverLetter) => s && s.id === coverLetterId)
          if (session) {
            if (session.sections && sectionKey) {
              section = session.sections[sectionKey]
            } else if (session.content) {
              section = {
                title: session.prompt || 'Cover Letter',
                bullets: session.content
              }
            }
          }
        } catch {}
      }
    }

    // If not found in localStorage, try dummy data
    if (!section) {
      // Try numeric index first
      const idx = !isNaN(Number(coverLetterId)) ? Number(coverLetterId) : -1
      const dummyLetter = dummyCoverLetters[idx] || dummyCoverLetters.find((s: any) => s && s.id === coverLetterId)
      
      if (dummyLetter && sectionKey) {
        if (dummyLetter.sections && dummyLetter.sections[sectionKey]) {
          section = dummyLetter.sections[sectionKey]
        } else if (dummyLetter.content) {
          section = {
            title: dummyLetter.prompt || 'Cover Letter',
            bullets: dummyLetter.content
          }
        }
      }
    }

    // If still not found, try mainSections data
    if (!section && sectionKey && mainSections[sectionKey as keyof typeof mainSections]) {
      section = mainSections[sectionKey as keyof typeof mainSections]
    }

    if (section) {
      setEditContent({ title: section.title || '', bullets: [...section.bullets] })
    }
  }, [coverLetterId, sectionKey])

  // Auto-resize bullet textareas on mount and when bullet content changes
  useEffect(() => {
    editContent.bullets.forEach((_, idx) => {
      const textarea = bulletRefs.current[idx];
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    });
  }, [editContent.bullets]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (dragAnimationRef.current) {
        cancelAnimationFrame(dragAnimationRef.current)
      }
    }
  }, [])

  // Auto-focus bullet point when editing
  const focusBulletPoint = (index: number) => {
    setTimeout(() => {
      const textareaRef = bulletRefs.current[index]
      if (textareaRef) {
        textareaRef.focus()
        // Scroll the bullet point into the center of the screen
        textareaRef.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }
    }, 100)
  }

  const handleSave = () => {
    // Save changes to localStorage if it's a history item
    if (coverLetterId) {
      const localHistory = localStorage.getItem('chatHistory')
      if (localHistory) {
        try {
          const parsed = JSON.parse(localHistory)
          const sessionIndex = parsed.findIndex((s: CoverLetter) => s && s.id === coverLetterId)
          if (sessionIndex !== -1) {
            const session = parsed[sessionIndex]
            if (!session.sections) {
              session.sections = {}
            }
            if (sectionKey) {
              session.sections[sectionKey] = {
                title: editContent.title,
                bullets: editContent.bullets
              }
            }
            localStorage.setItem('chatHistory', JSON.stringify(parsed))
          }
        } catch {}
      }
    }
    router.back()
  }

  const handleClose = () => {
    router.push(`/cover-letter?id=${coverLetterId || 0}`)
  }

  // Drag and delete handlers
  const handleDeleteBullet = (index: number) => {
    // Only show confirmation toast for non-empty bullet points
    if (editContent.bullets[index].trim() !== '') {
    setBulletToDelete(index)
    setShowDeleteToast(true)
    } else {
      // Directly delete empty bullet points
      const newBullets = editContent.bullets.filter((_: string, i: number) => i !== index)
      setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
      resetDrag()
    }
  }

  const confirmDeleteBullet = () => {
    if (bulletToDelete !== null) {
      const newBullets = editContent.bullets.filter((_: string, i: number) => i !== bulletToDelete)
      setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
    }
    setShowDeleteToast(false)
    setBulletToDelete(null)
  }

  const cancelDeleteBullet = () => {
    setShowDeleteToast(false)
    setBulletToDelete(null)
  }

  const handleDragStart = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>, index: number) => {
    setIsDragging(true)
    setDraggedBullet(index)
    setDragOffset(0)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    
    // Capture the bullet point's position for delete button alignment
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setDraggedBulletPosition({
      top: rect.top + window.scrollY,
      height: rect.height
    })
  }

  const handleDragMove = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    if (!isDragging || draggedBullet === null) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    
    // Allow left swipe (negative offset)
    const newOffset = Math.min(0, clientX - dragStartX)
    const clampedOffset = Math.max(newOffset, -60)
    
    // Use requestAnimationFrame for smooth updates
    if (dragAnimationRef.current) {
      cancelAnimationFrame(dragAnimationRef.current)
    }
    
    dragAnimationRef.current = requestAnimationFrame(() => {
      setDragOffset(clampedOffset)
    })
  }

  const handleDragEnd = () => {
    if (dragOffset < -30) {
      // Keep delete button visible if swiped more than 30px left
      setDragOffset(-60)
    } else {
      // Reset if not swiped enough
      setDragOffset(0)
      setDraggedBullet(null)
    }
    setIsDragging(false)
  }

  const resetDrag = () => {
    if (dragAnimationRef.current) {
      cancelAnimationFrame(dragAnimationRef.current)
      dragAnimationRef.current = null
    }
    setDragOffset(0)
    setDraggedBullet(null)
    setIsDragging(false)
  }

  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
                    const newValue = e.target.value
                    const newBullets = [...editContent.bullets]
                    
                    if (newValue === '' && editContent.bullets.length > 1) {
                      // First deletion: Clear content but keep bullet, show placeholder
                      if (editContent.bullets[index] !== '') {
                        newBullets[index] = ''
        setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
                        // Keep cursor at the end of the now-empty field
                        setTimeout(() => {
                          if (bulletRefs.current[index]) {
                            bulletRefs.current[index]?.focus()
                            const textarea = bulletRefs.current[index]
                            if (textarea) {
                              textarea.setSelectionRange(0, 0)
                            }
                          }
                        }, 0)
                      } else {
        // Second deletion: Actually remove the empty bullet - no toast needed
                        newBullets.splice(index, 1)
                        if (draggedBullet === index) {
                          resetDrag()
                        }
        setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
                        
                        // Focus on the last bullet point
                        const focusIndex = newBullets.length - 1
                        setTimeout(() => {
                          if (bulletRefs.current[focusIndex]) {
                            bulletRefs.current[focusIndex]?.focus()
                            // Move cursor to end
                            const textarea = bulletRefs.current[focusIndex]
                            if (textarea) {
                              textarea.setSelectionRange(textarea.value.length, textarea.value.length)
                            }
                          }
                        }, 50)
                      }
                    } else {
                      // Update the bullet content
                      newBullets[index] = newValue
      setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
                    }
                    
                    // Auto-resize after state update
                    setTimeout(() => {
                      if (e.target) {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }
                    }, 0);
  }

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>, index: number) => {
                    setIsInputFocused(true)
                    focusBulletPoint(index)
                    // Reset drag when focusing
                    resetDrag()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number, bullet: string) => {
    // Handle backspace on empty bullet point - no toast needed
                    if (e.key === 'Backspace' && bullet === '' && editContent.bullets.length > 1) {
                      e.preventDefault()
                      const newBullets = [...editContent.bullets]
                      newBullets.splice(index, 1)
                      if (draggedBullet === index) {
                        resetDrag()
                      }
      setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
                      
                      // Focus on the last bullet point
                      const focusIndex = newBullets.length - 1
                      setTimeout(() => {
                        if (bulletRefs.current[focusIndex]) {
                          bulletRefs.current[focusIndex]?.focus()
                          // Move cursor to end
                          const textarea = bulletRefs.current[focusIndex]
                          if (textarea) {
                            textarea.setSelectionRange(textarea.value.length, textarea.value.length)
                          }
                        }
                      }, 50)
                    }
                    
                    // Handle Enter key to add new bullet point
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const newBullets = [...editContent.bullets]
                      // Insert new empty bullet after current index
                      newBullets.splice(index + 1, 0, '')
      setEditContent((prev: EditContent) => ({ ...prev, bullets: newBullets }))
                      
      // Focus on new bullet point
                      setTimeout(() => {
                        if (bulletRefs.current[index + 1]) {
                          bulletRefs.current[index + 1]?.focus()
                          const textarea = bulletRefs.current[index + 1]
                          if (textarea) {
                            textarea.setSelectionRange(0, 0)
                          }
                        }
                      }, 50)
                    }
  }

  return (
    <div className="edit-page min-h-screen" style={{
      color: '#ffffff',
      background: '#000000',
      backgroundImage: 'url(/Images/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-4 relative">
        {/* Progressive blur overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
        }} />
        {/* Header Content */}
        <div className="flex items-center justify-between gap-1 w-full relative z-10">
          <div className="flex-1 flex justify-center">
            <input type="text" value={editContent.title} onChange={e => setEditContent(prev => ({ ...prev, title: e.target.value }))} className="bg-transparent text-white font-serif border-none outline-none opacity-80 placeholder-gray-400" placeholder="Section title" style={{ fontSize: '20px', width: '100%' }} />
          </div>
          <button onClick={handleSave} className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-90 ml-2" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '20px',
          }}>
            <CustomIcon name="check" size={16} className="text-[#ffffff]" />
          </button>
          <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-90 ml-2" style={{
            background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
            borderRadius: '20px',
          }}>
            <CustomIcon name="close" size={16} className="text-[#ffffff]" />
          </button>
        </div>
      </header>
      {/* Content Area */}
      <div className="pt-4 px-4 pb-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          {editContent.bullets.map((bullet, index) => (
            <div key={index} className="relative group" style={{ minHeight: '48px' }}>
              {/* Delete Button - Always on the right, vertically centered, revealed on slide */}
              {editContent.bullets.length > 1 && (
                <button
                  onClick={() => handleDeleteBullet(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 z-10"
                  style={{
                    opacity: draggedBullet === index && dragOffset < -20 ? 1 : 0,
                    pointerEvents: draggedBullet === index && dragOffset < -20 ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease-out',
                  }}
                >
                  <CustomIcon name="trash" size={20} className="text-white" />
                </button>
              )}
              <div
                className="flex items-start pr-12"
                style={{
                  transform: draggedBullet === index ? `translateX(${dragOffset}px)` : 'translateX(0px)',
                  backgroundColor: (draggedBullet === index && dragOffset !== 0) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: (draggedBullet === index && dragOffset !== 0) ? '16px' : '0px',
                  padding: '12px 8px 8px 0px',
                  transition: isDragging 
                    ? 'background-color 0.2s ease-out, border-radius 0.2s ease-out' 
                    : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.2s ease-out, border-radius 0.2s ease-out',
                  willChange: isDragging ? 'transform' : 'auto'
                }}
                onTouchStart={e => { e.stopPropagation(); handleDragStart(e, index); }}
                onMouseDown={e => { e.stopPropagation(); handleDragStart(e, index); }}
                onTouchMove={e => { e.stopPropagation(); handleDragMove(e); }}
                onMouseMove={isDragging ? e => { e.stopPropagation(); handleDragMove(e); } : undefined}
                onTouchEnd={e => { e.stopPropagation(); handleDragEnd(); }}
                onMouseUp={e => { e.stopPropagation(); handleDragEnd(); }}
                onMouseLeave={handleDragEnd}
              >
                <textarea
                  ref={el => { bulletRefs.current[index] = el; }}
                  value={bullet}
                  onChange={e => handleChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index, bullet)}
                  onFocus={e => handleFocus(e, index)}
                  className="w-full bg-transparent text-white resize-none border-none outline-none leading-relaxed"
                  style={{ fontSize: '16px', lineHeight: '1.6', wordWrap: 'break-word', whiteSpace: 'pre-wrap', minHeight: '24px', opacity: '0.6', touchAction: 'manipulation', overflow: 'hidden' }}
                  placeholder={bullet === '' ? 'Bullet point' : 'Enter bullet point...'}
                  rows={1}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Add New Bullet Button */}
        <button
          onClick={() => {
            const newBullets = [...editContent.bullets, '']
            setEditContent(prev => ({ ...prev, bullets: newBullets }))
            setTimeout(() => {
              const newIndex = newBullets.length - 1
              if (bulletRefs.current[newIndex]) {
                bulletRefs.current[newIndex]?.focus()
                const textarea = bulletRefs.current[newIndex]
                if (textarea) {
                  textarea.setSelectionRange(0, 0)
                }
              }
            }, 50)
          }}
          className="mt-6 flex items-center gap-2 px-3 py-3 rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
            outline: '1px rgba(255,255,255,0.10) solid',
            outlineOffset: '-1px',
            backdropFilter: 'blur(10.67px)',
          }}
        >
          <CustomIcon name="plus" size={16} className="text-white" />
          <span className="text-white text-sm">Add bullet point</span>
        </button>
      </div>
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="flex items-center justify-center">
            <div className="px-6 py-3 rounded-xl text-white text-sm font-medium" style={{
              background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
              boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
              outline: '1px rgba(255, 255, 255, 0.10) solid',
              outlineOffset: '-1px',
              backdropFilter: 'blur(10.67px)',
            }}>{feedbackMessage}</div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Toast */}
      {showDeleteToast && (
        <div className="fixed bottom-20 left-4 right-4 z-10">
          <div className="flex items-center justify-between gap-3 px-3 py-3 rounded-full" style={{
            background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
            boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
            outline: '1px rgba(255, 255, 255, 0.10) solid',
            outlineOffset: '-1px',
            backdropFilter: 'blur(10.67px)',
          }}>
            <span className="text-white text-sm font-medium flex-1">Delete the bullet point?</span>
            <div className="flex items-center gap-2">
              <button onClick={confirmDeleteBullet} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full transition-colors">Confirm</button>
              <button onClick={cancelDeleteBullet} className="w-8 h-8 flex items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity" style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                borderRadius: '20px',
              }}>
                <CustomIcon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading component for Suspense fallback
function EditPageLoading() {
  return (
    <div 
      className="edit-page min-h-screen flex items-center justify-center"
      style={{
        color: '#ffffff',
        background: '#000000',
        backgroundImage: 'url(/Images/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
}

export default function EditPage() {
  return (
    <Suspense fallback={<EditPageLoading />}>
      <EditPageContent />
    </Suspense>
  )
}
