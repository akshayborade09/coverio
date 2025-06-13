"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import CustomIcon from "@/components/CustomIcon"
import BottomNavigation from "@/components/BottomNavigation"
import ScrollingChips from "@/components/ScrollingChips"
import HistoryDrawer from "@/components/HistoryDrawer"

export default function CoverIoApp() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showHistory, setShowHistory] = useState(false)

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
        router.push('/chat?from=write')
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
              outlineOffset: '-2px',
              backdropFilter: 'blur(10.67px)',
            }}
            onClick={() => setShowHistory(true)}
          >
            <CustomIcon name="history" size={20} className="text-white" />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#dec53b] flex items-center justify-center overflow-hidden z-10">
          <div className="flex flex-col items-center">
            <div className="w-1 h-1 bg-black rounded-full mb-1"></div>
            <div className="w-4 h-1 bg-black rounded-full"></div>
          </div>
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
          <h1 className="text-4xl" style={{fontFamily:'"Playfair Display", serif'}}>Cover.io</h1>

          {/* Scrolling Chips */}
          <div className="w-full">
            <ScrollingChips onChipClick={handleChipClick} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      <HistoryDrawer open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  )
}
