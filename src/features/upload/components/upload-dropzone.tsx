import React, { useRef, useState } from 'react'
import {
  Upload01Icon,
  File01Icon,
  FileValidationIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  className?: string
}

export function UploadDropzone({
  onFilesSelected,
  disabled = false,
  className = '',
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      onFilesSelected(filesArray)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      onFilesSelected(filesArray)
      // reset so same file can be selected again if needed
      e.target.value = ''
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 transition-all duration-200 text-center pattern-grid-micro ${
        isDragging
          ? 'border-primary bg-primary/5 scale-[0.99]'
          : 'border-dashed border-border/90 bg-surface hover:border-border-strong'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="sr-only"
        id="vault-file-upload-input"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.zip,.doc,.docx,.xls,.xlsx"
      />

      <div
        className={`size-14 rounded-2xl border flex items-center justify-center mb-4 transition-all ${
          isDragging
            ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-md'
            : 'border-border bg-surface-muted/80 text-foreground'
        }`}
      >
        <AppIcon
          icon={isDragging ? FileValidationIcon : Upload01Icon}
          size={26}
        />
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {isDragging ? 'Release files to deposit' : 'Drop important files here'}
      </h3>

      <p className="mt-1.5 text-xs text-muted-foreground max-w-sm leading-relaxed">
        PDF, images (PNG, JPG), ZIP archives, or office documents up to 50MB.
        Files are preserved in original format.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 px-4 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs active:scale-[0.985]"
        >
          <AppIcon icon={File01Icon} size={15} />
          <span>Browse Files</span>
        </Button>
      </div>
    </div>
  )
}
