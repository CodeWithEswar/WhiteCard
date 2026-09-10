import { useEffect, useRef, useState } from 'react'
import { renderAsync } from 'docx-preview'
import {
  File01Icon,
  Download01Icon,
  ShieldCheckIcon,
  AlertCircleIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { OfficeDocumentPreview } from './office-document-preview'
import type { VaultDocument } from '@/types/document'
import type { ZoomControls } from '../../hooks/use-document-zoom'

interface DocxPreviewProps {
  document: VaultDocument
  arrayBuffer: ArrayBuffer | null
  isLoading: boolean
  zoom?: ZoomControls
  onFetchContent: () => void
  onDownload?: () => void
}

const MAX_DOCX_PARSE_SIZE = 25 * 1024 * 1024 // 25MB safety guard

export function DocxPreview({
  document: doc,
  arrayBuffer,
  isLoading,
  zoom,
  onFetchContent,
  onDownload,
}: DocxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [renderError, setRenderError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [hasRendered, setHasRendered] = useState(false)

  // Guard against giant files that would freeze the client
  const isTooLarge = doc.sizeBytes > MAX_DOCX_PARSE_SIZE

  // Request binary buffer on mount if not already available
  useEffect(() => {
    if (!arrayBuffer && !isLoading && !isTooLarge) {
      onFetchContent()
    }
  }, [arrayBuffer, isLoading, isTooLarge, onFetchContent])

  // Render DOCX bytes client-side
  useEffect(() => {
    if (!arrayBuffer || !containerRef.current || isTooLarge) return

    let isMounted = true
    setIsRendering(true)
    setRenderError(null)

    // Clear previous render
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    renderAsync(arrayBuffer, containerRef.current, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      breakPages: true,
      className: 'wc-docx-page',
      useBase64URL: true,
    })
      .then(() => {
        if (isMounted) {
          setIsRendering(false)
          setHasRendered(true)
        }
      })
      .catch((err: any) => {
        console.warn('Client DOCX render error:', err)
        if (isMounted) {
          setIsRendering(false)
          setRenderError(err?.message || 'Could not render Word document')
        }
      })

    return () => {
      isMounted = false
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [arrayBuffer, isTooLarge])

  // Fallback to rich Office card if file is too large or if render fails
  if (isTooLarge || renderError) {
    return (
      <OfficeDocumentPreview
        document={doc}
        onDownload={onDownload}
      />
    )
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden bg-muted/20 select-text">
      {/* Disclaimer strip per Prompt #35 & #83 */}
      <div className="sticky top-0 z-10 w-full px-4 py-2 border-b border-border/60 bg-background/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground select-none shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <AppIcon icon={File01Icon} size={14} className="text-foreground shrink-0" />
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
            {doc.title}
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-muted/80 text-foreground border border-border/70 uppercase">
            DOCX Preview
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="hidden sm:inline text-muted-foreground/80">
            Layout may vary slightly from Microsoft Word
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <AppIcon icon={ShieldCheckIcon} size={13} />
            <span>Private Client Render</span>
          </span>
        </div>
      </div>

      {/* Loading paper state */}
      {(isLoading || isRendering) && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
          <div className="size-10 rounded-2xl border border-border bg-card/80 flex items-center justify-center text-foreground animate-spin shadow-xs">
            <AppIcon icon={Loading03Icon} size={20} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Rendering Word Document...
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              Parsing pages in user browser memory
            </p>
          </div>
        </div>
      )}

      {/* DOCX Paper Container */}
      <div
        ref={containerRef}
        className={`w-full max-w-full sm:max-w-4xl py-4 sm:py-6 px-1 sm:px-6 flex flex-col items-center transition-all duration-150 origin-top ${
          hasRendered && !isRendering ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
        style={{
          transform: zoom && zoom.zoomLevel !== 1 ? `scale(${zoom.zoomLevel})` : undefined,
          transformOrigin: 'top center',
        }}
      />
    </div>
  )
}
