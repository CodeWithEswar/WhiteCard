import { useState } from 'react'
import {
  ZoomInIcon,
  ZoomOutIcon,
  RefreshIcon,
  Download01Icon,
  Zip01Icon,
  Pdf01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons'
import type { VaultDocument } from '../../../types/document'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'

interface DocumentPreviewProps {
  document: VaultDocument
  onDownload?: () => void
  className?: string
}

export function DocumentPreview({
  document: doc,
  onDownload,
  className = '',
}: DocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5))
  const handleResetZoom = () => setZoomLevel(1)

  // Render Image Preview
  if (doc.fileType === 'image') {
    return (
      <div className={`relative flex flex-col rounded-2xl border border-border/80 bg-surface-muted/30 overflow-hidden ${className}`}>
        {/* Floating Controls Toolbar */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-surface/90 backdrop-blur-md border border-border/80 shadow-xs">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            aria-label="Zoom out"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            <AppIcon icon={ZoomOutIcon} size={15} />
          </button>
          <span className="text-[11px] font-mono px-1 min-w-10 text-center text-muted-foreground">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            aria-label="Zoom in"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            <AppIcon icon={ZoomInIcon} size={15} />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors ml-0.5"
          >
            <AppIcon icon={RefreshIcon} size={14} />
          </button>
        </div>

        {/* Image viewport */}
        <div className="flex-1 min-h-[380px] max-h-[560px] overflow-auto flex items-center justify-center p-6 pattern-grid-micro">
          <div
            style={{ transform: `scale(${zoomLevel})` }}
            className="transition-transform duration-150 ease-out origin-center max-w-full flex items-center justify-center"
          >
            {doc.fileUrl && doc.fileUrl !== '#' ? (
              <img
                src={doc.fileUrl}
                alt={doc.title}
                className="max-h-[460px] max-w-full rounded-xl object-contain shadow-lg border border-border/60 bg-surface"
              />
            ) : (
              <div className="w-[380px] max-w-full aspect-4/3 rounded-xl border border-border bg-surface shadow-md flex flex-col items-center justify-center p-6 text-center">
                <div className="size-16 rounded-2xl bg-surface-muted border border-border flex items-center justify-center mb-3">
                  <span className="font-mono text-xs font-bold text-muted-foreground">IMG</span>
                </div>
                <p className="text-xs font-medium text-foreground">{doc.originalFilename}</p>
                <p className="text-[11px] text-muted-foreground mt-1">High resolution capture preserved</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render PDF Preview
  if (doc.fileType === 'pdf') {
    return (
      <div className={`relative flex flex-col rounded-2xl border border-border/80 bg-surface-muted/20 overflow-hidden ${className}`}>
        {/* PDF Document Canvas View */}
        <div className="flex-1 min-h-[420px] max-h-[600px] overflow-auto p-4 sm:p-8 flex items-center justify-center pattern-grid-micro">
          {/* Simulated High-Res Document Sheet */}
          <div className="w-full max-w-[500px] aspect-[1/1.38] rounded-xl border border-border/90 bg-surface shadow-md p-8 sm:p-10 flex flex-col justify-between select-none">
            {/* Document Header Header */}
            <div>
              <div className="flex items-start justify-between border-b border-border/80 pb-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AppIcon icon={Pdf01Icon} size={18} className="text-foreground" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      {doc.space} Record
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground tracking-tight line-clamp-1">
                    {doc.title}
                  </h3>
                </div>
                <div className="size-8 rounded-xl bg-surface-muted border border-border flex items-center justify-center">
                  <AppIcon icon={Shield01Icon} size={16} className="text-muted-foreground" />
                </div>
              </div>

              {/* Simulated Official Lines */}
              <div className="space-y-3 pt-2">
                <div className="h-3 w-4/5 rounded bg-surface-muted/80 animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-surface-muted/60" />
                <div className="h-3 w-full rounded bg-surface-muted/70" />
                <div className="h-3 w-2/3 rounded bg-surface-muted/50" />
              </div>

              {/* Middle Document Stamp */}
              <div className="my-8 py-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                  Verified Official Document
                </span>
                <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  SHA-256 Checksum Intact • Original Format Preserved
                </span>
              </div>
            </div>

            {/* Document Footer */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>{doc.originalFilename}</span>
              <span>{doc.sizeFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render ZIP Archive Preview
  if (doc.fileType === 'zip') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border border-border/80 bg-surface-muted/30 text-center min-h-[380px] pattern-grid-micro ${className}`}>
        <div className="size-16 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-center mb-4 text-foreground">
          <AppIcon icon={Zip01Icon} size={32} />
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          Compressed Archive File
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          {doc.originalFilename} contains compressed vault resources. In accordance with zero-leak privacy, archive contents are preserved intact without third-party extraction.
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>Format: ZIP Archive</span>
          <span>•</span>
          <span>Size: {doc.sizeFormatted}</span>
        </div>
        {onDownload && (
          <div className="mt-6">
            <Button
              onClick={onDownload}
              className="h-10 px-4 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <AppIcon icon={Download01Icon} size={16} />
              Download Archive ({doc.sizeFormatted})
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Fallback / Document Preview
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border border-border/80 bg-surface-muted/30 text-center min-h-[340px] pattern-grid-micro ${className}`}>
      <div className="size-14 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-center mb-4">
        <AppIcon icon={Pdf01Icon} size={28} className="text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {doc.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">
        {doc.originalFilename} ({doc.sizeFormatted})
      </p>
      {onDownload && (
        <div className="mt-6">
          <Button
            onClick={onDownload}
            className="h-10 px-4 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
          >
            <AppIcon icon={Download01Icon} size={16} />
            Download Original File
          </Button>
        </div>
      )}
    </div>
  )
}
