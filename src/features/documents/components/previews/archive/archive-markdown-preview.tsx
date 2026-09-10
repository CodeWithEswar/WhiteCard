import { useState, useMemo } from 'react'
import { RichMarkdownRenderer } from '@/features/documents/lib/markdown-renderer'
import { ArchiveCodePreview } from './archive-code-preview'
import {
  BookOpen01Icon,
  CodeIcon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ArchiveMarkdownPreviewProps {
  filename: string
  content: string
  onDownload?: () => void
  className?: string
}

export function ArchiveMarkdownPreview({
  filename,
  content,
  onDownload,
  className,
}: ArchiveMarkdownPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [hasCopied, setHasCopied] = useState(false)

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length
  }, [content])

  const lineCount = useMemo(() => {
    return content.split(/\r?\n/).length
  }, [content])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1500)
  }

  return (
    <div className={cn('w-full flex-1 flex flex-col overflow-hidden bg-surface select-text', className)}>
      {/* Markdown Header Toolbar */}
      <div className="flex items-center justify-between gap-2.5 px-4 py-2 border-b border-border/70 bg-surface-muted/30 select-none shrink-0">
        {/* Left: Filename & Metadata */}
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={BookOpen01Icon} size={15} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate text-xs">{filename}</span>
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline shrink-0">
            {lineCount} lines • {wordCount} words
          </span>
        </div>

        {/* Right: Preview / Code Switcher & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center p-0.5 rounded-lg border border-border bg-surface text-xs">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors gap-1 flex items-center',
                viewMode === 'preview'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <AppIcon icon={BookOpen01Icon} size={12} />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors gap-1 flex items-center',
                viewMode === 'code'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <AppIcon icon={CodeIcon} size={12} />
              <span>Code</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 font-mono border-border"
          >
            <AppIcon
              icon={hasCopied ? CheckmarkBadge01Icon : Copy01Icon}
              size={12}
              className={hasCopied ? 'text-primary' : ''}
            />
            <span className="hidden sm:inline">{hasCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2 rounded-lg text-xs border-border"
              title="Download Markdown"
            >
              <AppIcon icon={Download01Icon} size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'preview' ? (
          <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="rounded-2xl border border-border/80 bg-surface shadow-2xs p-6 sm:p-10">
              <RichMarkdownRenderer content={content} />
            </div>
          </div>
        ) : (
          <ArchiveCodePreview filename={filename} content={content} />
        )}
      </div>
    </div>
  )
}
