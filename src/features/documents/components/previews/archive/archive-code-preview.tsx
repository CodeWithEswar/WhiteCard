import { useMemo } from 'react'
import {
  tokenizeLine,
  resolveLanguageFromFilename,
  type CodeToken,
} from '@/features/documents/lib/archive-language-map'
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
  const language = useMemo(() => resolveLanguageFromFilename(filename), [filename])

  const allLines = useMemo(() => content.split(/\r?\n/), [content])
  const isTruncated = allLines.length > MAX_RENDER_LINES
  const lines = useMemo(
    () => (isTruncated ? allLines.slice(0, MAX_RENDER_LINES) : allLines),
    [allLines, isTruncated]
  )

  const tokenizedLines = useMemo(() => {
    if (isRaw) return null
    return lines.map((l) => tokenizeLine(l, language))
  }, [lines, isRaw, language])

  return (
    <div
      className={cn(
        'w-full flex-1 overflow-auto font-mono text-xs text-foreground bg-surface select-text',
        className
      )}
    >
      {isTruncated && (
        <div className="p-2 text-center text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border-b border-amber-500/20 select-none">
          This file is large. Showing the first {MAX_RENDER_LINES.toLocaleString()} lines.
        </div>
      )}

      <div className="min-w-full inline-block pb-6">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1
              const tokens: CodeToken[] | null = tokenizedLines ? tokenizedLines[idx] : null

              return (
                <tr
                  key={lineNum}
                  className="group hover:bg-surface-elevated/40 transition-colors"
                >
                  {/* Sticky Line Number Gutter */}
                  <td
                    className="sticky left-0 z-10 w-12 py-0.5 pr-3 pl-2 text-right text-[11px] font-mono text-muted-foreground/60 select-none bg-surface group-hover:bg-surface-elevated/40 border-r border-border/50 tabular-nums align-top"
                    aria-hidden="true"
                  >
                    {lineNum}
                  </td>

                  {/* Code Line Content */}
                  <td
                    className={cn(
                      'py-0.5 pl-4 pr-6 align-top',
                      isWrapped ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
                    )}
                  >
                    {isRaw || !tokens ? (
                      <span>{lineText || ' '}</span>
                    ) : (
                      tokens.map((tok, tIdx) => {
                        let tokenClass = 'text-foreground'

                        switch (tok.type) {
                          case 'keyword':
                            tokenClass = 'font-semibold text-primary'
                            break
                          case 'string':
                            tokenClass = 'text-emerald-700 dark:text-emerald-300'
                            break
                          case 'comment':
                            tokenClass = 'italic text-muted-foreground/70'
                            break
                          case 'number':
                            tokenClass = 'text-amber-700 dark:text-amber-300'
                            break
                          case 'type':
                            tokenClass = 'font-medium text-foreground'
                            break
                          case 'function':
                            tokenClass = 'font-medium text-foreground underline-offset-2'
                            break
                          case 'operator':
                            tokenClass = 'text-muted-foreground'
                            break
                          default:
                            tokenClass = 'text-foreground'
                        }

                        return (
                          <span key={tIdx} className={tokenClass}>
                            {tok.value}
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
  )
}
