import { useState, useEffect, useMemo } from 'react'
import {
  Table01Icon,
  Download01Icon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  Search01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VaultDocument } from '@/types/document'

export interface SpreadsheetPreviewProps {
  document: VaultDocument
  arrayBuffer: ArrayBuffer | null
  isLoading: boolean
  onFetchContent: () => void
  onDownload?: () => void
  className?: string
}

interface SheetData {
  name: string
  headers: string[]
  rows: (string | number | boolean | null)[][]
  totalRows: number
  totalCols: number
  isTruncatedRows: boolean
  isTruncatedCols: boolean
}

const MAX_ROWS = 500
const MAX_COLS = 50

export function SpreadsheetPreview({
  document: doc,
  arrayBuffer,
  isLoading,
  onFetchContent,
  onDownload,
  className,
}: SpreadsheetPreviewProps) {
  const [sheets, setSheets] = useState<SheetData[]>([])
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasCopied, setHasCopied] = useState(false)

  // Request buffer on mount if missing
  useEffect(() => {
    if (!arrayBuffer && !isLoading) {
      onFetchContent()
    }
  }, [arrayBuffer, isLoading, onFetchContent])

  // Parse workbook using SheetJS dynamically
  useEffect(() => {
    if (!arrayBuffer) return

    let isMounted = true
    setIsParsing(true)
    setParseError(null)

    const parseWorkbook = async () => {
      try {
        const XLSX = await import('xlsx')
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('This workbook contains no visible sheets.')
        }

        const parsedSheets: SheetData[] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            blankrows: false,
          })

          const totalRows = rawRows.length
          const totalCols = rawRows.reduce((max, r) => Math.max(max, r.length), 0)

          const slicedRows = rawRows.slice(0, MAX_ROWS).map((r) => r.slice(0, MAX_COLS))

          // Generate column labels (A, B, C... AA, AB...)
          const colCount = Math.min(totalCols, MAX_COLS)
          const headers: string[] = []
          for (let c = 0; c < colCount; c++) {
            let label = ''
            let num = c
            while (num >= 0) {
              label = String.fromCharCode((num % 26) + 65) + label
              num = Math.floor(num / 26) - 1
            }
            headers.push(label)
          }

          return {
            name: sheetName,
            headers,
            rows: slicedRows,
            totalRows,
            totalCols,
            isTruncatedRows: totalRows > MAX_ROWS,
            isTruncatedCols: totalCols > MAX_COLS,
          }
        })

        if (!isMounted) return
        setSheets(parsedSheets)
        setActiveSheetIndex(0)
        setIsParsing(false)
      } catch (err: any) {
        if (!isMounted) return
        console.warn('Spreadsheet parsing failed:', err)
        setParseError(err?.message || 'Could not parse workbook.')
        setIsParsing(false)
      }
    }

    parseWorkbook()

    return () => {
      isMounted = false
    }
  }, [arrayBuffer])

  const activeSheet = sheets[activeSheetIndex]

  // Filter rows based on search input
  const filteredRows = useMemo(() => {
    if (!activeSheet) return []
    if (!searchQuery.trim()) return activeSheet.rows

    const q = searchQuery.toLowerCase()
    return activeSheet.rows.filter((row) =>
      row.some((cell) => String(cell || '').toLowerCase().includes(q))
    )
  }, [activeSheet, searchQuery])

  const handleCopy = () => {
    if (!activeSheet) return
    const csvContent = activeSheet.rows
      .map((row) => row.map((c) => `"${String(c || '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    navigator.clipboard.writeText(csvContent)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1500)
  }

  // Loading State
  if (isLoading || isParsing) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 space-y-3 select-none">
        <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-foreground">Reading Spreadsheet Workbook…</p>
          <p className="text-[11px] text-muted-foreground font-mono">Parsing sheets locally in memory</p>
        </div>
      </div>
    )
  }

  // Error / Fallback State
  if (parseError || sheets.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center select-none my-auto">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md space-y-5 shadow-sm">
          <div className="size-14 rounded-2xl border border-border bg-surface-muted flex items-center justify-center mx-auto text-muted-foreground">
            <AppIcon icon={Table01Icon} size={28} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{doc.title}</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {doc.originalFilename} • {doc.sizeFormatted}
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              {parseError || 'This spreadsheet could not be previewed safely in the browser.'}
            </p>
          </div>

          {onDownload && (
            <Button
              size="sm"
              onClick={onDownload}
              className="w-full h-9 rounded-xl text-xs gap-2 font-mono"
            >
              <AppIcon icon={Download01Icon} size={15} />
              <span>Download Original Workbook</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full flex-1 flex flex-col overflow-hidden bg-surface select-text font-mono text-xs', className)}>
      {/* 1. Top Spreadsheet Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2 border-b border-border/70 bg-surface-muted/30 select-none shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={Table01Icon} size={15} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">{doc.originalFilename}</span>
          <span className="text-[11px] text-muted-foreground font-mono shrink-0 hidden sm:inline">
            {activeSheet.totalRows.toLocaleString()} rows • {activeSheet.totalCols.toLocaleString()} columns
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Search Filter */}
          <div className="relative flex items-center">
            <AppIcon
              icon={Search01Icon}
              size={13}
              className="absolute left-2.5 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in sheet..."
              className="h-7 w-32 sm:w-44 pl-7 pr-2.5 rounded-lg border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          {/* Copy Active Sheet */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 rounded-lg text-xs gap-1 font-mono border-border"
          >
            <AppIcon
              icon={hasCopied ? CheckmarkBadge01Icon : Copy01Icon}
              size={13}
              className={hasCopied ? 'text-primary' : ''}
            />
            <span className="hidden sm:inline">{hasCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Download Original Workbook */}
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-2 rounded-lg text-xs font-mono border-border"
              title="Download original file"
            >
              <AppIcon icon={Download01Icon} size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Truncation Warning Notice (Size Guard per Prompt #07) */}
      {(activeSheet.isTruncatedRows || activeSheet.isTruncatedCols) && (
        <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center justify-between select-none shrink-0">
          <span>
            Showing first {MAX_ROWS} rows of {activeSheet.totalRows.toLocaleString()} and{' '}
            {MAX_COLS} columns of {activeSheet.totalCols.toLocaleString()}.
          </span>
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="font-medium underline hover:text-amber-900 dark:hover:text-amber-200 ml-2"
            >
              Download Full File
            </button>
          )}
        </div>
      )}

      {/* 3. Main Data Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          {/* Column Letters Row (A, B, C...) */}
          <thead className="sticky top-0 z-10 bg-surface-elevated border-b border-border shadow-2xs font-semibold select-none">
            <tr>
              <th className="w-12 py-1.5 px-3 text-[10px] text-muted-foreground font-mono text-right border-r border-border/60 bg-surface-muted/60">
                #
              </th>
              {activeSheet.headers.map((header, hIdx) => (
                <th
                  key={hIdx}
                  className="py-1.5 px-3 text-[11px] text-muted-foreground/80 border-r border-border/50 text-center font-mono"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Row Data Cells */}
          <tbody>
            {filteredRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-surface-elevated/40 border-b border-border/40 transition-colors"
              >
                {/* Row Number (1, 2, 3...) */}
                <td className="py-1.5 px-3 text-[10px] text-muted-foreground/60 text-right border-r border-border/60 bg-surface-muted/20 select-none font-mono tabular-nums">
                  {rIdx + 1}
                </td>

                {/* Data Cells */}
                {activeSheet.headers.map((_, cIdx) => {
                  const cell = row[cIdx]
                  const cellValue = cell !== undefined && cell !== null ? String(cell) : ''
                  return (
                    <td
                      key={cIdx}
                      className="py-1.5 px-3 text-xs text-foreground/90 border-r border-border/40 truncate max-w-xs"
                      title={cellValue}
                    >
                      {cellValue}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Bottom Workbook Sheet Tabs */}
      {sheets.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-1.5 border-t border-border/70 bg-surface-muted/40 overflow-x-auto select-none shrink-0">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase pr-1.5 tracking-wider">
            Sheets:
          </span>
          {sheets.map((sheet, idx) => {
            const isActive = idx === activeSheetIndex
            return (
              <button
                key={sheet.name}
                type="button"
                onClick={() => {
                  setActiveSheetIndex(idx)
                  setSearchQuery('')
                }}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors border shrink-0',
                  isActive
                    ? 'bg-surface border-border text-foreground font-semibold shadow-2xs'
                    : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-surface/50'
                )}
              >
                {sheet.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
