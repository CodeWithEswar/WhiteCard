import { useState } from 'react'
import {
  File01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { DocumentPreviewToolbar } from './document-preview-toolbar'
import { UnsupportedPreviewState } from './unsupported-preview-state'
import type { VaultDocument } from '@/types/document'

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
  const [pdfFailed, setPdfFailed] = useState(false)

  const handleZoomIn = () => setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 3.5))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.5))
  const handleResetZoom = () => setZoomLevel(1)
  const handleFit = () => setZoomLevel(1)

  const hasRealUrl = doc.fileUrl && doc.fileUrl !== '#'

  // CASE 1: Image Document Preview
  if (doc.fileType === 'image') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <DocumentPreviewToolbar
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFit={handleFit}
          onDownload={onDownload}
          isImage={true}
        />

        <div className="relative rounded-2xl border border-border bg-muted/15 overflow-hidden flex-1 min-h-[440px] max-h-[70vh] flex items-center justify-center p-6 select-none">
          <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
            {hasRealUrl ? (
              <img
                src={doc.fileUrl}
                alt={doc.title}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                }}
                className="max-h-[58vh] max-w-full rounded-xl object-contain shadow-md border border-border/60 bg-card transition-transform duration-150 ease-out"
              />
            ) : (
              <div className="size-64 rounded-2xl border border-dashed border-border bg-card/60 flex flex-col items-center justify-center text-center p-4">
                <AppIcon icon={File01Icon} size={32} className="text-muted-foreground mb-2" />
                <p className="text-xs font-semibold text-foreground">{doc.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">High resolution capture preserved</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // CASE 2: PDF Document Preview
  if (doc.fileType === 'pdf') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <DocumentPreviewToolbar
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFit={handleFit}
          onDownload={onDownload}
          isImage={false}
        />

        <div className="relative rounded-2xl border border-border bg-muted/15 overflow-hidden flex-1 min-h-[500px] h-[68vh]">
          {hasRealUrl && !pdfFailed ? (
            <iframe
              src={`${doc.fileUrl}#toolbar=0&navpanes=0`}
              title={doc.title}
              onError={() => setPdfFailed(true)}
              className="w-full h-full border-0 bg-card"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3.5">
              <div className="size-14 rounded-2xl border border-border bg-card flex items-center justify-center text-foreground">
                <span className="font-mono text-xs font-bold text-foreground">PDF</span>
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-semibold text-foreground">
                  PDF Preview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browser inline preview is unavailable or restricted. The document is intact and ready for download or direct opening.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {hasRealUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted font-medium text-xs text-foreground transition-colors"
                  >
                    Open in New Tab
                  </a>
                )}
                {onDownload && (
                  <Button
                    size="sm"
                    onClick={onDownload}
                    className="h-9 px-4 rounded-xl text-xs font-medium gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    <AppIcon icon={Download01Icon} size={14} />
                    <span>Download PDF</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // CASE 3: ZIP, Office Docs & Unsupported Binary (Metadata-only)
  return (
    <div className={`p-6 rounded-2xl border border-border bg-muted/10 flex items-center justify-center min-h-[440px] ${className}`}>
      <UnsupportedPreviewState
        document={doc}
        onDownload={onDownload || (() => {})}
      />
    </div>
  )
}
