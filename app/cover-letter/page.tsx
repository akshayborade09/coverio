"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import HistoryDrawer from "@/components/HistoryDrawer"

export default function CoverLetterPage() {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const contentRef = useRef<HTMLElement | null>(null)
  const pdfContentRef = useRef<HTMLDivElement | null>(null)
  const [showHistory, setShowHistory] = useState(false)

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

  const handleEditSection = (sectionKey: string) => {
    window.location.href = `/cover-letter/edit?section=${sectionKey}`
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
      <div className="flex flex-col min-h-screen overflow-hidden cover-letter-page">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-4 relative">
          {/* Progressive blur overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
            }}
          ></div>

          {/* History Tab */}
          <div className="relative z-10">
            <button
              className="w-12 h-12 p-3 rounded-full flex justify-center items-center gap-1.5"
              style={{
                background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.15) 0%, rgba(113.69, 113.69, 113.69, 0.12) 95%)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
              }}
              onClick={() => setShowHistory(true)}
            >
              <CustomIcon name="history" size={20} className="text-white" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 relative z-10">
            <button
              className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={handleSummarise}
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                borderRadius: '44.45px',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)'
              }}
            >
              <CustomIcon name="summarise" size={20} />
              <span>Summarise</span>
            </button>
            {/*
            <button
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
            </button>
            */}
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

        {/* Hidden PDF Content */}
        <div className="fixed left-0 top-0 -z-50" style={{ opacity: 0, pointerEvents: 'none' }}>
          <div ref={pdfContentRef} style={{
            width: '595pt',
            backgroundColor: '#ffffff',
            padding: '0',
            margin: '0'
          }}>
            {Object.entries(sections).map(([key, section]) => (
              <div key={key} className="pdf-section" style={{
                padding: '20pt',
                borderBottom: '1px solid #E5E5E5',
                backgroundColor: '#ffffff'
              }}>
                <h2 style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '18pt',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '16pt',
                  marginTop: 0
                }}>{section.title}</h2>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#000000'
                }}>
                  {section.bullets.map((bullet, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '12pt',
                      fontSize: '12pt',
                      lineHeight: 1.5,
                      color: '#000000'
                    }}>
                      <span style={{ marginRight: '12pt', color: '#000000' }}>•</span>
                      <span style={{ color: '#000000' }}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Visible Content */}
        <main ref={contentRef} className="flex-1 pt-0 pb-24 px-4 overflow-y-auto">
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="border-b border-white/5 pb-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white text-lg font-semibold leading-6 break-words" style={{fontFamily:'"Playfair Display", serif'}}>{section.title}</h2>
                <button
                  className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10"
                  onClick={() => handleEditSection(key)}
                >
                  <CustomIcon name="pencil" size={20} />
                </button>
              </div>
              <ul className="text-white text-sm font-sans font-light leading-6 break-words space-y-4">
                {section.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#ffffff] mr-3">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </main>

        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed bottom-24 left-4 right-4 z-50">
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
      </div>

      {/* Bottom Navigation outside transformed container */}
      <BottomNavigation />
      <HistoryDrawer open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  )
}