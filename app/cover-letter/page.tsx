"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import CustomIcon from "@/components/CustomIcon"
import SharedHistory from "@/components/SharedHistory"
import { useRouter, useSearchParams } from "next/navigation"
import NavigationBtn from "@/components/NavigationBtn"
import type { Route } from "next"
import { createPortal } from 'react-dom';

interface Document {
  type: string
  name: string
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return "/Images/space-pdf.svg"
    case "doc":
      return "/Images/space-doc.svg"
    case "img":
      return "/Images/space-doc.svg"
    case "link":
      return "/Images/space-link.svg"
    default:
      return "/Images/space-doc.svg"
  }
}

interface Section {
  title: string
  bullets: string[]
}

interface CoverLetter {
  id?: string
  prompt?: string
  sections?: Record<string, Section>
  content?: string[]
  documents?: { type: string; name: string }[]
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
  'Summary of experience for a product manager position.',
  "Research about Tesla's company culture."
]

function ToastPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') return null;
  return createPortal(children, document.body);
}

function DocsModalPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') return null;
  return createPortal(children, document.body);
}

function CoverLetterPageInner() {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const contentRef = useRef<HTMLElement | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isScrollable, setIsScrollable] = useState(false)
  const from = searchParams?.get('from')
  const sessionId = searchParams?.get('id')
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; name: string } | null>(null)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [showEditSavedToast, setShowEditSavedToast] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const handleBack = () => {
    // Go back to homepage and open history drawer
    router.push('/')
    // Set history state in localStorage to be picked up by homepage
    localStorage.setItem('showHistory', 'true')
  }

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

  // Add useEffect to check for toast state in localStorage
  useEffect(() => {
    const showUpdateToast = localStorage.getItem('showUpdateToast')
    if (showUpdateToast === 'true') {
      setShowToast(true)
      localStorage.removeItem('showUpdateToast')
      setTimeout(() => setShowToast(false), 2000)
    }
  }, [])

  // Add useEffect to check for edit saved toast state in localStorage
  useEffect(() => {
    const showEditSavedToastFlag = localStorage.getItem('showEditSavedToast')
    if (showEditSavedToastFlag === 'true') {
      setShowEditSavedToast(true)
      setToastVisible(true)
      localStorage.removeItem('showEditSavedToast')
      setTimeout(() => setToastVisible(false), 2500)
      setTimeout(() => setShowEditSavedToast(false), 2700)
    }
  }, [])

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

  const handleDocs = () => {
    setShowDocsModal(true)
  }

  const handlePlay = () => {
    showFeedbackMessage('Playing cover letter...')
  }

  const handleShare = async () => {
    try {
      // Show loading message
      showFeedbackMessage('Generating PDF...')

      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 50
      const lineHeight = 20
      const sectionSpacing = 30

      // Set font styles
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      
      // Add title
      const title = session?.prompt || coverLetterTitles[session === dummyCoverLetters[0] ? 0 : 1]
      pdf.text(title, margin, margin + 20)

      let currentY = margin + 60

      // Add sections
      if (selectedSections && Object.keys(selectedSections).length > 0) {
        Object.entries(selectedSections).forEach(([key, section]) => {
          const sec = section as Section
          
          // Check if we need a new page
          if (currentY > pageHeight - 100) {
            pdf.addPage()
            currentY = margin
          }

          // Add section title
          if (sec.title) {
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(14)
            pdf.text(sec.title, margin, currentY)
            currentY += lineHeight + 10
          }

          // Add section content
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(11)
          
          sec.bullets.forEach((bullet: string) => {
            // Check if we need a new page
            if (currentY > pageHeight - 50) {
              pdf.addPage()
              currentY = margin
            }

            // Split long text into multiple lines
            const maxWidth = pageWidth - (2 * margin)
            const lines = pdf.splitTextToSize(bullet, maxWidth)
            
            lines.forEach((line: string) => {
              if (currentY > pageHeight - 50) {
                pdf.addPage()
                currentY = margin
              }
              pdf.text(line, margin, currentY)
              currentY += lineHeight
            })
            
            currentY += 5 // Add space between bullets
          })

          currentY += sectionSpacing
        })
      }

      // Save PDF with a meaningful name
      const fileName = `cover-letter-${Date.now()}.pdf`
      pdf.save(fileName)
      
      showFeedbackMessage('Cover letter downloaded as PDF!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showFeedbackMessage('Error generating PDF. Please try again.')
    }
  }

  useEffect(() => {
    if (showDocsModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showDocsModal]);

  return (
      <div className="flex flex-col min-h-screen overflow-hidden cover-letter-page bg-[#0d0c0c]">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-4 relative" style={{ background: '#0d0c0c' }}>
          {/* No overlay */}
          {/* History Tab */}
          <div className="relative z-10">
            <NavigationBtn
              onClick={handleBack}
              ariaLabel="Go back"
              size={48}
            >
              <CustomIcon name="back" size={20} className="text-[#ffffff]" />
            </NavigationBtn>
          </div>
          {/* Action buttons */}
          <div className="flex gap-3 relative z-10">
            <button
              className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={handleDocs}
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)'
              }}
            >
              <CustomIcon name="document" size={20} />
              <span>Docs</span>
            </button>
          {/* <button
              className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              onClick={handlePlay}
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)'
              }}
            >
              <CustomIcon name="play" size={20} className="text-[#ffffff]" />
          </button> */}
            <button
              className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              onClick={handleShare}
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)'
              }}
            >
              <CustomIcon name="share" size={20} className="text-[#ffffff]" />
            </button>
          </div>
        </header>
        {/* Visible Content */}
      <main className="flex-1 pt-4 pb-24 px-4">
        <div className="w-full max-w-2xl mx-auto">
            {/* Cover Letter Title as Link */}
            <div className="flex justify-center mb-6">
            <h1 className="text-white text-xl font-playfair font-semibold">
              {session?.prompt || coverLetterTitles[session === dummyCoverLetters[0] ? 0 : 1]}
            </h1>
            </div>
          {Object.entries(selectedSections).map(([key, section], idx) => {
            const sec = section as Section;
            return (
              <div key={key} className="border-b border-white/5 pb-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  {sec.title && (
                    <h2 className="text-white text-lg font-playfair font-semibold opacity-80">
                      {sec.title}
                    </h2>
                  )}
                  {/* Edit Button */}
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
                <ul className="space-y-3">
                  {sec.bullets.map((bullet: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-white opacity-60 flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {/* Document icons */}
          {session?.documents && session.documents.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {session.documents.slice(0, 4).map((doc: Document, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDocument(doc)
                    setShowDocumentPreview(true)
                  }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <img
                    src={getFileIcon(doc.type)}
                    alt={doc.type}
                    width={24}
                    height={24}
                    className="rounded shadow"
                  />
                </button>
              ))}
              {session.documents.length > 4 && (
                <span className="text-white text-xs font-semibold bg-black/30 px-2 py-1.5 rounded-full">
                  +{session.documents.length - 4}
                </span>
              )}
            </div>
          )}
          </div>
        </main>
        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed bottom-24 left-4 right-4 z-50">
            <div className="flex items-center justify-center">
              <div className="px-6 py-3 rounded-xl text-white text-sm font-medium" style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}>{feedbackMessage}</div>
            </div>
          </div>
        )}
      <SharedHistory open={showHistory} onClose={() => setShowHistory(false)} type="cover-letter" />
      {/* Document Preview Modal */}
      {showDocumentPreview && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full mx-4 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <img
                  src={getFileIcon(selectedDocument.type)}
                  alt={selectedDocument.type}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <h3 className="text-white text-lg font-medium">{selectedDocument.name}</h3>
              </div>
              <button
                onClick={() => setShowDocumentPreview(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <CustomIcon name="close" size={20} className="text-white" />
              </button>
            </div>
            <div className="bg-black/20 rounded-xl p-4 h-[60vh] overflow-y-auto">
              {selectedDocument.type === 'pdf' && (
                <iframe
                  src={`/documents/${selectedDocument.name}`}
                  className="w-full h-full rounded-lg"
                  title={selectedDocument.name}
                />
              )}
              {selectedDocument.type === 'doc' && (
                <div className="text-white text-center py-8">
                  <CustomIcon name="document" size={48} className="text-white/50 mb-4" />
                  <p>Document preview not available</p>
                </div>
              )}
              {selectedDocument.type === 'img' && (
                <img
                  src={`/documents/${selectedDocument.name}`}
                  alt={selectedDocument.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              {selectedDocument.type === 'link' && (
                <div className="text-white text-center py-8">
                  <CustomIcon name="link2" size={48} className="text-white/50 mb-4" />
                  <a
                    href={selectedDocument.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Open Link
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Docs Modal - now rendered in a portal */}
      {showDocsModal && (
        <DocsModalPortal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setShowDocsModal(false)}
          >
            <div
              className="glassmorphic-card rounded-2xl px-4 py-3 max-w-md w-full mx-4 relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-bold font-playfair">Documents</h2>
                <button
                  onClick={() => setShowDocsModal(false)}
                  className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                    borderRadius: '44.45px',
                    outline: '1px rgba(255,255,255,0.10) solid',
                    backdropFilter: 'blur(10.67px)'
                  }}
                >
                  <CustomIcon name="close" size={20} className="text-[#ffffff]" />
                </button>
              </div>
              <div className="space-y-3">
                {/* Random document list */}
                {[
                  { name: 'Resume2024.pdf', type: 'pdf' },
                  { name: 'JobDesc.docx', type: 'doc' },
                  { name: 'Portfolio.xls', type: 'xls' },
                  { name: 'ProfilePic.png', type: 'img' },
                  { name: 'https://linkedin.com/in/xyz', type: 'link' },
                ].map((doc, idx, arr) => (
                  <React.Fragment key={doc.name}>
                    <div className="flex items-center gap-3 rounded-lg py-2">
                      <img
                        src={
                          doc.type === 'pdf' ? '/Images/space-pdf.svg'
                          : doc.type === 'doc' ? '/Images/space-doc.svg'
                          : doc.type === 'xls' ? '/Images/space-doc.svg'
                          : doc.type === 'img' ? '/Images/space-doc.svg'
                          : doc.type === 'link' ? '/Images/space-link.svg'
                          : '/Images/space-doc.svg'
                        }
                        alt={doc.type}
                        width={28}
                        height={28}
                        className="rounded shadow"
                      />
                      <span className="text-white text-sm truncate font-open-sauce-one opacity-50">{doc.name}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="h-px bg-white/5 w-full" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </DocsModalPortal>
      )}
      {/* Toast Notification */}
      {showToast && (
        <div 
          className="fixed bottom-24 left-4 right-4 z-50"
          style={{
            animation: 'slideUp 0.3s ease-out forwards'
          }}
        >
          <div 
            className="flex items-center justify-between px-6 py-3 rounded-xl text-white text-sm font-medium"
            style={{
              background: 'rgba(42, 42, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span>Document updated</span>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <CustomIcon name="close" size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
      {showEditSavedToast && (
        <ToastPortal>
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-10 z-[9999] flex items-center justify-center transition-transform duration-500 ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`} style={{ pointerEvents: toastVisible ? 'auto' : 'none' }}>
            <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-3 rounded-full text-white text-sm font-medium shadow-lg backdrop-blur-xl"
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
                WebkitBackdropFilter: 'blur(10.67px)'
              }}
            >
              <span>Content saved</span>
              <button onClick={() => { setToastVisible(false); setTimeout(() => setShowEditSavedToast(false), 300) }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
                <CustomIcon name="close" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </ToastPortal>
      )}
    </div>
  )
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoverLetterPageInner />
    </Suspense>
  )
}