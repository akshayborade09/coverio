"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import CustomIcon from "@/components/CustomIcon"
import BottomNavigation from "@/components/BottomNavigation"
import ScrollingChips from "@/components/ScrollingChips"
import SharedHistory from "@/components/SharedHistory"
import NavigationBtn from "@/components/NavigationBtn"

export default function CoverIoApp() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Check for showHistory in localStorage on mount
  useEffect(() => {
    const shouldShowHistory = localStorage.getItem('showHistory')
    if (shouldShowHistory === 'true') {
      setShowHistory(true)
      localStorage.removeItem('showHistory')
    }
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create file data and navigate to chat with document
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }
      // Store file data in localStorage temporarily
      localStorage.setItem('selectedDocument', JSON.stringify({
        name: fileData.name,
        size: fileData.size,
        type: fileData.type
      }))
      // Navigate to chat interface
      router.push('/chat?from=document')
    }
  }

  const handleChipClick = (chip: string) => {
    // Store the chip text in localStorage to be used in chat interface
    localStorage.setItem('selectedChip', chip)
    
    switch (chip) {
      case 'Cover Letter':
        router.push('/chat?from=cover-letter')
        break
      case 'Company Research':
      case 'Interviewer Research':
        router.push('/chat?from=research')
        break
      default:
        router.push(`/chat?topic=${encodeURIComponent(chip)}`)
    }
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="fixed inset-0 flex flex-col text-[#ffffff] overflow-hidden">
        {/* History Tab */}
        <div className="absolute top-4 left-4 z-10">
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

        {/* Profile Avatar */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden z-10">
          <Image
            src="/Images/avatar-01.svg"
            alt="Profile"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-32">
          <Image 
            src="/Images/logo.png"
            alt="Cover.io Logo"
            width={120}
            height={120}
            priority
          />
          <h1 className="text-4xl" style={{fontFamily:'\"Playfair Display\", serif'}}>Cover.io</h1>

          {/* Scrolling Chips */}
          <div className="w-full">
            <ScrollingChips onChipClick={handleChipClick} />
          </div>

          {/* Write Your Own Button - removed */}
          {/* <div className="flex justify-center w-full">
            <NavigationBtn
              onClick={() => router.push('/chat?from=write-your-own')}
              className="gap-2 px-6 py-3"
              style={{
                background: 'linear-gradient(137deg, rgba(0, 153, 255, 0.18) 0%, rgba(0, 51, 153, 0.12) 95%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '44.45px',
                outline: '1px rgba(0,153,255,0.05) solid',
                outlineOffset: '-1px',
                minWidth: 0,
                width: 'auto',
                height: 48,
                WebkitBackdropFilter: 'blur(10.67px)',
              }}
              ariaLabel="Write your own"
            >
              <CustomIcon name="write" size={20} className="text-white" />
              <span>Write your own</span>
            </NavigationBtn>
          </div> */}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      <SharedHistory open={showHistory} onClose={() => setShowHistory(false)} type="home" />
    </>
  )
}
