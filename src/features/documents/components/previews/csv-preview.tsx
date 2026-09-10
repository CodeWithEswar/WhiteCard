import { useEffect, useMemo, useState } from 'react'
import {
  Table01Icon,
  Copy01Icon,
  Tick02Icon,
  Search01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parseCsvContent } from '../../preview.utils'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

interface CsvPreviewProps {
  document: VaultDocument
  content: string | null
  isLoading: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

export function CsvPreview({
  document: doc,
  content,
  isLoading,
  onFetchContent,
  onDownload,
  className,
}: CsvPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!content && !isLoading) {
      onFetchContent()
    }
  }, [content, isLoading, onFetchContent])

  const parsed = useMemo(() => parseCsvContent(content || ''), [content])

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return parsed.rows
    const q = searchQuery.toLowerCase().trim()
    return parsed.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(q))
    )
  }, [parsed.rows, searchQuery])

  const handleCopy = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8 select-none">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Parsing tabular data…</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full h-full min-h-0 flex flex-col overflow-hidden bg-surface text-left font-mono text-xs select-text',
        className
      )}
    >
      {/* Table Header Controls */}
      <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={Table01Icon} size={15} className="text-primary shrink-0" />
          <span className="font-mono text-[11px] truncate max-w-[200px] text-foreground font-semibold">
            {doc.originalFilename}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            {parsed.isTruncated
              ? `Showing ${parsed.rows.length} of ${parsed.totalRows.toLocaleString()} rows`
              : `${parsed.rows.length} rows`} • {parsed.headers.length} cols
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy CSV'}</span>
          </Button>

          {onDownload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2.5 rounded-lg text-xs gap-1 border-border"
              title="Download original CSV"
            >
              <AppIcon icon={Download01Icon} size={12} />
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Row Search Filter */}
      <div className="px-4 py-1.5 border-b border-border/50 bg-surface/50 flex items-center gap-2 select-none shrink-0">
        <AppIcon icon={Search01Icon} size={14} className="text-muted-foreground shrink-0" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter rows in this table…"
          className="h-7 text-xs font-mono bg-transparent border-none shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
        />
        {searchQuery && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">
              {filteredRows.length} matches
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Data Table Viewport */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 bg-muted/95 backdrop-blur-xs text-muted-foreground font-mono text-[11px] border-b border-border/70 z-10 select-none">
            <tr>
              <th className="sticky left-0 z-20 p-2.5 w-12 text-center border-r border-border/60 text-muted-foreground/60 bg-muted select-none">
                #
              </th>
              {parsed.headers.map((h, i) => (
                <th
                  key={i}
                  className="p-2.5 font-semibold text-foreground border-r border-border/60 last:border-r-0 whitespace-nowrap bg-muted"
                >
                  {h || `Col ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 font-mono text-[11px]">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={parsed.headers.length + 1}
                  className="p-8 text-center text-muted-foreground text-xs font-mono"
                >
                  No matching rows found for &quot;{searchQuery}&quot;
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                  <td className="sticky left-0 z-10 p-2 text-center border-r border-border/60 text-muted-foreground/60 bg-muted select-none font-mono">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="p-2 border-r border-border/60 last:border-r-0 text-foreground whitespace-nowrap max-w-[320px] truncate select-text"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Truncation Footer Note */}
      {parsed.isTruncated && (
        <div className="px-4 py-2 border-t border-border/60 bg-muted/20 text-[10px] text-muted-foreground text-center font-mono select-none">
          Showing first {parsed.rows.length} rows of {parsed.totalRows.toLocaleString()}. Download original file for full data.
        </div>
      )}
    </div>
  )
}
