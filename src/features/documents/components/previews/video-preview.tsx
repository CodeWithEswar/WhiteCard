import { useState } from 'react'
import { Video01Icon, Download01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { VaultDocument } from '@/types/document'

interface VideoPreviewProps {
  document: VaultDocument
  fileUrl: string
  onDownload?: () => void
}

export function VideoPreview({
  document: doc,
  fileUrl,
  onDownload,
}: VideoPreviewProps) {
  const [hasPlaybackError, setHasPlaybackError] = useState(false)

  if (!fileUrl || fileUrl === '#') {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-xs text-muted-foreground font-mono">
        No video stream available.
      </div>
    )
  }

  if (hasPlaybackError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full p-8 rounded-3xl border border-destructive/30 bg-card/90 backdrop-blur-md space-y-5 shadow-sm">
          <div className="size-16 rounded-2xl border border-destructive/20 bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
            <AppIcon icon={AlertCircleIcon} size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              Codec Unsupported
            </span>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Video Playback Failed
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {doc.originalFilename} • {doc.sizeFormatted}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            This video&apos;s codec is not supported natively by your browser.
          </p>

          {onDownload && (
            <Button
              size="sm"
              onClick={onDownload}
              className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 shadow-xs font-mono"
            >
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download Original Video</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-5xl w-full max-h-[82dvh] rounded-2xl border border-border/80 bg-black overflow-hidden shadow-2xl flex items-center justify-center">
        <video
          src={fileUrl}
          controls
          preload="metadata"
          onError={() => setHasPlaybackError(true)}
          className="w-full max-h-[80dvh] object-contain focus:outline-none"
          title={doc.title}
        >
          Your browser does not support HTML5 video streaming.
        </video>
      </div>
    </div>
  )
}
