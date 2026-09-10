import { useEffect, useState } from 'react'
import { Copy01Icon, Tick02Icon, CodeIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { formatJsonText } from '../../preview.utils'
import type { VaultDocument } from '@/types/document'

interface JsonPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  onFetchContent: () => void
}

export function JsonPreview({
  document: doc,
  content,
  isLoading,
  onFetchContent,
}: JsonPreviewProps) {
  const [isRaw, setIsRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const { formatted, isValid } = formatJsonText(content || '')

  const handleCopy = () => {
    const textToCopy = isRaw ? content : formatted
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Parsing JSON...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[82dvh]">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          <AppIcon icon={CodeIcon} size={15} className="text-muted-foreground" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
            isValid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}>
            {isValid ? 'Valid JSON' : 'Raw Content'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRaw(!isRaw)}
            className="text-[11px] font-mono font-medium px-2 py-1 rounded-md border border-border/60 bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            {isRaw ? 'Formatted' : 'Raw'}
          </button>

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

      {/* JSON Content with Syntax highlight */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs text-foreground bg-card">
        <pre className="whitespace-pre overflow-x-auto leading-relaxed">
          <code>{isRaw ? content : formatted}</code>
        </pre>
      </div>
    </div>
  )
}
