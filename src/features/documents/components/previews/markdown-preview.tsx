import { useEffect, useState } from 'react'
import {
  Copy01Icon,
  Tick02Icon,
  Download01Icon,
  FileCodeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { ArchiveCodePreview } from './archive/archive-code-preview'
import { RichMarkdownRenderer } from '@/features/documents/lib/markdown-renderer'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface MarkdownPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap?: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

export function MarkdownPreview({
  document: doc,
  content,
  isLoading,
  lineWrap: initialLineWrap = true,
  onFetchContent,
  onDownload,
  className,
}: MarkdownPreviewProps) {
  const [tab, setTab] = useState<'preview' | 'source'>('preview')
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(initialLineWrap)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const handleCopy = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 space-y-2 select-none">
        <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-mono">Loading markdown document…</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full flex-1 flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[84dvh]',
        className
      )}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={FileCodeIcon} size={15} className="text-primary shrink-0" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border shrink-0">
            Markdown
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Tab Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/70 bg-surface text-xs font-mono">
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                tab === 'preview'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setTab('source')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                tab === 'source'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Source
            </button>
          </div>

          {tab === 'source' && (
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
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
              title="Download original Markdown"
            >
              <AppIcon icon={Download01Icon} size={12} />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Viewport: Rendered GFM HTML vs Syntax Highlighted Source */}
      {tab === 'preview' ? (
        <div className="flex-1 overflow-auto p-6 sm:p-8 space-y-4 text-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none select-text">
          {content ? (
            <RichMarkdownRenderer content={content} />
          ) : (
            <p className="text-xs text-muted-foreground italic font-mono">Document is empty</p>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <ArchiveCodePreview
            filename={doc.originalFilename}
            content={content || ''}
            isRaw={false}
            isWrapped={isWrapped}
          />
        </div>
      )}
    </div>
  )
}
