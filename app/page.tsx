"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomIcon from "@/components/CustomIcon"
import BottomNavigation from "@/components/BottomNavigation"

export default function CoverIoApp() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prevent scrolling on mount
  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [])

  const handleAddDocument = () => {
    console.log('Add document clicked')
    fileInputRef.current?.click()
  }

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

  const handleWriteAboutYou = () => {
    console.log('Write about you clicked')
    router.push('/chat?from=write')
  }

  const handlePortfolioURL = () => {
    console.log('Portfolio URL clicked')
    router.push('/chat?from=portfolio')
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
      
      <div className="flex flex-col h-screen text-[#ffffff] relative overflow-hidden">
        {/* Profile Avatar */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#dec53b] flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="w-1 h-1 bg-black rounded-full mb-1"></div>
            <div className="w-4 h-1 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-6 pb-32 -mt-6">
          <h1 className="text-5xl font-serif">Cover.io</h1>

          <div className="w-full flex flex-col gap-4 mt-4 items-center">
            {/* Two buttons side by side */}
            <div className="flex gap-3">
              <div 
                className="p-[1.477px] rounded-[76.948px]"
                style={{
                  background: 'linear-gradient(15deg, rgba(255,255,255,0.4) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.4) 100%)',
                }}
              >
                <button 
                  onClick={handleAddDocument}
                  className="flex items-center gap-2 text-[#ffffff] py-3 px-3 rounded-[76.948px] cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(113.69, 113.69, 113.69, 0.25) 95%)',
                    boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)',
                    backdropFilter: 'blur(20.39114761352539px)',
                    pointerEvents: 'auto'
                  }}
                >
                  <CustomIcon name="file-text, document" size={20} />
                  <span style={{ fontSize: '14px' }}>Add a document</span>
                </button>
              </div>

              <div 
                className="p-[1.477px] rounded-[76.948px]"
                style={{
                  background: 'linear-gradient(15deg, rgba(255,255,255,0.4) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.4) 100%)',
                }}
              >
                <button 
                  onClick={handlePortfolioURL}
                  className="flex items-center gap-2 text-[#ffffff] py-3 px-3 rounded-[76.948px] cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(113.69, 113.69, 113.69, 0.25) 95%)',
                    boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)',
                    backdropFilter: 'blur(20.39114761352539px)',
                    pointerEvents: 'auto'
                  }}
                >
                  <CustomIcon name="link" size={20} />
                  <span style={{ fontSize: '14px' }}>Portfolio URL</span>
                </button>
              </div>
            </div>

            {/* Third button on new row */}
            <div className="flex justify-center">
              <div 
                className="p-[1.477px] rounded-[76.948px]"
                style={{
                  background: 'linear-gradient(15deg, rgba(255,255,255,0.4) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.4) 100%)',
                }}
              >
                <button 
                  onClick={handleWriteAboutYou}
                  className="flex items-center gap-2 text-[#ffffff] py-3 px-3 rounded-[76.948px] cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.10) 0%, rgba(113.69, 113.69, 113.69, 0.25) 95%)',
                    boxShadow: '0px 0.657px 15.762px -0.657px rgba(0, 0, 0, 0.18)',
                    backdropFilter: 'blur(20.39114761352539px)',
                    pointerEvents: 'auto'
                  }}
                >
                  <CustomIcon name="write" size={20} />
                  <span style={{ fontSize: '14px' }}>Write about you</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  )
}
