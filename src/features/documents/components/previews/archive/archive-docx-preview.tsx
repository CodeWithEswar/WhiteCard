import { useEffect, useRef, useState } from 'react'
import type JSZip from 'jszip'
import { renderAsync } from 'docx-preview'
import {
  File01Icon,
  Download01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ArrowShrink02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ArchiveDocxPreviewProps {
  zip: JSZip
  path: string
  filename: string
  onDownload?: () => void
  className?: string
}

export function ArchiveDocxPreview({
  zip,
  path,
  filename,
  onDownload,
  className,
}: ArchiveDocxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    const file = zip.file(path)
    if (!file) {
      setError('File not found in archive.')
      setIsLoading(false)
      return
    }

    file
      .async('arraybuffer')
      .then((buffer: ArrayBuffer) => {
        if (!isMounted || !containerRef.current) return

        containerRef.current.innerHTML = ''
        return renderAsync(buffer, containerRef.current, undefined, {
          inWrapper: true,
          ignoreWidth: false,
          breakPages: true,
          className: 'wc-docx-page',
          useBase64URL: true,
        })
      })
      .then(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setIsLoading(false)
          setError(err?.message || 'Could not parse Word document.')
        }
      })

    return () => {
      isMounted = false
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [zip, path])

  return (
    <div className={cn('relative w-full flex-1 flex flex-col overflow-hidden bg-surface select-text', className)}>
      {/* Floating Zoom & Controls Bar */}
      <div className="sticky top-2 z-20 flex items-center justify-between gap-2 px-4 py-1.5 mx-auto rounded-full bg-surface-elevated/90 backdrop-blur-md border border-border/80 shadow-md text-xs select-none">
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] pr-2 border-r border-border/60">
          <AppIcon icon={File01Icon} size={14} className="text-primary" />
          <span className="truncate max-w-[150px] sm:max-w-xs text-foreground font-medium">{filename}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="size-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <AppIcon icon={ZoomOutAreaIcon} size={14} />
          </Button>

          <span className="font-mono text-[10px] w-9 text-center text-muted-foreground">
            {zoomLevel}%
          </span>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
            className="size-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <AppIcon icon={ZoomInAreaIcon} size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel(100)}
            className="size-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Reset zoom (100%)"
            aria-label="Reset zoom"
          >
            <AppIcon icon={ArrowShrink02Icon} size={13} />
          </Button>
        </div>
      </div>

      {/* Main Document Content Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-2 select-none my-auto">
            <div className="size-7 rounded-full border-2 border-border border-t-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">
              Rendering Word document…
            </span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 select-none my-auto">
            <div className="size-12 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-muted-foreground">
              <AppIcon icon={File01Icon} size={24} />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-semibold text-foreground">{filename}</h4>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="h-8 px-3 rounded-xl text-xs gap-1.5 font-mono"
              >
                <AppIcon icon={Download01Icon} size={14} />
                <span>Download File</span>
              </Button>
            )}
          </div>
        )}

        <div
          ref={containerRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.12s ease-out',
          }}
          className={cn(
            'w-full max-w-4xl flex flex-col items-center bg-transparent transition-opacity',
            isLoading || error ? 'hidden' : 'block'
          )}
        />
      </div>
    </div>
  )
}
