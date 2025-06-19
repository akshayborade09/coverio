"use client"

import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import Image from "next/image"
import { useState } from "react"

export default function MySpacePage() {
  const [showDownloadToast, setShowDownloadToast] = useState(false)
  const [downloadToastData, setDownloadToastData] = useState<{
    icon: string
    name: string
    action: 'download' | 'delete'
  } | null>(null)
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [deleteToastData, setDeleteToastData] = useState<{
    doc: any
    index: number
  } | null>(null)
  const [documents, setDocuments] = useState([
    {
      type: "PDF",
      name: "Resume2025.pdf",
      date: "28 May'25 at 6:00pm",
      icon: "pdf",
    },
    {
      type: "Document",
      name: "OLA Company Job Desc...",
      date: "28 May'25 at 6:00pm",
      icon: "doc",
    },
    {
      type: "Document",
      name: "Google Company Job D...",
      date: "28 May'25 at 6:00pm",
      icon: "doc",
    },
    {
      type: "Link",
      name: "https://www.linkedin.com/in/contac...",
      date: "28 May'25 at 6:00pm",
      icon: "linkedin",
    },
    {
      type: "PDF",
      name: "Resume2024.pdf",
      date: "28 May'25 at 6:00pm",
      icon: "pdf",
    },
  ])

  const handleDownload = (doc: any) => {
    // Show download toast
    setDownloadToastData({
      icon: doc.icon,
      name: doc.name,
      action: 'download'
    })
    setShowDownloadToast(true)

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowDownloadToast(false)
      setDownloadToastData(null)
    }, 3000)

    // Simulate download (you can add actual download logic here)
    console.log(`Downloading ${doc.name}`)
  }

  const handleDelete = (doc: any, index: number) => {
    setDeleteToastData({ doc, index })
    setShowDeleteToast(true)
  }

  const confirmDelete = () => {
    if (deleteToastData) {
      const { doc, index } = deleteToastData
      
      // Remove the document from the list
      const newDocuments = documents.filter((_, i) => i !== index)
      setDocuments(newDocuments)
      
      // Show success toast
      setDownloadToastData({
        icon: doc.icon,
        name: doc.name,
        action: 'delete'
      })
      setShowDownloadToast(true)

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowDownloadToast(false)
        setDownloadToastData(null)
      }, 3000)
    }
    
    setShowDeleteToast(false)
    setDeleteToastData(null)
  }

  const cancelDelete = () => {
    setShowDeleteToast(false)
    setDeleteToastData(null)
  }

  const getFileIcon = (iconType: string) => {
    switch (iconType) {
      case "pdf":
        return (
          <img 
            src="/Images/space-pdf.svg" 
            alt="PDF icon" 
            className="w-8 h-8"
            width={32}
            height={32}
          />
        )
      case "doc":
        return (
          <img 
            src="/Images/space-doc.svg" 
            alt="Document icon" 
            className="w-8 h-8"
            width={32}
            height={32}
          />
        )
      case "linkedin":
        return (
          <img 
            src="/Images/space-link.svg" 
            alt="Link icon" 
            className="w-8 h-8"
            width={32}
            height={32}
          />
        )
      case "img":
        return (
          <img 
            src="/Images/space-img.svg" 
            alt="Image icon" 
            className="w-8 h-8"
            width={32}
            height={32}
          />
        )
      default:
        return (
          <img 
            src="/Images/space-doc.svg" 
            alt="Document icon" 
            className="w-8 h-8"
            width={32}
            height={32}
          />
        )
    }
  }

  const getToastIcon = (iconType: string) => {
    switch (iconType) {
      case "pdf":
        return "/Images/space-pdf.svg"
      case "doc":
        return "/Images/space-doc.svg"
      case "linkedin":
        return "/Images/space-link.svg"
      case "img":
        return "/Images/space-img.svg"
      default:
        return "/Images/space-doc.svg"
    }
  }

  const truncateFileName = (fileName: string) => {
    // Remove file extension
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "")
    // Truncate to 12 characters
    return nameWithoutExtension.length > 12 
      ? nameWithoutExtension.substring(0, 12) + "..."
      : nameWithoutExtension
  }

  return (
    <>
      <div className="flex flex-col min-h-screen text-white relative pb-24 bg-[#0d0c0c]">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src="/Images/avatar-01.svg"
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl mb-1 font-playfair">Akshay Borhade</h1>
          <p className="text-white opacity-70 font-playfair">UX Team Lead @ OLA</p>
        </div>

        {/* Documents List */}
        <div className="flex-1 px-4 space-y-4 overflow-y-auto">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="p-0 rounded-2xl"
              style={{
                background: 'linear-gradient(15deg, rgba(255,255,255,0.04) 10%, rgba(255, 255, 255, 0) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)'
              }}
            >
              <div 
                className="rounded-2xl p-3"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <CustomIcon 
                      name={doc.type === "Link" ? "link2" : "document"} 
                      size={16} 
                      className="text-white opacity-70" 
                    />
                    <span className="text-white opacity-70 text-xs font-open-sauce leading-[18px]">
                      {doc.type}
                    </span>
                  </div>
                  <span className="text-white opacity-30 text-xs font-open-sauce leading-[18px] text-right">
                    {doc.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(doc.icon)}
                    <span className="text-white flex-1 break-words text-sm font-open-sauce leading-[22px]">
                      {doc.name}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 opacity-70">
                    {doc.type !== "Link" && (
                      <button className="w-8 h-8 rounded-full flex items-center justify-center" onClick={() => handleDownload(doc)}>
                        <CustomIcon name="doc-download" size={20} className="text-white" />
                      </button>
                    )}
                    <button className="w-8 h-8 rounded-full flex items-center justify-center" onClick={() => handleDelete(doc, index)}>
                      <CustomIcon name="doc-delete" size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Download Toast */}
      {showDownloadToast && downloadToastData && (
        <div 
          className="fixed left-4 right-4 z-50"
          style={{ bottom: '108px' }}
        >
          <div className="flex items-center justify-center">
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-full text-white text-sm font-medium"
              style={{
                background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
                outline: '1px rgba(255,255,255,0.10) solid',
                outlineOffset: '-1px',
                backdropFilter: 'blur(10.67px)',
                WebkitBackdropFilter: 'blur(10.67px)',
                boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
              }}
            >
              <img 
                src={getToastIcon(downloadToastData.icon)} 
                alt="File icon" 
                className="w-5 h-5"
                width={20}
                height={20}
              />
              <span className="font-open-sauce">
                {truncateFileName(downloadToastData.name)} {downloadToastData.action === 'download' ? 'downloaded' : 'deleted'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Toast */}
      {showDeleteToast && deleteToastData && (
        <div className="fixed bottom-24 left-4 right-4 z-10">
          <div className="flex items-center justify-between gap-2 pl-4 pr-3 py-3 rounded-full" style={{
            background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
            boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
            outline: '1px rgba(255, 255, 255, 0.10) solid',
            outlineOffset: '-1px',
            backdropFilter: 'blur(10.67px)',
          }}>
            <span className="text-white text-sm font-medium flex-1 mr-2">
              Confirm Delete?
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={confirmDelete} 
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-full transition-colors"
              >
                Confirm
              </button>
              <button 
                onClick={cancelDelete} 
                className="w-8 h-8 flex items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity" 
                style={{
                  background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
                  borderRadius: '20px',
                }}
              >
                <CustomIcon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </>
  )
}
