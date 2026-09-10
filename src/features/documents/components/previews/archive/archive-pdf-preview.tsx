import { useEffect, useRef, useState } from 'react'
import type JSZip from 'jszip'
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import {
  Pdf01Icon,
  Download01Icon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
  ArrowShrink02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker
}

export interface ArchivePdfPreviewProps {
  zip: JSZip
  path: string
  filename: string
  onDownload?: () => void
  className?: string
}

export function ArchivePdfPreview({
  zip,
  path,
  filename,
  onDownload,
  className,
}: ArchivePdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<any | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const renderTaskRef = useRef<any>(null)

  // Load PDF document from zip
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)
    setPdfDoc(null)

    const file = zip.file(path)
    if (!file) {
      setError('PDF file not found in archive.')
      setIsLoading(false)
      return
    }

    file
      .async('arraybuffer')
      .then(async (buffer: ArrayBuffer) => {
        if (!isMounted) return
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        const doc = await loadingTask.promise
        if (!isMounted) return
        setPdfDoc(doc)
        setNumPages(doc.numPages)
        setCurrentPage(1)
        setIsLoading(false)
      })
      .catch((err: any) => {
        if (isMounted) {
          setIsLoading(false)
          setError(err?.message || 'Failed to parse PDF document.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [zip, path])

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    let isCancelled = false

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel()
          } catch (_) {}
        }

        const page = await pdfDoc.getPage(currentPage)
        if (isCancelled || !canvasRef.current) return

        const scale = (zoomLevel / 100) * 1.5 // High-DPI base scale
        const viewport = page.getViewport({ scale })

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (!context) return

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport,
        }

        const task = page.render(renderContext)
        renderTaskRef.current = task
        await task.promise
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF page rendering error:', err)
        }
      }
    }

    renderPage()

    return () => {
      isCancelled = true
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (_) {}
      }
    }
  }, [pdfDoc, currentPage, zoomLevel])

  return (
    <div className={cn('relative w-full flex-1 flex flex-col overflow-hidden bg-muted/20 select-text', className)}>
      {/* Floating Toolbar (Pagination + Zoom) */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 mx-auto rounded-full bg-surface-elevated/90 backdrop-blur-md border border-border/80 shadow-md text-xs select-none">
        {/* Filename & Info */}
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] pr-2 border-r border-border/60">
          <AppIcon icon={Pdf01Icon} size={14} className="text-primary" />
          <span className="truncate max-w-[130px] sm:max-w-xs text-foreground font-medium">{filename}</span>
        </div>

        {/* Page navigation */}
        {numPages > 1 && (
          <div className="flex items-center gap-1 pr-2 border-r border-border/60">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
              title="Previous page"
              aria-label="Previous page"
            >
              <AppIcon icon={ArrowLeft01Icon} size={14} />
            </Button>

            <span className="font-mono text-[11px] text-muted-foreground">
              {currentPage} / {numPages}
            </span>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
              title="Next page"
              aria-label="Next page"
            >
              <AppIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>
        )}

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
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
            onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
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
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <AppIcon icon={ArrowShrink02Icon} size={13} />
          </Button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-2 select-none my-auto">
            <div className="size-7 rounded-full border-2 border-border border-t-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-mono">
              Loading PDF document…
            </span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 select-none my-auto">
            <div className="size-12 rounded-2xl border border-border bg-surface-muted flex items-center justify-center text-muted-foreground">
              <AppIcon icon={Pdf01Icon} size={24} />
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
          className={cn(
            'rounded-2xl shadow-xl border border-border/80 bg-white overflow-hidden my-auto max-w-full transition-opacity',
            isLoading || error ? 'hidden' : 'block'
          )}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto block" />
        </div>
      </div>
    </div>
  )
}
