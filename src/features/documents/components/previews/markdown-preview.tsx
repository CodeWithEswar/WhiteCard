import { useEffect, useState } from 'react'
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { TextPreview } from './text-preview'
import { RichMarkdownRenderer } from '@/features/documents/lib/markdown-renderer'
import type { VaultDocument } from '@/types/document'

interface MarkdownPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap: boolean
  onFetchContent: () => void
}

export function MarkdownPreview({
  document: doc,
  content,
  isLoading,
  lineWrap,
  onFetchContent,
}: MarkdownPreviewProps) {
  const [tab, setTab] = useState<'rendered' | 'source'>('rendered')
  const [copied, setCopied] = useState(false)

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

  if (tab === 'source') {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="mb-2 flex items-center gap-1 p-1 rounded-xl bg-card border border-border text-xs">
          <button
            type="button"
            onClick={() => setTab('rendered')}
            className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground font-medium"
          >
            Rendered
          </button>
          <button
            type="button"
            onClick={() => setTab('source')}
            className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs"
          >
            Source
          </button>
        </div>
        <div className="flex-1 w-full flex items-center justify-center">
          <TextPreview
            document={doc}
            content={content}
            isLoading={isLoading}
            lineWrap={lineWrap}
            onFetchContent={onFetchContent}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col items-center my-auto max-h-[82dvh]">
      {/* Tab Switcher */}
      <div className="mb-3 flex items-center gap-1 p-1 rounded-xl bg-card border border-border text-xs shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => setTab('rendered')}
          className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs"
        >
          Rendered
        </button>
        <button
          type="button"
          onClick={() => setTab('source')}
          className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Source
        </button>
      </div>

      {/* Rendered Container */}
      <div className="w-full flex-1 flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left">
        <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span className="font-mono text-[11px] truncate max-w-[240px]">
            {doc.originalFilename}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4 text-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
              <span className="text-xs text-muted-foreground font-mono">Rendering markdown...</span>
            </div>
          ) : content ? (
            <RichMarkdownRenderer content={content} />
          ) : (
            <p className="text-xs text-muted-foreground italic">No content</p>
          )}
        </div>
      </div>
    </div>
  )
}
