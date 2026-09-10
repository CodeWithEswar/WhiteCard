import { useState, useMemo, useEffect, useRef } from 'react'
import {
  tokenizeFullCode,
  getMonochromeTokenClassName,
  type FormattedLine,
} from '@/features/documents/lib/archive-language-map'
import { Search01Icon, Cancel01Icon, ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

export interface ArchiveCodePreviewProps {
  filename: string
  content: string
  isRaw?: boolean
  isWrapped?: boolean
  className?: string
}

const MAX_RENDER_LINES = 5000

export function ArchiveCodePreview({
  filename,
  content,
  isRaw = false,
  isWrapped = false,
  className,
}: ArchiveCodePreviewProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Full-file Prism tokenization split into line records
  const formattedLines: FormattedLine[] = useMemo(() => {
    if (isRaw) {
      const rawLines = content.split(/\r?\n/)
      const sliced = rawLines.length > MAX_RENDER_LINES ? rawLines.slice(0, MAX_RENDER_LINES) : rawLines
      return sliced.map((text, idx) => ({
        lineNumber: idx + 1,
        spans: [{ type: null, text: text || ' ' }],
      }))
    }

    const lines = tokenizeFullCode(content, filename)
    return lines.length > MAX_RENDER_LINES ? lines.slice(0, MAX_RENDER_LINES) : lines
  }, [content, filename, isRaw])

  const totalLines = useMemo(() => content.split(/\r?\n/).length, [content])
  const isTruncated = totalLines > MAX_RENDER_LINES

  // Keyboard shortcut Cmd/Ctrl + F for in-file search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setIsSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 50)
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  // In-file search matching lines
  const matchingLineNumbers = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const matches: number[] = []

    formattedLines.forEach((line) => {
      const lineText = line.spans.map((s) => s.text).join('').toLowerCase()
      if (lineText.includes(q)) {
        matches.push(line.lineNumber)
      }
    })

    return matches
  }, [formattedLines, searchQuery])

  // Auto-scroll to active match
  const handleNavigateMatch = (direction: 'next' | 'prev') => {
    if (matchingLineNumbers.length === 0) return

    let nextIdx = currentMatchIndex
    if (direction === 'next') {
      nextIdx = (currentMatchIndex + 1) % matchingLineNumbers.length
    } else {
      nextIdx = (currentMatchIndex - 1 + matchingLineNumbers.length) % matchingLineNumbers.length
    }
    setCurrentMatchIndex(nextIdx)

    const targetLine = matchingLineNumbers[nextIdx]
    setSelectedLine(targetLine)
    const el = document.getElementById(`code-line-${targetLine}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden font-mono text-[13px] leading-relaxed bg-surface select-text',
        className
      )}
    >
      {/* 1. In-File Find Bar (Floating Top-Right) */}
      {isSearchOpen && (
        <div className="absolute top-3 right-5 z-30 flex items-center gap-2 p-1.5 rounded-xl border border-border/80 bg-surface-elevated/95 backdrop-blur-md shadow-lg text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <AppIcon icon={Search01Icon} size={14} className="text-muted-foreground ml-1.5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentMatchIndex(0)
            }}
            placeholder="Find in file..."
            className="w-40 sm:w-56 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-hidden text-xs font-mono"
          />

          {searchQuery && (
            <span className="text-[11px] text-muted-foreground font-mono shrink-0 pr-1">
              {matchingLineNumbers.length > 0 ? `${currentMatchIndex + 1}/${matchingLineNumbers.length}` : '0/0'}
            </span>
          )}

          {matchingLineNumbers.length > 0 && (
            <div className="flex items-center gap-0.5 border-l border-border/60 pl-1">
              <button
                type="button"
                onClick={() => handleNavigateMatch('prev')}
                className="p-1 rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground"
                title="Previous match"
              >
                <AppIcon icon={ArrowUp01Icon} size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleNavigateMatch('next')}
                className="p-1 rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground"
                title="Next match"
              >
                <AppIcon icon={ArrowDown01Icon} size={13} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
            }}
            className="p-1 rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground ml-1"
            title="Close (Esc)"
          >
            <AppIcon icon={Cancel01Icon} size={13} />
          </button>
        </div>
      )}

      {/* Large File Truncation Notice */}
      {isTruncated && (
        <div className="p-2 text-center text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border-b border-amber-500/20 select-none">
          This file is large. Showing the first {MAX_RENDER_LINES.toLocaleString()} of{' '}
          {totalLines.toLocaleString()} lines.
        </div>
      )}

      {/* Main Code Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={cn('pb-8', isWrapped ? 'w-full' : 'min-w-full inline-block')}>
          <table className={cn('w-full border-collapse', isWrapped && 'table-fixed')}>
            <tbody>
              {formattedLines.map((line) => {
                const lineNum = line.lineNumber
                const isSelected = selectedLine === lineNum
                const isMatchingSearch =
                  searchQuery.trim().length > 0 && matchingLineNumbers.includes(lineNum)

                return (
                  <tr
                    key={lineNum}
                    id={`code-line-${lineNum}`}
                    onClick={() => setSelectedLine(isSelected ? null : lineNum)}
                    className={cn(
                      'group transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-primary/5 dark:bg-primary/10'
                        : isMatchingSearch
                        ? 'bg-amber-500/10'
                        : 'hover:bg-surface-elevated/40'
                    )}
                  >
                    {/* Sticky Line Number Gutter */}
                    <td
                      className={cn(
                        'sticky left-0 z-10 w-12 sm:w-14 py-0.5 pr-2.5 sm:pr-3.5 pl-2 text-right text-[11px] font-mono select-none border-r align-top tabular-nums transition-colors shrink-0',
                        isSelected
                          ? 'border-primary/50 text-primary font-medium bg-surface-elevated'
                          : 'border-border/50 text-muted-foreground/50 group-hover:text-muted-foreground/80 bg-surface'
                      )}
                      aria-hidden="true"
                    >
                      {lineNum}
                    </td>

                    {/* Code Content Line */}
                    <td
                      className={cn(
                        'py-0.5 pl-3 sm:pl-4 pr-3 sm:pr-6 align-top font-mono',
                        isWrapped ? 'whitespace-pre-wrap break-words overflow-wrap-anywhere' : 'whitespace-pre',
                        isSelected && 'border-l-2 border-primary pl-2.5 sm:pl-3.5'
                      )}
                    >
                      {line.spans.length === 0 || (line.spans.length === 1 && !line.spans[0].text) ? (
                        <span>{' '}</span>
                      ) : (
                        line.spans.map((span, sIdx) => {
                          const tokenClass = getMonochromeTokenClassName(span.type)
                          return (
                            <span key={sIdx} className={tokenClass}>
                              {span.text}
                            </span>
                          )
                        })
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
