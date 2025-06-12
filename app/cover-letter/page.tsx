"use client"

import { useState } from "react"
import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import { useFullscreen } from "@/hooks/useFullscreen"

export default function CoverLetterPage() {
  const { isScrolling } = useFullscreen()
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
    // Navigate to edit page with section parameter
    window.location.href = `/cover-letter/edit?section=${sectionKey}`
  }

  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  const handleSummarise = () => {
    showFeedbackMessage('Generating cover letter summary...')
    // Add actual summarise logic here
  }

  const handlePlay = () => {
    showFeedbackMessage('Playing cover letter...')
    // Add actual play logic here
  }

  const handleShare = () => {
    showFeedbackMessage('Sharing cover letter...')
    // Add actual share logic here
  }

  const handleSectionEditClick = (e: React.MouseEvent, sectionKey: string, sectionTitle: string) => {
    e.preventDefault()
    e.stopPropagation()
    handleEditSection(sectionKey)
  }

  return (
    <div className="cover-letter-page">
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
                onClick={(e) => handleSectionEditClick(e, 'proven-impact', 'Proven Impact')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['proven-impact'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Strengths Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Core Strengths</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'core-strengths', 'Core Strengths')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['core-strengths'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Skills Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Technical Skills</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'technical-skills', 'Technical Skills')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['technical-skills'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Experience Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Professional Experience</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'professional-experience', 'Professional Experience')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['professional-experience'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership & Collaboration Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Leadership & Collaboration</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'leadership-collaboration', 'Leadership & Collaboration')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['leadership-collaboration'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Education & Certifications Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Education & Certifications</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'education-certifications', 'Education & Certifications')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['education-certifications'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notable Projects Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Notable Projects</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'notable-projects', 'Notable Projects')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['notable-projects'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Recognition Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Industry Recognition</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'industry-recognition', 'Industry Recognition')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['industry-recognition'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cross-functional Expertise Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Cross-functional Expertise</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'cross-functional-expertise', 'Cross-functional Expertise')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['cross-functional-expertise'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Innovation & Strategy Section */}
          <div className="bg-[#202020] rounded-3xl p-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="opacity-40 text-white text-base font-serif font-normal leading-6 break-words">Innovation & Strategy</h2>
              <button 
                className="text-[#ffffff] opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-90 p-2 rounded-full hover:bg-white/10" 
                onClick={(e) => handleSectionEditClick(e, 'innovation-strategy', 'Innovation & Strategy')}
              >
                <CustomIcon name="pencil" size={20} />
              </button>
            </div>
            <ul className="w-full opacity-60 text-white text-base font-sans font-normal leading-6 break-words space-y-4">
              {sections['innovation-strategy'].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#ffffff] mr-3">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <div className="flex items-center justify-center">
              <div className="px-6 py-3 rounded-xl text-white text-sm font-medium"
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                  boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
                  outline: '1px rgba(255, 255, 255, 0.10) solid',
                  outlineOffset: '-1px',
                  backdropFilter: 'blur(10.67px)',
                }}
              >
                {feedbackMessage}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
