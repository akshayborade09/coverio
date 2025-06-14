"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import SharedHistory from "@/components/SharedHistory"
import { useRouter, useSearchParams } from "next/navigation"

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

const dummyCoverLetters = [
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

const coverLetterTitles = [
  'Write a cover letter for a software engineer role at Google.',
  'Summarize my experience for a product manager position.',
  "Research about Tesla's company culture."
]

function CoverLetterPageInner() {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const contentRef = useRef<HTMLElement | null>(null)
  const pdfContentRef = useRef<HTMLDivElement | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isScrollable, setIsScrollable] = useState(false)

  // Get session id from query
  const sessionId = searchParams?.get('id')

  // Find session in localStorage or mockHistory
  let session = null
  if (typeof window !== 'undefined' && sessionId) {
    const localHistory = localStorage.getItem('chatHistory')
    if (localHistory) {
      try {
        const parsed = JSON.parse(localHistory)
        session = parsed.find((s: any) => s && s.id === sessionId)
      } catch {}
    }
  }
  if (!session && sessionId) {
    // Convert numeric sessionId to number for array index
    const idx = !isNaN(Number(sessionId)) ? Number(sessionId) : -1
    session = dummyCoverLetters[idx] || dummyCoverLetters.find((s: any) => s && s.id === sessionId)
  }
  // Fallback to first mock if nothing found
  if (!session) {
    session = dummyCoverLetters[0]
  }

  // Convert history content to sections format if needed
  if (session && !session.sections && session.content) {
    session = {
      ...session,
      sections: {
        'content': {
          title: session.prompt || 'Cover Letter',
          bullets: session.content
        }
      }
    }
  }

  // Use session.sections for rendering, with robust null check
  const selectedSections = (session && session.sections && typeof session.sections === 'object') ? session.sections : {}

  useEffect(() => {
    function checkScrollable() {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight
        // Account for header (80px) and bottom navigation (96px)
        const visibleHeight = window.innerHeight - 176
        setIsScrollable(contentHeight > visibleHeight)
      }
    }
    checkScrollable()
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [sessionId])

  // Section data
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

  const handleEditSection = (coverLetterIdx: number, sectionKey: string) => {
    const id = session?.id || coverLetterIdx
    router.push(`/cover-letter/edit?coverLetter=${id}&section=${sectionKey}`)
  }

  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  const handleSummarise = () => {
    showFeedbackMessage('Generating cover letter summary...')
  }

  const handlePlay = () => {
    showFeedbackMessage('Playing cover letter...')
  }

  const handleShare = async () => {
    try {
      if (!pdfContentRef.current) return

      // Show loading message
      showFeedbackMessage('Generating PDF...')

      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 40

      // Get all section elements
      const sectionElements = Array.from(pdfContentRef.current.getElementsByClassName('pdf-section'))
      let currentY = margin

      for (const section of sectionElements) {
        // Capture each section separately
        const canvas = await html2canvas(section as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })

        // Calculate dimensions
        const imgWidth = pageWidth - (2 * margin)
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Check if we need a new page
        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage()
          currentY = margin
        }

        // Add the section to PDF
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          currentY,
          imgWidth,
          imgHeight
        )

        // Update Y position
        currentY += imgHeight + 20 // Add some space between sections
      }

      // Save PDF
      pdf.save('cover-letter.pdf')
      showFeedbackMessage('Cover letter downloaded as PDF!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showFeedbackMessage('Error generating PDF. Please try again.')
    }
  }

  return (
    <>
      <div 
        className="flex flex-col md:flex-row min-h-screen"
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
        {/* Main Container with max-width */}
        <div className="w-full mx-auto" style={{ maxWidth: '1920px' }}>
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* History Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block w-[320px] xl:w-[400px] h-screen overflow-y-auto border-r border-white/10">
              <div className="p-6">
                <h1 className="text-2xl font-playfair mb-6">History</h1>
                <div className="space-y-3">
                  {/* History Items */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:bg-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5733] flex items-center justify-center">
                      <CustomIcon name="file-text" size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-medium">Resume2025.pdf</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <CustomIcon name="copy" size={14} className="text-white/60" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <CustomIcon name="share" size={14} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden">
              {/* Header */}
              <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    {/* Mobile Menu Button - Only visible on mobile */}
                    <button className="md:hidden w-10 h-10 flex items-center justify-center">
                      <CustomIcon name="menu" size={24} className="text-white" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleSummarise}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                          outline: '1px rgba(255, 255, 255, 0.10) solid',
                          outlineOffset: '-1px',
                          backdropFilter: 'blur(10.67px)',
                        }}
                      >
                        <CustomIcon name="wand" size={16} className="text-white" />
                        <span className="text-white text-sm">Summarise</span>
                      </button>
                      
                      <button
                        onClick={handlePlay}
                        className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-90"
                        style={{
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        }}
                      >
                        <CustomIcon name="play" size={16} className="text-white" />
                      </button>
                      
                      <button
                        onClick={handleShare}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white/20"
                      >
                        <CustomIcon name="share" size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 container mx-auto px-4 py-6 md:py-8 md:px-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {/* Cover Letter Title */}
                  <div className="flex justify-center mb-8">
                    <h1 className="text-white text-2xl md:text-3xl font-playfair font-semibold">
                      {session?.prompt || coverLetterTitles[session === dummyCoverLetters[0] ? 0 : 1]}
                    </h1>
                  </div>

                  {/* Sections */}
                  {Object.entries(selectedSections).map(([key, section]: [string, Section]) => (
                    <div key={key} className="border-b border-white/5 pb-8 mb-8 last:border-b-0">
                      <div className="flex justify-between items-center mb-4">
                        {section.title && (
                          <h2 className="text-white text-xl md:text-2xl font-playfair font-semibold opacity-80">
                            {section.title}
                          </h2>
                        )}
                        <button
                          onClick={() => handleEditSection(session === dummyCoverLetters[0] ? 0 : 1, key)}
                          className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-90"
                          style={{
                            background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                            borderRadius: '20px',
                          }}
                        >
                          <CustomIcon name="pencil" size={16} className="text-[#ffffff]" />
                        </button>
                      </div>
                      <ul className="space-y-4">
                        {section.bullets.map((bullet: string, index: number) => (
                          <li key={index} className="flex items-start gap-4">
                            <span className="text-white opacity-40 mt-1">•</span>
                            <span className="text-white opacity-60 flex-1 text-base md:text-lg">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </main>

              {/* Bottom Navigation - Only visible on mobile */}
              <div className="md:hidden">
                <BottomNavigation />
              </div>
            </div>

            {/* Right Side Panel for Desktop - Optional */}
            <div className="hidden md:block w-[320px] xl:w-[400px] h-screen overflow-y-auto border-l border-white/10">
              <div className="p-6">
                <div className="rounded-3xl bg-white/5 p-6">
                  <h2 className="text-xl font-playfair mb-4">Need a document? Just Ask</h2>
                  <p className="text-white/60 text-sm mb-6">Our AI Agent creates it instantly</p>
                  <textarea
                    placeholder="Write something about yourself"
                    className="w-full h-32 bg-black/20 rounded-2xl p-4 text-white placeholder-white/40 resize-none"
                    style={{
                      outline: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <div className="flex justify-between mt-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                      <CustomIcon name="paperclip" size={20} className="text-white/60" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                      <CustomIcon name="arrow-up" size={20} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 z-50">
          <div className="flex items-center justify-center">
            <div className="px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)'
              }}
            >
              {feedbackMessage}
            </div>
          </div>
        </div>
      )}

      <SharedHistory 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        type="cover-letter"
      />
    </>
  )
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoverLetterPageInner />
    </Suspense>
  )
}