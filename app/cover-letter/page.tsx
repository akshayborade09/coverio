"use client"

import { Play, Share, Edit, Home, FileLineChartIcon as FileLines, Layout, FileText } from "lucide-react"
import Link from "next/link"

export default function CoverLetterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#ffffff] relative">
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 px-6 mb-6">
        <button className="flex items-center gap-2 bg-[#405059] text-[#ffffff] py-3 px-6 rounded-full">
          <FileText size={20} />
          <span>Summarise</span>
        </button>
        <button className="w-12 h-12 bg-[#405059] rounded-full flex items-center justify-center">
          <Play size={20} className="text-[#ffffff] ml-1" />
        </button>
        <button className="w-12 h-12 bg-[#405059] rounded-full flex items-center justify-center">
          <Share size={20} className="text-[#ffffff]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 space-y-6 overflow-y-auto">
        {/* Proven Impact Section */}
        <div className="bg-[#202020] rounded-3xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#ffffff] opacity-70">Proven Impact</h2>
            <button className="text-[#ffffff] opacity-70">
              <Edit size={20} />
            </button>
          </div>
          <ul className="space-y-4 text-[#ffffff]">
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>778% user growth and 99% Day 1 retention through strategic design improvements</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>40% increase in monthly active users and resolved critical Day 0 retention issues</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>1,500%+ session growth rates by optimizing user flows and engagement patterns</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>Consistently improved retention across Day 1, Day 7, and Day 30 metrics</span>
            </li>
          </ul>
        </div>

        {/* Core Strengths Section */}
        <div className="bg-[#202020] rounded-3xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#ffffff] opacity-70">Core Strengths</h2>
            <button className="text-[#ffffff] opacity-70">
              <Edit size={20} />
            </button>
          </div>
          <ul className="space-y-4 text-[#ffffff]">
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>Cross-industry expertise: Mobility, fintech, parenting solutions, and international markets</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>End-to-end ownership: From strategy and prototyping to developer handoff and metrics analysis</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ffffff] mr-3 mt-2">•</span>
              <span>Technical innovation: AI workflows for design-to-code automation and</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 mb-8 flex items-center gap-4 mt-6">
        <Link href="/" className="w-16 h-16 bg-[#405059] rounded-full flex items-center justify-center">
          <Home size={24} className="text-[#ffffff]" />
        </Link>
        <button className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <FileLines size={20} />
          <span>Cover letter</span>
        </button>
        <Link href="/my-space" className="flex-1 bg-[#202020] py-4 px-6 rounded-full flex items-center gap-2">
          <Layout size={20} />
          <span>My Space</span>
        </Link>
      </div>
    </div>
  )
}
