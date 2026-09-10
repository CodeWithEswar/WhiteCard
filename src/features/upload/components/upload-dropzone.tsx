import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload01Icon, Alert02Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { ACCEPT_STRING } from '../upload.constants'
import { useAppReducedMotion } from '@/lib/motion'

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  compact?: boolean
  disabled?: boolean
}

export function UploadDropzone({
  onFilesSelected,
  compact = false,
  disabled = false,
}: UploadDropzoneProps) {
  const reduceMotion = useAppReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isInvalidDrag, setIsInvalidDrag] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    setIsDragActive(true)

    // Check if dragging files
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0]
      if (item.kind !== 'file') {
        setIsInvalidDrag(true)
      } else {
        setIsInvalidDrag(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsInvalidDrag(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setIsInvalidDrag(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      onFilesSelected(files)
    }
  }

  const handleClick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesSelected(files)
      e.target.value = '' // Reset so same file can be selected again
    }
  }

  // Section 123 & 124: Compact variant after first selection
  if (compact) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group p-3 rounded-xl border border-dashed transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
          isDragActive
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_STRING}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
        <AppIcon icon={PlusSignIcon} size={15} className="group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium">Add more files</span>
      </div>
    )
  }

  return (
    <motion.div
      layout={!reduceMotion}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring min-h-[190px] sm:min-h-[220px] ${
        isInvalidDrag
          ? 'border-destructive/80 bg-destructive/5 text-destructive'
          : isDragActive
          ? 'border-primary bg-primary/5 text-primary scale-[1.005]'
          : 'border-border/80 bg-muted/15 hover:bg-muted/30 hover:border-border text-muted-foreground'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_STRING}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div
        className={`size-12 rounded-2xl border flex items-center justify-center mb-3 transition-transform duration-150 group-hover:-translate-y-0.5 ${
          isInvalidDrag
            ? 'border-destructive/40 bg-destructive/10 text-destructive'
            : isDragActive
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-card text-foreground shadow-xs'
        }`}
      >
        <AppIcon icon={isInvalidDrag ? Alert02Icon : Upload01Icon} size={22} />
      </div>

      <div className="space-y-1 max-w-sm">
        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {isInvalidDrag
            ? 'This file type is not supported'
            : isDragActive
            ? 'Release to add your documents'
            : 'Drop documents here, or choose files from your device'}
        </p>
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
          PDF, images, ZIP and supported office documents up to 50 MB
        </p>
      </div>

      <button
        type="button"
        tabIndex={-1}
        className="mt-4 px-3.5 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted font-medium text-xs text-foreground shadow-xs transition-colors"
      >
        Browse files
      </button>
    </motion.div>
  )
}
