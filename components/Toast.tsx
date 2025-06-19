'use client'

import React from 'react'
import { useToast as useToastHook } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Trash2, AlertTriangle, Check } from 'lucide-react'
import { PulseLoader } from 'react-spinners'

interface DeleteConfirmationToastProps {
  title?: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
  itemName?: string
}

interface DocumentGenerationToastProps {
  onComplete?: () => void
}

export function useCustomToast() {
  const { toast, dismiss } = useToastHook()

  const showDeleteConfirmation = ({
    title = 'Delete Confirmation',
    description,
    onConfirm,
    onCancel,
    itemName
  }: DeleteConfirmationToastProps) => {
    const defaultDescription = itemName 
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : 'Are you sure you want to delete this item? This action cannot be undone.'

    toast({
      title: title,
      description: (
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{description || defaultDescription}</span>
        </div>
      ),
      duration: 5000, // 5 seconds
      className: "rounded-xl border-0",
      style: {
        background: 'linear-gradient(137deg, rgba(255,255,255,0.23) 0%, rgba(113,113,113,0.19) 40%)',
        backdropFilter: 'blur(10.67px)',
        WebkitBackdropFilter: 'blur(10.67px)',
        outline: '1px rgba(255,255,255,0.10) solid',
        outlineOffset: '-1px',
        boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
      }
    })
  }

  const showDocumentGeneration = ({ onComplete }: DocumentGenerationToastProps = {}) => {
    console.log('Document generation toast triggered!')
    let currentToastId: string | undefined

    // Step 1: "Generating" message for 3 seconds
    const generatingToast = toast({
      title: (
        <div className="flex items-center gap-3 w-fit">
          <PulseLoader size={8} color="#ffffff" speedMultiplier={1} />
          <span>Generating</span>
        </div>
      ) as any,
      duration: 3000, // 3 seconds
      className: "rounded-full border-0 w-fit",
      style: {
        background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
        boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
        outline: '1px rgba(255, 255, 255, 0.10) solid',
        outlineOffset: '-1px',
        backdropFilter: 'blur(10.67px)',
        WebkitBackdropFilter: 'blur(10.67px)',
        padding: '12px 12px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        maxWidth: 'none',
        width: 'fit-content',
        position: 'fixed',
        bottom: 'calc(100px + 80px)', // Just above the chat input (100px from bottom + 80px gap)
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        right: 'auto',
        margin: '0 auto'
      }
    })
    currentToastId = generatingToast.id
    console.log('Generating toast shown:', generatingToast.id)

    // Step 2: "Taking time" message for 3 seconds
    setTimeout(() => {
      const takingTimeToast = toast({
        title: (
          <div className="flex items-center gap-3 w-fit">
            <PulseLoader size={8} color="#ffffff" speedMultiplier={1} />
            <span>Taking time</span>
          </div>
        ) as any,
        duration: 3000, // 3 seconds
        className: "rounded-full border-0 w-fit",
        style: {
          background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
          boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
          outline: '1px rgba(255, 255, 255, 0.10) solid',
          outlineOffset: '-1px',
          backdropFilter: 'blur(10.67px)',
          WebkitBackdropFilter: 'blur(10.67px)',
          padding: '12px 12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#ffffff',
          maxWidth: 'none',
          width: 'fit-content',
          position: 'fixed',
          bottom: 'calc(100px + 80px)', // Just above the chat input (100px from bottom + 80px gap)
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          right: 'auto',
          margin: '0 auto'
        }
      })
      currentToastId = takingTimeToast.id
      console.log('Taking time toast shown:', takingTimeToast.id)
    }, 3000)

    // Step 3: "Generated" message with check icon for 2 seconds
    setTimeout(() => {
      const generatedToast = toast({
        title: (
          <div className="flex items-center gap-3 w-fit">
            <Check className="h-4 w-4 text-white" />
            <span>Generated</span>
          </div>
        ) as any,
        duration: 2000, // 2 seconds
        className: "rounded-full border-0 w-fit",
        style: {
          background: 'linear-gradient(137deg, rgba(255, 255, 255, 0.23) 0%, rgba(113.69, 113.69, 113.69, 0.19) 40%)',
          boxShadow: '0px 0.8890371322631836px 21.336891174316406px -0.8890371322631836px rgba(0, 0, 0, 0.18)',
          outline: '1px rgba(255, 255, 255, 0.10) solid',
          outlineOffset: '-1px',
          backdropFilter: 'blur(10.67px)',
          WebkitBackdropFilter: 'blur(10.67px)',
          padding: '12px 12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#ffffff',
          maxWidth: 'none',
          width: 'fit-content',
          position: 'fixed',
          bottom: 'calc(100px + 80px)', // Just above the chat input (100px from bottom + 80px gap)
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          right: 'auto',
          margin: '0 auto'
        }
      })
      currentToastId = generatedToast.id
      console.log('Generated toast shown:', generatedToast.id)

      // Call onComplete callback after the final toast
      setTimeout(() => {
        onComplete?.()
      }, 2000)
    }, 6000) // 3 + 3 = 6 seconds total before this step

    return {
      dismiss: () => {
        if (currentToastId) {
          dismiss(currentToastId)
        }
      }
    }
  }

  return { showDeleteConfirmation, showDocumentGeneration }
}

// Alternative: Direct component approach
export function Toast({ onComplete }: DocumentGenerationToastProps) {
  const { showDocumentGeneration } = useCustomToast()

  const triggerGeneration = () => {
    showDocumentGeneration({ onComplete })
  }

  return { triggerGeneration }
}

// Example usage component for delete
export function DeleteButton({ 
  onDelete, 
  itemName, 
  className = "text-red-500 hover:text-red-700" 
}: {
  onDelete: () => void
  itemName?: string
  className?: string
}) {
  const { showDeleteConfirmation } = useCustomToast()

  const handleDeleteClick = () => {
    showDeleteConfirmation({
      itemName,
      onConfirm: onDelete,
      title: 'Confirm Deletion',
      description: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.'
    })
  }

  return (
    <button
      onClick={handleDeleteClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${className}`}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  )
}

// Example usage component for document generation
export function GenerateDocumentButton({ 
  onGenerate,
  className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
}: {
  onGenerate: () => void
  className?: string
}) {
  const { showDocumentGeneration } = useCustomToast()

  const handleGenerateClick = () => {
    showDocumentGeneration({
      onComplete: onGenerate
    })
  }

  return (
    <button
      onClick={handleGenerateClick}
      className={className}
    >
      Generate Document
    </button>
  )
} 