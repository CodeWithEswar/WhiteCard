import { useState, useMemo } from 'react'
import { parseCsvContent } from '@/features/documents/preview.utils'
import {
  Table01Icon,
  Search01Icon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ArchiveCsvPreviewProps {
  filename: string
  content: string
  onDownload?: () => void
  className?: string
}

export function ArchiveCsvPreview({
  filename,
  content,
  onDownload,
  className,
}: ArchiveCsvPreviewProps) {
  const [filterQuery, setFilterQuery] = useState('')
  const [hasCopied, setHasCopied] = useState(false)

  const parsed = useMemo(() => parseCsvContent(content || '', 500), [content])

  const filteredRows = useMemo(() => {
    if (!filterQuery.trim()) return parsed.rows
    const q = filterQuery.toLowerCase()
    return parsed.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(q))
    )
  }, [parsed.rows, filterQuery])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1500)
  }

  return (
    <div className={cn('w-full flex-1 flex flex-col overflow-hidden bg-surface select-text font-mono text-xs', className)}>
      {/* CSV Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2 border-b border-border/70 bg-surface-muted/30 select-none shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={Table01Icon} size={15} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">{filename}</span>
          <span className="text-[11px] text-muted-foreground font-mono shrink-0">
            {parsed.totalRows.toLocaleString()} rows • {parsed.headers.length} columns
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Filter Rows Search */}
          <div className="relative flex items-center">
            <AppIcon
              icon={Search01Icon}
              size={13}
              className="absolute left-2.5 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter rows..."
              className="h-7 w-36 sm:w-48 pl-7 pr-2.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 font-mono border-border"
          >
            <AppIcon icon={hasCopied ? CheckmarkBadge01Icon : Copy01Icon} size={13} className={hasCopied ? 'text-primary' : ''} />
            <span>{hasCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2 rounded-lg text-xs font-mono border-border"
              title="Download CSV"
            >
              <AppIcon icon={Download01Icon} size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="flex-1 overflow-auto">
        {parsed.headers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <p className="text-xs font-mono">This spreadsheet contains no data rows.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            {/* Table Header Row */}
            <thead className="sticky top-0 z-10 bg-surface-elevated border-b border-border shadow-2xs font-semibold">
              <tr>
                <th className="w-12 py-2 px-3 text-[10px] text-muted-foreground font-mono text-right border-r border-border/60 bg-surface-muted/60 select-none">
                  #
                </th>
                {parsed.headers.map((header, colIdx) => (
                  <th
                    key={colIdx}
                    className="py-2 px-3 text-xs text-foreground border-r border-border/50 font-medium truncate max-w-xs"
                  >
                    {header || `Column ${colIdx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-surface-elevated/40 border-b border-border/40 transition-colors"
                >
                  <td className="py-1.5 px-3 text-[10px] text-muted-foreground/60 text-right border-r border-border/60 bg-surface-muted/20 select-none font-mono tabular-nums">
                    {rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-1.5 px-3 text-xs text-foreground/90 border-r border-border/40 truncate max-w-md"
                      title={cell}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
