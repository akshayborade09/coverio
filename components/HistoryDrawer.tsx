import React from "react";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
} from "@/components/ui/sheet";
import CustomIcon from "@/components/CustomIcon";

// Mocked history data
const mockHistory = [
  {
    id: "1",
    prompt: "Write a cover letter for a software engineer role at Google.",
    documents: [
      { type: "pdf", name: "Resume2025.pdf" },
      { type: "doc", name: "JobDesc.docx" },
      { type: "img", name: "ProfilePic.png" },
      { type: "link", name: "https://linkedin.com/in/xyz" },
      { type: "pdf", name: "ExtraDoc.pdf" },
    ],
  },
  {
    id: "2",
    prompt: "Summarize my experience for a product manager position.",
    documents: [
      { type: "doc", name: "PM_Resume.docx" },
      { type: "pdf", name: "PM_JobDesc.pdf" },
    ],
  },
  {
    id: "3",
    prompt: "Research about Tesla's company culture.",
    documents: [
      { type: "link", name: "https://tesla.com/careers" },
    ],
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return "/icons/pdf.svg";
    case "doc":
      return "/icons/doc.svg";
    case "img":
      return "/icons/img.svg";
    case "link":
      return "/icons/link2.svg";
    default:
      return "/icons/document.svg";
  }
}

export default function HistoryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="left" className="w-full max-w-full bg-white/10 backdrop-blur-xl border-none rounded-none shadow-2xl p-0 flex flex-col" style={{ WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <h2 className="text-2xl font-base text-white font-playfair">History</h2>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onClose}
            style={{
              background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
              borderRadius: '50%',
              outline: '1px rgba(255,255,255,0.10) solid',
              outlineOffset: '-1px',
              backdropFilter: 'blur(10.67px)'
            }}
            aria-label="Close history drawer"
          >
            <CustomIcon name="close" size={20} className="text-[#ffffff]" />
          </button>
        </div>
        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {mockHistory.map((session) => (
            <div key={session.id} className="mb-3 bg-white/10 rounded-2xl p-3 flex flex-col gap-2 shadow-lg" 
            style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
              {/* Prompt summary as chip */}
              <div className="inline-block text-white text-sm font-regular max-w-full font-open-sauce">
                {session.prompt.length > 60 ? session.prompt.slice(0, 60) + '…' : session.prompt}
              </div>
              {/* Document icons */}
              <div className="flex items-center gap-2 mt-1">
                {session.documents.slice(0, 4).map((doc, idx) => (
                  <img
                    key={idx}
                    src={getFileIcon(doc.type)}
                    alt={doc.type}
                    width={24}
                    height={24}
                    className="rounded shadow"
                  />
                ))}
                {session.documents.length > 4 && (
                  <span className="ml-2 text-white text-xs font-semibold bg-black/30 px-2 py-0.5 rounded-full">
                    +{session.documents.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 