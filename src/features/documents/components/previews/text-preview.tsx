import { useEffect, useState } from 'react'
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { VaultDocument } from '@/types/document'

interface TextPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap: boolean
  onFetchContent: () => void
}

export function TextPreview({
  document: doc,
  content,
  isLoading,
  lineWrap,
  onFetchContent,
}: TextPreviewProps) {
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

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Loading text content...</span>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 text-center">
        <div className="max-w-md p-6 rounded-2xl border border-border bg-card/60 space-y-2">
          <p className="text-xs font-semibold text-foreground">No text content available</p>
          <p className="text-[11px] text-muted-foreground">The file might be empty or could not be loaded as text.</p>
        </div>
      </div>
    )
  }

  const lines = content.split('\n')

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-surface overflow-hidden text-left">
      {/* Top Reading Surface Header */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
        <span className="font-mono text-[11px] truncate max-w-[240px]">
          {doc.originalFilename}
        </span>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono hidden sm:inline">
            {lines.length} lines • {content.length} characters
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
      </div>

      {/* Main Text Content with line numbers */}
      <div className="flex-1 min-h-0 overflow-auto font-mono text-xs text-foreground p-4">
        <div className="flex min-w-full">
          {/* Line Numbers Column */}
          <div className="select-none pr-4 text-right text-muted-foreground/50 border-r border-border/50 shrink-0 font-mono text-[11px]">
            {lines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Text Lines Column */}
          <div className={`pl-4 flex-1 ${lineWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'}`}>
            {lines.map((line, i) => (
              <div key={i} className="leading-relaxed">
                {line || ' '}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
