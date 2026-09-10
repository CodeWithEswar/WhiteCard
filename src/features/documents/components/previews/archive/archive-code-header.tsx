import {
  Copy01Icon,
  CheckmarkBadge01Icon,
  Download01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ArchiveCodeHeaderProps {
  filename: string
  lineCount?: number
  formattedSize: string
  badgeText: string
  isRaw: boolean
  isWrapped: boolean
  hasCopied: boolean
  isDownloading: boolean
  onToggleRaw: () => void
  onToggleWrap: () => void
  onCopy: () => void
  onDownloadFile: () => void
  onBackToDirectory: () => void
  className?: string
}

export function ArchiveCodeHeader({
  filename,
  lineCount,
  formattedSize,
  badgeText,
  isRaw,
  isWrapped,
  hasCopied,
  isDownloading,
  onToggleRaw,
  onToggleWrap,
  onCopy,
  onDownloadFile,
  onBackToDirectory,
  className,
}: ArchiveCodeHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 border-b border-border/70 bg-surface/90 backdrop-blur-md select-none font-mono',
        className
      )}
    >
      {/* Left: Back Button, Filename, Line Count & Size */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onBackToDirectory}
          className="size-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Back to folder directory"
          title="Back to directory"
        >
          <AppIcon icon={ArrowLeft01Icon} size={15} />
        </Button>

        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-muted border border-border/80 text-foreground shrink-0">
          {badgeText}
        </span>

        <span className="text-xs font-semibold text-foreground truncate">
          {filename}
        </span>

        <span className="text-muted-foreground/60 hidden sm:inline">•</span>

        <span className="text-[11px] text-muted-foreground hidden sm:inline truncate">
          {lineCount !== undefined ? `${lineCount} lines` : ''}
          {lineCount !== undefined && ' • '}
          {formattedSize}
        </span>
      </div>

      {/* Right: Actions (Raw, Wrap, Copy, Download) */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
        <Button
          variant={isRaw ? 'secondary' : 'outline'}
          size="sm"
          onClick={onToggleRaw}
          className="h-7 px-2.5 rounded-lg text-xs font-medium border-border"
          aria-label={isRaw ? 'Switch to formatted view' : 'Switch to raw view'}
        >
          <span>Raw</span>
        </Button>

        <Button
          variant={isWrapped ? 'secondary' : 'outline'}
          size="sm"
          onClick={onToggleWrap}
          className={cn(
            'h-7 px-2.5 rounded-lg text-xs font-medium border-border transition-colors',
            isWrapped && 'bg-primary text-primary-foreground font-semibold shadow-2xs'
          )}
          aria-label={isWrapped ? 'Disable line wrap' : 'Enable line wrap'}
          title={isWrapped ? 'Line wrap is active' : 'Enable line wrap'}
        >
          <span>Wrap</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
          aria-label="Copy file content"
        >
          <AppIcon
            icon={hasCopied ? CheckmarkBadge01Icon : Copy01Icon}
            size={12}
            className={hasCopied ? 'text-primary' : 'text-muted-foreground'}
          />
          <span>{hasCopied ? 'Copied' : 'Copy'}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isDownloading}
          onClick={onDownloadFile}
          className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
          aria-label="Download this file"
        >
          <AppIcon icon={Download01Icon} size={12} className="text-muted-foreground" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </div>
  )
}
