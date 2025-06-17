"use client"

import BottomNavigation from "@/components/BottomNavigation"
import CustomIcon from "@/components/CustomIcon"
import Image from "next/image"

export default function MySpacePage() {
  const documents = [
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
  ]

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

  return (
    <>
      <div className="flex flex-col min-h-screen text-white relative pb-24">
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
                      <button className="w-8 h-8 rounded-full flex items-center justify-center">
                        <CustomIcon name="doc-download" size={20} className="text-white" />
                      </button>
                    )}
                    <button className="w-8 h-8 rounded-full flex items-center justify-center">
                      <CustomIcon name="doc-delete" size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
