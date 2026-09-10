import { useState, useEffect } from 'react'
import { ArchiveCodePreview } from './archive/archive-code-preview'
import {
  Copy01Icon,
  CheckmarkBadge01Icon,
  Download01Icon,
  CodeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

export interface CodePreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

export function CodePreview({
  document: doc,
  content,
  isLoading,
  lineWrap: initialLineWrap,
  onFetchContent,
  onDownload,
  className,
}: CodePreviewProps) {
  const [isRaw, setIsRaw] = useState(false)
  const [isWrapped, setIsWrapped] = useState(initialLineWrap)
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const lineCount = content ? content.split(/\r?\n/).length : 0

  const handleCopy = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1500)
  }

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 space-y-2 select-none">
        <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-mono">Loading source code…</span>
      </div>
    )
  }

  if (!content && !isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="max-w-md p-6 rounded-2xl border border-border bg-card/60 space-y-2">
          <p className="text-xs font-semibold text-foreground">No source code available</p>
          <p className="text-[11px] text-muted-foreground font-mono">The file might be empty or could not be loaded as text.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full min-h-0 flex flex-col overflow-hidden bg-surface select-text font-mono text-xs', className)}>
      {/* Code Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2 border-b border-border/70 bg-surface-muted/30 select-none shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={CodeIcon} size={15} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">{doc.originalFilename}</span>
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline shrink-0">
            {lineCount.toLocaleString()} lines • {doc.sizeFormatted}
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <Button
            variant={isRaw ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsRaw(!isRaw)}
            className="h-7 px-2.5 rounded-lg text-xs font-medium border-border"
          >
            <span>Raw</span>
          </Button>

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

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
          >
            <AppIcon
              icon={hasCopied ? CheckmarkBadge01Icon : Copy01Icon}
              size={12}
              className={hasCopied ? 'text-primary' : 'text-muted-foreground'}
            />
            <span>{hasCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
              title="Download source code"
            >
              <AppIcon icon={Download01Icon} size={12} className="text-muted-foreground" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Code Viewer */}
      <ArchiveCodePreview
        filename={doc.originalFilename}
        content={content || ''}
        isRaw={isRaw}
        isWrapped={isWrapped}
      />
    </div>
  )
}
