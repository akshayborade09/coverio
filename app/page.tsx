"use client"

import { useState } from "react"
import { FileText, LucideLink, Upload, Paperclip, Home, FileLineChartIcon as FileLines, Layout } from "lucide-react"
import Link from "next/link"

export default function CoverIoApp() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#ffffff] relative">
      {/* Profile Avatar */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#dec53b] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-1 h-1 bg-black rounded-full mb-1"></div>
          <div className="w-4 h-1 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-5xl font-serif">Homepage</h1>

        <div className="w-full flex flex-col gap-4 mt-8">
          <button className="flex items-center gap-2 bg-[#202020] text-[#ffffff] py-3 px-6 rounded-full">
            <FileText size={20} />
            <span>Add a PDF</span>
          </button>

          <button className="flex items-center gap-2 bg-[#202020] text-[#ffffff] py-3 px-6 rounded-full">
            <LucideLink size={20} />
            <span>LinkedIn URL</span>
          </button>

          <button className="flex items-center gap-2 bg-[#202020] text-[#ffffff] py-3 px-6 rounded-full">
            <FileText size={20} />
            <span>Add a document</span>
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 mb-6">
        <div className="bg-[#202020] rounded-3xl p-4 flex items-center">
          <input
            type="text"
            placeholder="Write something about your self"
            className="bg-transparent border-none outline-none flex-1 text-[#ffffff] placeholder-[#405059]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-[#405059] rounded-full flex items-center justify-center">
              <Paperclip size={20} className="text-[#ffffff]" />
            </button>
            <button className="w-10 h-10 bg-[#405059] rounded-full flex items-center justify-center">
              <Upload size={20} className="text-[#ffffff]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 mb-8 flex items-center gap-4">
        <Link href="/" className="w-16 h-16 bg-[#405059] rounded-full flex items-center justify-center">
          <Home size={24} className="text-[#ffffff]" />
        </Link>
        <Link href="/cover-letter" className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <FileLines size={20} />
          <span>Cover letter</span>
        </Link>
        <Link href="/my-space" className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <Layout size={20} />
          <span>My Space</span>
        </Link>
      </div>
    </div>
  )
}
