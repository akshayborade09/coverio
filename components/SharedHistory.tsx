import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import CustomIcon from "@/components/CustomIcon";
import NavigationBtn from "@/components/NavigationBtn";
import { useRouter } from "next/navigation";

interface Document {
  type: string;
  name: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  date: string;
  documents: Document[];
  content: string[];
}

// Hardcoded history data
const historyData: HistoryItem[] = [
  {
    id: "1",
    prompt: "Write a cover letter for a software engineer role at Google.",
    date: "2024-03-20T10:30:00Z",
    documents: [
      { type: "pdf", name: "Resume2024.pdf" },
      { type: "doc", name: "JobDesc.docx" },
      { type: "img", name: "ProfilePic.png" },
      { type: "link", name: "https://linkedin.com/in/xyz" },
      { type: "pdf", name: "ExtraDoc.pdf" },
    ],
    content: [
      "• 5+ years of experience in software development",
      "• Strong background in distributed systems",
      "• Experience with cloud platforms (AWS, GCP)",
      "• Track record of leading technical projects",
      "• Excellent problem-solving abilities"
        ]
  },
  {
    id: "2",
    prompt: "Help me research about Tesla company culture",
    date: "2024-03-19T15:45:00Z",
    documents: [
      { type: "doc", name: "CompanyInfo.docx" },
      { type: "pdf", name: "TeslaCulture.pdf" },
    ],
    content: [
      "• Fast-paced and innovative environment",
      "• Focus on sustainable energy",
      "• Emphasis on direct communication",
      "• High expectations and performance standards",
      "• Opportunities for rapid career growth"
        ]
  },
  {
    id: "3",
    prompt: "Create a presentation about AI trends",
    date: "2024-03-18T08:20:00Z",
    documents: [
      { type: "link", name: "https://ai-trends.com/latest" },
      { type: "doc", name: "AIPresentation.pptx" },
    ],
    content: [
      "• Rise of generative AI models",
      "• Impact on various industries",
      "• Ethical considerations in AI",
      "• Future of AI in workplace",
      "• Investment trends in AI sector"
    ]
  }
];

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return "/Images/space-pdf.svg";
    case "doc":
      return "/Images/space-doc.svg";
    case "img":
      return "/Images/space-doc.svg";
    case "link":
      return "/Images/space-link.svg";
    default:
      return "/Images/space-doc.svg";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

interface SharedHistoryProps {
  open: boolean;
  onClose: () => void;
  onSelectHistory?: (idx: number) => void;
  type?: 'home' | 'cover-letter';
}

export default function SharedHistory({ 
  open, 
  onClose, 
  onSelectHistory,
  type = 'home'
}: SharedHistoryProps) {
  const router = useRouter();
  const [history] = useState(historyData);

  const handleHistoryClick = (idx: number, sessionId?: string) => {
    if (type === 'cover-letter') {
      onSelectHistory?.(idx);
    } else {
      router.push(`/cover-letter?id=${sessionId || idx}`);
    }
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <SheetContent side="left" className="w-full max-w-full bg-white/5 backdrop-blur-xl border-none rounded-none shadow-2xl p-0 flex flex-col" style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <div className="flex items-center gap-3">
            <NavigationBtn
              onClick={onClose}
              ariaLabel="Close history drawer"
              size={48}
            >
              <CustomIcon name="close" size={20} className="text-[#ffffff]" />
            </NavigationBtn>
            <h2 className="text-2xl font-base text-white font-playfair">History</h2>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {history.map((session: HistoryItem, idx: number) => (
            <div
              key={session.id}
              className="mb-3 rounded-2xl p-3 flex flex-col gap-2 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleHistoryClick(idx, session.id)}
              role="button"
              tabIndex={0}
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Title */}
              <div className="flex justify-between items-start">
                <span className="text-white text-sm font-regular mb-1 flex-1">
                  {session.prompt}
                </span>
              </div>

              {/* Date */}
              <div className="text-white text-xs font-normal opacity-60 mt-0.5 mb-1" style={{fontSize:12}}>
                {formatDate(session.date)}
              </div>

              {/* Document icons */}
              {session.documents && session.documents.length > 0 && (
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
                    <span className="text-white text-xs font-semibold bg-black/30 px-2 py-1.5 rounded-full">
                      +{session.documents.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 