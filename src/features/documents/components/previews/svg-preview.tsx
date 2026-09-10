import { useState, useEffect, useMemo } from 'react'
import {
  Image01Icon,
  CodeIcon,
  Copy01Icon,
  Tick02Icon,
  Download01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  RotateRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { ArchiveCodePreview } from './archive/archive-code-preview'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface SvgPreviewProps {
  document: VaultDocument
  content: string | null
  fileUrl?: string | null
  isLoading: boolean
  lineWrap?: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

export function SvgPreview({
  document: doc,
  content,
  fileUrl,
  isLoading,
  lineWrap = false,
  onFetchContent,
  onDownload,
  className,
}: SvgPreviewProps) {
  const [tab, setTab] = useState<'vector' | 'source'>('vector')
  const [zoomScale, setZoomScale] = useState(1)
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(lineWrap)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  // Create a safe blob URL for the <img> tag (HTML spec blocks all SVG scripts in <img>)
  const safeBlobUrl = useMemo(() => {
    if (!content) return fileUrl || null
    try {
      const blob = new Blob([content], { type: 'image/svg+xml' })
      return URL.createObjectURL(blob)
    } catch {
      return fileUrl || null
    }
  }, [content, fileUrl])

  // Clean up blob URL on unmount or content change
  useEffect(() => {
    return () => {
      if (safeBlobUrl && safeBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(safeBlobUrl)
      }
    }
  }, [safeBlobUrl])

  // Extract dimensions from SVG viewBox or width/height
  const svgMeta = useMemo(() => {
    if (!content) return null
    const matchViewBox = content.match(/viewBox=["']([0-9.\s,-]+)["']/i)
    const matchWidth = content.match(/width=["']([0-9a-zA-Z.%]+)["']/i)
    const matchHeight = content.match(/height=["']([0-9a-zA-Z.%]+)["']/i)

    return {
      viewBox: matchViewBox ? matchViewBox[1].trim() : null,
      width: matchWidth ? matchWidth[1] : null,
      height: matchHeight ? matchHeight[1] : null,
    }
  }, [content])

  const handleCopy = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 4))
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.25, 0.25))
  const handleZoomReset = () => setZoomScale(1)

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Loading SVG vector…</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full h-full min-h-0 flex flex-col overflow-hidden bg-surface text-left',
        className
      )}
    >
      {/* SVG Header */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={Image01Icon} size={15} className="text-primary shrink-0" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border shrink-0">
            SVG Vector
          </span>
          {svgMeta?.width && svgMeta?.height && (
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              {svgMeta.width} × {svgMeta.height}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* View Tab Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/70 bg-surface text-xs font-mono">
            <button
              type="button"
              onClick={() => setTab('vector')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                tab === 'vector'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Vector
            </button>
            <button
              type="button"
              onClick={() => setTab('source')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                tab === 'source'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Source
            </button>
          </div>

          {/* Zoom controls for Vector view */}
          {tab === 'vector' && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomScale <= 0.25}
                className="size-7 p-0 rounded-lg border-border"
                title="Zoom Out"
              >
                <AppIcon icon={ZoomOutAreaIcon} size={13} />
              </Button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 py-1 rounded-lg border border-border text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Reset zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomScale >= 4}
                className="size-7 p-0 rounded-lg border-border"
                title="Zoom In"
              >
                <AppIcon icon={ZoomInAreaIcon} size={13} />
              </Button>
            </div>
          )}

          {tab === 'source' && (
            <Button
              variant={isWrapped ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsWrapped(!isWrapped)}
              className={cn(
                'h-7 px-2.5 rounded-lg text-xs font-medium border-border transition-colors',
                isWrapped && 'bg-primary text-primary-foreground font-semibold shadow-2xs'
              )}
              title={isWrapped ? 'Line wrap is active' : 'Enable line wrap'}
            >
              <span>Wrap</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
              title="Download original SVG"
            >
              <AppIcon icon={Download01Icon} size={12} />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      {tab === 'vector' ? (
        <div className="flex-1 min-h-0 overflow-auto p-6 flex items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/30 via-background to-background">
          {/* Subtle transparency checkerboard canvas */}
          <div
            className="p-8 rounded-2xl border border-border/70 shadow-sm flex items-center justify-center transition-transform duration-150"
            style={{
              backgroundImage:
                'linear-gradient(45deg, rgba(128,128,128,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(128,128,128,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.08) 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
            }}
          >
            {safeBlobUrl ? (
              <img
                src={safeBlobUrl}
                alt={doc.originalFilename}
                className="max-w-[70vw] max-h-[60vh] object-contain select-none pointer-events-none"
              />
            ) : (
              <div className="text-xs text-muted-foreground font-mono">No SVG content available</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ArchiveCodePreview
            filename={doc.originalFilename}
            content={content || ''}
            isRaw={false}
            isWrapped={isWrapped}
          />
        </div>
      )}
    </div>
  )
}
