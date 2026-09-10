import { useState, useEffect } from 'react'
import { ArchiveCodePreview } from './archive/archive-code-preview'
import {
  Copy01Icon,
  Tick02Icon,
  Download01Icon,
  CodeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface XmlPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap?: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

export function XmlPreview({
  document: doc,
  content,
  isLoading,
  lineWrap: initialLineWrap = false,
  onFetchContent,
  onDownload,
  className,
}: XmlPreviewProps) {
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
        <span className="text-xs text-muted-foreground font-mono">Loading XML document…</span>
      </div>
    )
  }

  return (
    <div className={cn('w-full flex-1 flex flex-col overflow-hidden bg-card rounded-2xl border border-border/70 select-text font-mono text-xs my-auto max-h-[84dvh]', className)}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-border/70 bg-muted/30 select-none shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={CodeIcon} size={15} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate max-w-[220px]">{doc.originalFilename}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border shrink-0">
            XML Document
          </span>
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline shrink-0">
            {lineCount.toLocaleString()} lines
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          <Button
            variant={isRaw ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsRaw(!isRaw)}
            className="h-7 px-2.5 rounded-lg text-xs font-medium border-border"
          >
            <span>{isRaw ? 'Formatted' : 'Raw'}</span>
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
              icon={hasCopied ? Tick02Icon : Copy01Icon}
              size={12}
            />
            <span>{hasCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
              title="Download XML"
            >
              <AppIcon icon={Download01Icon} size={12} className="text-muted-foreground" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Code / XML Viewport */}
      <div className="flex-1 overflow-hidden">
        <ArchiveCodePreview
          filename={doc.originalFilename}
          content={content || ''}
          isRaw={isRaw}
          isWrapped={isWrapped}
        />
      </div>
    </div>
  )
}
