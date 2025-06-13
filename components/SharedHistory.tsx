import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import CustomIcon from "@/components/CustomIcon";
import NavigationBtn from "@/components/NavigationBtn";
import { useRouter } from "next/navigation";

// Mocked history data
const mockHistory = [
  {
    id: "1",
    prompt: "Write a cover letter for a software engineer role at Google.",
    date: "2024-06-10T10:30:00Z",
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
    date: "2024-06-09T15:45:00Z",
    documents: [
      { type: "doc", name: "PM_Resume.docx" },
      { type: "pdf", name: "PM_JobDesc.pdf" },
    ],
  },
  {
    id: "3",
    prompt: "Research about Tesla's company culture.",
    date: "2024-06-08T08:20:00Z",
    documents: [
      { type: "link", name: "https://tesla.com/careers" },
    ],
  },
];

const coverLetterTitles = [
  'Write a cover letter for a software engineer role at Google.',
  'Summarize my experience for a product manager position.',
  "Research about Tesla's company culture."
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

  // State for loaded history
  const [history, setHistory] = useState(mockHistory);

  useEffect(() => {
    if (open) {
      const localHistory = localStorage.getItem('chatHistory');
      let combinedHistory = [];
      if (localHistory) {
        try {
          const parsed = JSON.parse(localHistory);
          if (Array.isArray(parsed)) {
            // Combine local and mock, avoiding duplicates by id
            const localIds = new Set(parsed.map((s: any) => s.id));
            const filteredMock = mockHistory.filter((s) => !localIds.has(s.id));
            combinedHistory = [...parsed, ...filteredMock];
          }
        } catch {}
      }
      if (combinedHistory.length > 0) {
        setHistory(combinedHistory);
      } else {
        setHistory(mockHistory);
      }
    }
  }, [open]);

  const handleHistoryClick = (idx: number, sessionId?: string) => {
    if (type === 'cover-letter') {
      onSelectHistory?.(idx);
    } else {
      // In home mode, navigate to cover letter page with session id
      router.push(`/cover-letter?id=${sessionId || idx}`);
    }
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="left" className="w-full max-w-full bg-white/5 backdrop-blur-xl border-none rounded-none shadow-2xl p-0 flex flex-col" style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-4">
          <h2 className="text-2xl font-base text-white font-playfair">History</h2>
          <NavigationBtn
            onClick={onClose}
            ariaLabel="Close history drawer"
            size={40}
          >
            <CustomIcon name="close" size={20} className="text-[#ffffff]" />
          </NavigationBtn>
        </div>
        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {history.map((session, idx) => (
            <div
              key={session.id || idx}
              className="mb-3 rounded-2xl p-3 flex flex-col gap-2"
              onClick={() => handleHistoryClick(idx, session.id)}
              role="button"
              tabIndex={0}
              style={{
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Title */}
              <a
                href="#"
                className="text-white text-sm font-regular mb-1"
                style={{ cursor: 'pointer' }}
                tabIndex={0}
              >
                {type === 'cover-letter' ? coverLetterTitles[idx] : session.prompt}
              </a>
              {/* Date below title */}
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