import { useState, useEffect, useRef } from 'react'
import type JSZip from 'jszip'
import { extractEntryAsBlob, extractEntryAsText } from '@/features/documents/lib/archive-parser'
import { resolveArchiveFileType } from '@/features/documents/lib/archive-file-types'
import {
  Image01Icon,
  CodeIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ArrowShrink02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { ArchiveCodePreview } from './archive-code-preview'
import { cn } from '@/lib/utils'

export interface ArchiveImagePreviewProps {
  zip: JSZip
  path: string
  filename: string
  className?: string
}

export function ArchiveImagePreview({
  zip,
  path,
  filename,
  className,
}: ArchiveImagePreviewProps) {
  const isSvg = filename.toLowerCase().endsWith('.svg')
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load image blob (and SVG text if SVG)
  useEffect(() => {
    let currentUrl: string | null = null
    let isMounted = true
    setIsLoading(true)
    setError(null)
    setNaturalDimensions(null)
    setZoomLevel(100)

    const typeInfo = resolveArchiveFileType(filename)

    const loadTask = async () => {
      try {
        const blob = await extractEntryAsBlob(zip, path, typeInfo.mimeType)
        if (!isMounted) return

        currentUrl = URL.createObjectURL(blob)
        setBlobUrl(currentUrl)

        if (isSvg) {
          const text = await extractEntryAsText(zip, path)
          if (isMounted) {
            setSvgContent(text)
          }
        }

        setIsLoading(false)
      } catch (err: any) {
        if (isMounted) {
          setError('Could not render image entry.')
          setIsLoading(false)
        }
      }
    }

    loadTask()

    return () => {
      isMounted = false
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
    }
  }, [zip, path, filename, isSvg])

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 space-y-2 select-none">
        <div className="size-6 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-mono">Loading image…</span>
      </div>
    )
  }

  if (error || !blobUrl) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 select-none">
        <div className="size-12 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-muted-foreground">
          <AppIcon icon={Image01Icon} size={22} />
        </div>
        <p className="text-xs text-muted-foreground">{error || 'Failed to render image preview.'}</p>
      </div>
    )
  }

  // SVG Source Code View
  if (isSvg && viewMode === 'code' && svgContent) {
    return (
      <div className="w-full flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-surface-muted/30 flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">SVG Source Code</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('preview')}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 font-mono border-border"
          >
            <AppIcon icon={Image01Icon} size={13} />
            <span>Vector Preview</span>
          </Button>
        </div>
        <ArchiveCodePreview filename={filename} content={svgContent} />
      </div>
    )
  }

  return (
    <div className={cn('w-full flex-1 flex flex-col overflow-hidden bg-surface select-none', className)}>
      {/* Image Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/70 bg-surface-muted/30 text-xs shrink-0">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground truncate">
          <span className="text-foreground font-semibold truncate">{filename}</span>
          {naturalDimensions && (
            <span>• {naturalDimensions.width} × {naturalDimensions.height} px</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isSvg && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('code')}
              className="h-7 px-2 rounded-lg text-xs gap-1 font-mono border-border mr-1"
              title="View SVG XML Markup"
            >
              <AppIcon icon={CodeIcon} size={13} />
              <span className="hidden sm:inline">Source</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Zoom out"
          >
            <AppIcon icon={ZoomOutAreaIcon} size={13} />
          </Button>

          <span className="font-mono text-[10px] w-8 text-center text-muted-foreground">
            {zoomLevel}%
          </span>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Zoom in"
          >
            <AppIcon icon={ZoomInAreaIcon} size={13} />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel(100)}
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Reset Zoom"
          >
            <AppIcon icon={ArrowShrink02Icon} size={13} />
          </Button>
        </div>
      </div>

      {/* Image Stage with Transparency Pattern */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]">
        <img
          src={blobUrl}
          alt={filename}
          onLoad={(e) => {
            const img = e.currentTarget
            setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
          }}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transition: 'transform 0.1s ease-out',
          }}
          className="max-w-full max-h-[72vh] object-contain rounded-xl border border-border shadow-md bg-surface/50"
        />
      </div>
    </div>
  )
}
