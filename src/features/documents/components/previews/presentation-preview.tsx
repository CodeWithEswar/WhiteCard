import { useState, useEffect } from 'react'
import JSZip from 'jszip'
import {
  Presentation01Icon,
  Download01Icon,
  ShieldCheckIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

export interface PresentationPreviewProps {
  document: VaultDocument
  arrayBuffer?: ArrayBuffer | null
  isLoading?: boolean
  onFetchContent?: () => void
  onDownload?: () => void
  className?: string
}

export function PresentationPreview({
  document: doc,
  arrayBuffer,
  isLoading,
  onFetchContent,
  onDownload,
  className,
}: PresentationPreviewProps) {
  const [slideCount, setSlideCount] = useState<number | null>(null)
  const [isInspecting, setIsInspecting] = useState(false)

  // Request buffer on mount if available to inspect slide count
  useEffect(() => {
    if (!arrayBuffer && !isLoading && onFetchContent) {
      onFetchContent()
    }
  }, [arrayBuffer, isLoading, onFetchContent])

  // Inspect slide count locally from PPTX package without external cloud tools
  useEffect(() => {
    if (!arrayBuffer) return

    let isMounted = true
    setIsInspecting(true)

    const inspectPptx = async () => {
      try {
        const zip = await JSZip.loadAsync(arrayBuffer)
        // Count slide files matching ppt/slides/slide*.xml
        const slideFiles = Object.keys(zip.files).filter(
          (path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path)
        )

        if (isMounted && slideFiles.length > 0) {
          setSlideCount(slideFiles.length)
        }
      } catch (_) {
        // Safe fallback if not a standard PPTX zip package (e.g. legacy binary .ppt)
      } finally {
        if (isMounted) {
          setIsInspecting(false)
        }
      }
    }

    inspectPptx()

    return () => {
      isMounted = false
    }
  }, [arrayBuffer])

  return (
    <div className={cn('w-full h-full min-h-0 flex items-center justify-center p-6 text-center select-none overflow-y-auto', className)}>
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md space-y-6 shadow-sm">
        {/* Presentation Icon */}
        <div className="size-16 rounded-2xl border border-border bg-surface-muted flex items-center justify-center mx-auto text-foreground shadow-2xs">
          <AppIcon icon={Presentation01Icon} size={32} />
        </div>

        {/* Title & Metadata */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted border border-border/70 text-foreground">
            Presentation
          </span>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {doc.originalFilename} • {doc.sizeFormatted}
          </p>
        </div>

        {/* Truthful Slide Count & Local Inspection Badge */}
        {slideCount !== null && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface border border-border text-xs font-mono text-foreground">
            <AppIcon icon={Layers01Icon} size={14} className="text-primary" />
            <span>{slideCount} slides</span>
          </div>
        )}

        {/* Privacy & Fidelity Notice (Prompt #11 & #12) */}
        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground leading-relaxed text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <AppIcon icon={ShieldCheckIcon} size={14} className="text-emerald-500" />
            <span>Private Local Storage</span>
          </div>
          <p>
            White Card can store, share, and protect this presentation, but browser-side PowerPoint rendering cannot guarantee full typography and layout fidelity without compromising document privacy.
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            Download the exact original file to present or edit in your presentation software.
          </p>
        </div>

        {/* Download Action */}
        {onDownload && (
          <Button
            size="lg"
            onClick={onDownload}
            className="w-full h-10 rounded-xl text-xs font-semibold gap-2 shadow-xs font-mono"
          >
            <AppIcon icon={Download01Icon} size={16} />
            <span>Download Presentation</span>
          </Button>
        )}
      </div>
    </div>
  )
}
