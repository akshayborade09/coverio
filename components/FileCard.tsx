import CustomIcon from "./CustomIcon"

interface FileCardProps {
  fileName: string
  fileType: string
  date: string
  iconSrc?: string
  onDownload?: () => void
  onShare?: () => void
  onClick?: () => void
}

export default function FileCard({ 
  fileName, 
  fileType, 
  date, 
  iconSrc = "https://placehold.co/30x30",
  onDownload,
  onShare,
  onClick
}: FileCardProps) {
  return (
    <div 
      className="w-full p-4 glassmorphic-card rounded-[20px] flex flex-col gap-4 cursor-pointer"
      onClick={onClick}
    >
      {/* Header with file type and date */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-start gap-1">
          {/* File type icon */}
          <CustomIcon name="document" size={20} className="text-white" />
          <div className="text-white text-sm font-normal leading-[21px] font-open-sauce-one">
            {fileType}
          </div>
        </div>
        <div className="opacity-30 text-right text-white text-xs font-normal leading-[18px] font-open-sauce-one">
          {date}
        </div>
      </div>

      {/* Main content with file info and actions */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* File thumbnail */}
          <div className="w-[30px] h-[30px] relative">
            <img 
              className="w-[30px] h-[30px] absolute left-0 top-0 rounded object-cover" 
              src={iconSrc} 
              alt="File icon"
            />
          </div>
          <div className="text-white text-sm font-normal leading-[21px] font-open-sauce-one">
            {fileName}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="opacity-50 flex items-center gap-5">
          {/* Download button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownload?.()
            }}
            className="w-5 h-5 hover:opacity-100 transition-opacity duration-200"
          >
            <CustomIcon name="download" size={20} className="text-white" />
          </button>
          
          {/* Share button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare?.()
            }}
            className="w-5 h-5 hover:opacity-100 transition-opacity duration-200"
          >
            <CustomIcon name="share" size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
} 