import { useState } from 'react'
import { File01Icon, Download01Icon, LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { ZoomControls } from '../../hooks/use-document-zoom'
import type { VaultDocument } from '@/types/document'

interface PdfPreviewProps {
  document: VaultDocument
  fileUrl: string
  zoom: ZoomControls
  onDownload?: () => void
}

export function PdfPreview({
  document: doc,
  fileUrl,
  zoom,
  onDownload,
}: PdfPreviewProps) {
  const [loadFailed, setLoadFailed] = useState(false)

  if (loadFailed || !fileUrl || fileUrl === '#') {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-4 shadow-sm">
          <div className="size-14 rounded-2xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground">
            <AppIcon icon={File01Icon} size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              PDF Preview Unavailable in Browser
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your browser may restrict inline PDF rendering or third-party cookies. The original document is safely preserved.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
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
                <span>Open in New Tab</span>
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
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-4">
      <div
        className="w-full h-full max-w-5xl rounded-xl border border-border/60 bg-card shadow-lg overflow-hidden transition-transform duration-150 ease-out flex flex-col"
        style={{
          transform: `scale(${zoom.zoomLevel}) rotate(${zoom.rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0`}
          title={doc.title}
          onError={() => setLoadFailed(true)}
          className="w-full h-full border-0 bg-background"
        />
      </div>
    </div>
  )
}
