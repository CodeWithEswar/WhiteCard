import { useState, useEffect, useMemo } from 'react'
import {
  File01Icon,
  Download01Icon,
  Copy01Icon,
  Tick02Icon,
  ShieldCheckIcon,
  TextIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface RtfPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  lineWrap?: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

// Safe, lightweight client-side RTF plain text extractor (zero external cloud dependencies)
function extractRtfText(rtf: string): string {
  if (!rtf || !rtf.startsWith('{\\rtf')) return ''

  try {
    // 1. Remove font tables, color tables, stylesheets, and binary pictures
    let text = rtf
      .replace(/\{\\(?:fonttbl|colortbl|stylesheet|info|pict)[^}]*\}/gi, '')
      // 2. Replace paragraph breaks and line breaks with newlines
      .replace(/\\par[d]?\b/gi, '\n')
      .replace(/\\line\b/gi, '\n')
      .replace(/\\tab\b/gi, '\t')
      // 3. Handle escaped hex characters (\'hh)
      .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => {
        try {
          return String.fromCharCode(parseInt(hex, 16))
        } catch {
          return ''
        }
      })
      // 4. Remove remaining control words (\b, \i, \fs24, etc.)
      .replace(/\\[a-zA-Z]+-?\d*\s?/g, '')
      // 5. Remove opening and closing curly braces
      .replace(/[{}]/g, '')
      .trim()

    return text
  } catch {
    return ''
  }
}

export function RtfPreview({
  document: doc,
  content,
  isLoading,
  lineWrap = true,
  onFetchContent,
  onDownload,
  className,
}: RtfPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(lineWrap)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const extractedText = useMemo(() => {
    if (!content) return ''
    return extractRtfText(content)
  }, [content])

  const handleCopy = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Parsing RTF document…</span>
        </div>
      </div>
    )
  }

  // If extraction yielded meaningful text, show client-side read-only text viewer
  if (extractedText.length > 0) {
    const lines = extractedText.split('\n')
    return (
      <div
        className={cn(
          'w-full flex-1 flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[84dvh]',
          className
        )}
      >
        <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <AppIcon icon={TextIcon} size={15} className="text-primary shrink-0" />
            <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
              {doc.originalFilename}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border shrink-0">
              RTF Text
            </span>
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              {lines.length} lines • {extractedText.length} characters
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              variant={isWrapped ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsWrapped(!isWrapped)}
              className={cn(
                'h-7 px-2.5 rounded-lg text-xs font-medium border-border transition-colors',
                isWrapped && 'bg-primary text-primary-foreground font-semibold shadow-2xs'
              )}
            >
              <span>Wrap</span>
            </Button>

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
                title="Download original RTF"
              >
                <AppIcon icon={Download01Icon} size={12} />
                <span className="hidden sm:inline">Download</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 font-mono text-xs text-foreground bg-card leading-relaxed">
          <div className={cn(isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto')}>
            {extractedText}
          </div>
        </div>
      </div>
    )
  }

  // Fallback state (Prompt #37)
  return (
    <div className={cn('w-full flex-1 flex items-center justify-center p-6 text-center select-none', className)}>
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md space-y-6 shadow-sm">
        <div className="size-16 rounded-2xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground shadow-2xs">
          <AppIcon icon={File01Icon} size={32} />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted border border-border/70 text-foreground">
            Rich Text Document
          </span>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {doc.originalFilename} • {doc.sizeFormatted}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground leading-relaxed text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <AppIcon icon={ShieldCheckIcon} size={14} className="text-emerald-500" />
            <span>Private Local Storage</span>
          </div>
          <p>
            White Card cannot currently render this RTF file reliably with full typography fidelity without sending it to external cloud services.
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            The original document is preserved privately in your vault and can be downloaded anytime.
          </p>
        </div>

        {onDownload && (
          <Button
            size="lg"
            onClick={onDownload}
            className="w-full h-10 rounded-xl text-xs font-semibold gap-2 shadow-xs font-mono"
          >
            <AppIcon icon={Download01Icon} size={16} />
            <span>Download Original</span>
          </Button>
        )}
      </div>
    </div>
  )
}
