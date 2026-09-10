import { useEffect, useRef, useState, useCallback } from 'react'
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import {
  File01Icon,
  Download01Icon,
  ShieldCheckIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Loading03Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { ZoomControls } from '../../hooks/use-document-zoom'
import type { VaultDocument } from '@/types/document'

// Configure PDF.js worker using Vite asset URL
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker
}

interface PdfPreviewProps {
  document: VaultDocument
  fileUrl: string
  arrayBuffer?: ArrayBuffer | null
  isLoadingBytes?: boolean
  zoom: ZoomControls
  onFetchContent?: () => void
  onDownload?: () => void
}

interface PageRenderItem {
  pageNumber: number
  rendered: boolean
}

export function PdfPreview({
  document: doc,
  fileUrl,
  arrayBuffer,
  isLoadingBytes,
  zoom,
  onFetchContent,
  onDownload,
}: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdfDoc, setPdfDoc] = useState<any | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingPdf, setIsLoadingPdf] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'continuous' | 'single'>('continuous')

  // Request binary buffer on mount if available
  useEffect(() => {
    if (!arrayBuffer && onFetchContent) {
      onFetchContent()
    }
  }, [arrayBuffer, onFetchContent])

  // Load PDF document from buffer or URL
  useEffect(() => {
    let isCancelled = false
    setIsLoadingPdf(true)
    setLoadError(null)

    const loadPdf = async () => {
      try {
        const loadingTask = arrayBuffer
          ? pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) })
          : pdfjs.getDocument({ url: fileUrl })

        const loadedDoc = await loadingTask.promise
        if (isCancelled) return

        setPdfDoc(loadedDoc)
        setNumPages(loadedDoc.numPages)
        setIsLoadingPdf(false)
      } catch (err: any) {
        console.warn('PDF load error:', err)
        if (!isCancelled) {
          setIsLoadingPdf(false)
          setLoadError(err?.message || 'Could not load PDF document')
        }
      }
    }

    if (arrayBuffer || (fileUrl && fileUrl !== '#')) {
      loadPdf()
    } else {
      setIsLoadingPdf(false)
    }

    return () => {
      isCancelled = true
    }
  }, [arrayBuffer, fileUrl])

  // Render Page Component
  const PdfPageCanvas = useCallback(
    ({ pageNum }: { pageNum: number }) => {
      const canvasRef = useRef<HTMLCanvasElement>(null)
      const renderTaskRef = useRef<any>(null)
      const [isPageRendering, setIsPageRendering] = useState(true)

      useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return

        let isMounted = true
        setIsPageRendering(true)

        const renderPage = async () => {
          try {
            // Cancel previous render if in progress
            if (renderTaskRef.current) {
              try {
                renderTaskRef.current.cancel()
              } catch {
                // ignore cancel error
              }
            }

            const page = await pdfDoc.getPage(pageNum)
            if (!isMounted || !canvasRef.current) return

            const baseScale = 1.35 * (zoom.zoomLevel || 1.0)
            const viewport = page.getViewport({
              scale: baseScale,
              rotation: zoom.rotation || 0,
            })

            const canvas = canvasRef.current
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

            canvas.width = Math.floor(viewport.width * pixelRatio)
            canvas.height = Math.floor(viewport.height * pixelRatio)
            canvas.style.width = `${viewport.width}px`
            canvas.style.height = `${viewport.height}px`

            const ctx = canvas.getContext('2d', { alpha: false })
            if (!ctx) return

            ctx.save()
            ctx.scale(pixelRatio, pixelRatio)

            renderTaskRef.current = page.render({
              canvasContext: ctx,
              viewport: viewport,
            })

            await renderTaskRef.current.promise
            ctx.restore()

            if (isMounted) {
              setIsPageRendering(false)
            }
          } catch (err: any) {
            if (err?.name !== 'RenderingCancelledException') {
              console.warn(`Error rendering PDF page ${pageNum}:`, err)
            }
          }
        }

        renderPage()

        return () => {
          isMounted = false
          if (renderTaskRef.current) {
            try {
              renderTaskRef.current.cancel()
            } catch {
              // ignore
            }
          }
        }
      }, [pdfDoc, pageNum, zoom.zoomLevel, zoom.rotation])

      return (
        <div className="wc-pdf-page relative bg-white shadow-sm border border-border/50 rounded-sm sm:rounded-md overflow-hidden flex flex-col items-center justify-center mb-6 max-w-full transition-shadow duration-150">
          {/* Subtle page number stamp */}
          <div className="absolute top-2.5 right-3 text-[10px] font-mono text-zinc-400 select-none pointer-events-none z-10">
            Page {pageNum}
          </div>

          {/* Loading spinner for page */}
          {isPageRendering && (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-white">
              <div className="size-6 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={`max-w-full h-auto object-contain transition-opacity duration-150 ${
              isPageRendering ? 'opacity-0 h-0' : 'opacity-100'
            }`}
          />
        </div>
      )
    },
    [pdfDoc, zoom.zoomLevel, zoom.rotation]
  )

  // Fallback state if PDF fails to parse
  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4 sm:p-6 text-center select-none">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-4 shadow-sm">
          <div className="size-14 rounded-2xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground">
            <AppIcon icon={File01Icon} size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              PDF Preview Unavailable in Browser
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This document could not be rendered client-side. Your original PDF is safe and intact.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {fileUrl && fileUrl !== '#' && (
              <Button
                size="sm"
                variant="outline"
                render={
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="h-9 px-4 rounded-xl text-xs gap-1.5"
                  />
                }
              >
                <AppIcon icon={LinkSquare02Icon} size={14} />
                <span>Open in Tab</span>
              </Button>
            )}

            {onDownload && (
              <Button
                size="sm"
                onClick={onDownload}
                className="h-9 px-4 rounded-xl text-xs gap-1.5"
              >
                <AppIcon icon={Download01Icon} size={14} />
                <span>Download PDF</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden bg-muted/20 select-text"
    >
      {/* Top Paper Header Strip (like DOCX) */}
      <div className="sticky top-0 z-20 w-full px-3 sm:px-6 py-2 border-b border-border/60 bg-background/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground select-none shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={File01Icon} size={14} className="text-foreground shrink-0" />
          <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-md">
            {doc.title}
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-muted/80 text-foreground border border-border/70 uppercase">
            PDF
          </span>
          {numPages > 0 && (
            <span className="font-mono text-[10px] text-muted-foreground hidden xs:inline">
              ({numPages} {numPages === 1 ? 'Page' : 'Pages'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-[10px]">
          {/* Page Switcher if in Single Page Mode */}
          {viewMode === 'single' && numPages > 1 && (
            <div className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-muted disabled:opacity-40"
              >
                <AppIcon icon={ArrowLeft01Icon} size={12} />
              </button>
              <span className="font-mono text-[10px] px-1">
                {currentPage} / {numPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                className="p-1 rounded hover:bg-muted disabled:opacity-40"
              >
                <AppIcon icon={ArrowRight01Icon} size={12} />
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          {numPages > 1 && (
            <button
              type="button"
              onClick={() =>
                setViewMode((m) => (m === 'continuous' ? 'single' : 'continuous'))
              }
              className="text-[10px] font-mono underline hover:text-foreground hidden sm:inline"
            >
              {viewMode === 'continuous' ? 'Single Page' : 'Continuous Scroll'}
            </button>
          )}

          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <AppIcon icon={ShieldCheckIcon} size={13} />
            <span className="hidden sm:inline">Private Client Render</span>
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoadingPdf && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
          <div className="size-10 rounded-2xl border border-border bg-card/80 flex items-center justify-center text-foreground animate-spin shadow-xs">
            <AppIcon icon={Loading03Icon} size={20} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Rendering PDF Document...
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              Rendering crisp vector pages in user browser memory
            </p>
          </div>
        </div>
      )}

      {/* Paper Pages Stage (Identical to Word/DOCX paper layout) */}
      {!isLoadingPdf && numPages > 0 && (
        <div className="w-full max-w-4xl py-4 sm:py-6 px-1 sm:px-6 flex flex-col items-center transition-all duration-150 origin-top">
          {viewMode === 'continuous' ? (
            // Continuous Vertical Scroll (all pages stacked like DOCX)
            Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <PdfPageCanvas key={pageNum} pageNum={pageNum} />
            ))
          ) : (
            // Single Page View
            <PdfPageCanvas pageNum={currentPage} />
          )}
        </div>
      )}
    </div>
  )
}
