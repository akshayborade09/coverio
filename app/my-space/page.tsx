"use client"

import { Home, FileLineChartIcon as FileLines, Layout, Copy, Trash2, FileText } from "lucide-react"
import Link from "next/link"

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
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PDF</span>
          </div>
        )
      case "doc":
        return (
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">DOC</span>
          </div>
        )
      case "linkedin":
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">in</span>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#ffffff] relative">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-medium">9:41</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-1 bg-[#ffffff] rounded-full"></div>
            <div className="h-3 w-1 bg-[#ffffff] rounded-full"></div>
            <div className="h-4 w-1 bg-[#ffffff] rounded-full"></div>
            <div className="h-5 w-1 bg-[#ffffff] rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L12 2L23 9V22H1V9Z" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div className="h-3 w-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="h-3 w-6 border border-[#ffffff] rounded-sm relative">
              <div className="absolute top-0 left-0 bottom-0 right-2 bg-[#ffffff]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 rounded-full bg-[#dec53b] flex items-center justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <div className="w-8 h-2 bg-black rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-serif mb-1">Akshay Borhade</h1>
        <p className="text-[#ffffff] opacity-70">UX Team Lead @ OLA</p>
      </div>

      {/* Documents List */}
      <div className="flex-1 px-6 space-y-4 overflow-y-auto">
        {documents.map((doc, index) => (
          <div key={index} className="bg-[#202020] rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#ffffff] opacity-70" />
                <span className="text-[#ffffff] opacity-70 text-sm">{doc.type}</span>
              </div>
              <span className="text-[#405059] text-xs">{doc.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(doc.icon)}
                <span className="text-[#ffffff] flex-1">{doc.name}</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-[#405059] rounded-full flex items-center justify-center">
                  <Copy size={16} className="text-[#ffffff]" />
                </button>
                <button className="w-8 h-8 bg-[#405059] rounded-full flex items-center justify-center">
                  <Trash2 size={16} className="text-[#ffffff]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 mb-8 flex items-center gap-4 mt-6">
        <Link href="/" className="w-16 h-16 bg-[#405059] rounded-full flex items-center justify-center">
          <Home size={24} className="text-[#ffffff]" />
        </Link>
        <Link href="/cover-letter" className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <FileLines size={20} />
          <span>Cover letter</span>
        </Link>
        <button className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <Layout size={20} />
          <span>My Space</span>
        </button>
      </div>
    </div>
  )
}
