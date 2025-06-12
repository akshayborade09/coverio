import FileCard from "./FileCard"

export default function FileCardsDemo() {
  const handleDownload = (fileName: string) => {
    console.log(`Downloading ${fileName}`)
    // Add your download logic here
  }

  const handleShare = (fileName: string) => {
    console.log(`Sharing ${fileName}`)
    // Add your share logic here
  }

  const handleFileClick = (fileName: string) => {
    console.log(`Opening ${fileName}`)
    // Add your file open logic here
  }

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-white text-xl font-playfair font-semibold mb-6">My Files</h2>
      
      <FileCard
        fileName="Resume2025.pdf"
        fileType="PDF"
        date="28 May'25 at 6:00pm"
        iconSrc="https://placehold.co/30x30/ff6b6b/ffffff?text=PDF"
        onDownload={() => handleDownload("Resume2025.pdf")}
        onShare={() => handleShare("Resume2025.pdf")}
        onClick={() => handleFileClick("Resume2025.pdf")}
      />

      <FileCard
        fileName="CoverLetter.docx"
        fileType="DOCX"
        date="27 May'25 at 3:30pm"
        iconSrc="https://placehold.co/30x30/4ecdc4/ffffff?text=DOC"
        onDownload={() => handleDownload("CoverLetter.docx")}
        onShare={() => handleShare("CoverLetter.docx")}
        onClick={() => handleFileClick("CoverLetter.docx")}
      />

      <FileCard
        fileName="Portfolio.zip"
        fileType="ZIP"
        date="26 May'25 at 1:15pm"
        iconSrc="https://placehold.co/30x30/45b7d1/ffffff?text=ZIP"
        onDownload={() => handleDownload("Portfolio.zip")}
        onShare={() => handleShare("Portfolio.zip")}
        onClick={() => handleFileClick("Portfolio.zip")}
      />

      <FileCard
        fileName="Interview_Notes.txt"
        fileType="TXT"
        date="25 May'25 at 11:45am"
        iconSrc="https://placehold.co/30x30/f9ca24/ffffff?text=TXT"
        onDownload={() => handleDownload("Interview_Notes.txt")}
        onShare={() => handleShare("Interview_Notes.txt")}
        onClick={() => handleFileClick("Interview_Notes.txt")}
      />
    </div>
  )
} 