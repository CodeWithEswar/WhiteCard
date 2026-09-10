import { useState } from 'react'
import { MusicNote01Icon, Download01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { VaultDocument } from '@/types/document'

interface AudioPreviewProps {
  document: VaultDocument
  fileUrl: string
  onDownload?: () => void
}

export function AudioPreview({
  document: doc,
  fileUrl,
  onDownload,
}: AudioPreviewProps) {
  const [hasPlaybackError, setHasPlaybackError] = useState(false)
  const [duration, setDuration] = useState<string | null>(null)

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      const minutes = Math.floor(audio.duration / 60)
      const seconds = Math.floor(audio.duration % 60)
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }
  }

  return (
    <div className="w-full h-full min-h-0 flex items-center justify-center p-6 text-center select-none overflow-y-auto">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-6 shadow-sm">
        <div className="size-20 rounded-3xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground shadow-2xs">
          <AppIcon icon={hasPlaybackError ? AlertCircleIcon : MusicNote01Icon} size={36} className={hasPlaybackError ? 'text-destructive' : 'text-primary'} />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted border border-border/70 text-foreground">
            Audio Recording
          </span>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {doc.originalFilename} • {doc.sizeFormatted}
            {duration && ` • ${duration}`}
          </p>
        </div>

        {hasPlaybackError ? (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-destructive">Audio format not supported</p>
            <p className="text-[11px]">Your browser cannot decode this specific audio codec natively.</p>
          </div>
        ) : (
          fileUrl && fileUrl !== '#' && (
            <div className="p-2 rounded-2xl border border-border/70 bg-muted/30">
              <audio
                src={fileUrl}
                controls
                preload="metadata"
                onError={() => setHasPlaybackError(true)}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full focus:outline-none"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )
        )}

        {onDownload && (
          <Button
            size="sm"
            variant="outline"
            onClick={onDownload}
            className="w-full h-9 rounded-xl text-xs gap-1.5 border-border/80 font-mono"
          >
            <AppIcon icon={Download01Icon} size={14} />
            <span>Download Audio File</span>
          </Button>
        )}
      </div>
    </div>
  )
}
