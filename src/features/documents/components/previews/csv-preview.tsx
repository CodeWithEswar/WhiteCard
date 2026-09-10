import { useEffect, useMemo, useState } from 'react'
import { Table01Icon, Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { parseCsvContent } from '../../preview.utils'
import type { VaultDocument } from '@/types/document'

interface CsvPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  onFetchContent: () => void
}

export function CsvPreview({
  document: doc,
  content,
  isLoading,
  onFetchContent,
}: CsvPreviewProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const parsed = useMemo(() => parseCsvContent(content || ''), [content])

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
          <span className="text-xs text-muted-foreground font-mono">Parsing CSV data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full max-w-5xl mx-auto flex flex-col rounded-2xl border border-border/70 bg-card shadow-sm overflow-hidden text-left my-auto max-h-[82dvh]">
      {/* Table Header Controls */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          <AppIcon icon={Table01Icon} size={15} className="text-muted-foreground" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {parsed.isTruncated
              ? `Previewing ${parsed.rows.length} of ${parsed.totalRows.toLocaleString()} rows`
              : `${parsed.rows.length} rows`}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2.5 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground"
        >
          <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
          <span>{copied ? 'Copied' : 'Copy CSV'}</span>
        </Button>
      </div>

      {/* Scrollable Data Table Viewport */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs text-muted-foreground font-mono text-[11px] border-b border-border/70 z-10">
            <tr>
              <th className="p-2.5 w-12 text-center border-r border-border/60 text-muted-foreground/60 select-none">
                #
              </th>
              {parsed.headers.map((h, i) => (
                <th key={i} className="p-2.5 font-semibold text-foreground border-r border-border/60 last:border-r-0 whitespace-nowrap">
                  {h || `Col ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 font-mono text-[11px]">
            {parsed.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                <td className="p-2 text-center border-r border-border/60 text-muted-foreground/60 bg-muted/10 select-none">
                  {rIdx + 1}
                </td>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 border-r border-border/60 last:border-r-0 text-foreground whitespace-nowrap max-w-[280px] truncate">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Truncation Footer Note */}
      {parsed.isTruncated && (
        <div className="px-4 py-2 border-t border-border/60 bg-muted/20 text-[10px] text-muted-foreground text-center font-mono">
          Showing first {parsed.rows.length} rows of {parsed.totalRows.toLocaleString()}. Download original file for full data.
        </div>
      )}
    </div>
  )
}
