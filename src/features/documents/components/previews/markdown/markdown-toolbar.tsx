import { useState } from 'react'
import {
  FileCodeIcon,
  Copy01Icon,
  Tick02Icon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import type { MarkdownMode, HeadingItem } from '@/features/documents/lib/markdown/markdown-types'
import type { VaultDocument } from '@/types/document'

interface MarkdownToolbarProps {
  document: VaultDocument
  mode: MarkdownMode
  onModeChange: (mode: MarkdownMode) => void
  content: string
  headings: HeadingItem[]
  searchQuery: string
  onSearchChange: (q: string) => void
  activeMatchIndex: number
  totalMatches: number
  onPrevMatch: () => void
  onNextMatch: () => void
  className?: string
}

export function MarkdownToolbar({
  document: doc,
  mode,
  onModeChange,
  content,
  headings,
  searchQuery,
  onSearchChange,
  activeMatchIndex,
  totalMatches,
  onPrevMatch,
  onNextMatch,
  className,
}: MarkdownToolbarProps) {
  const { copied, copy } = useCopyToClipboard({ timeout: 1500 })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isTocOpen, setIsTocOpen] = useState(false)

  const hasHeadings = headings.length >= 3

  const handleHeadingClick = (id: string) => {
    setIsTocOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={cn('w-full border-b border-border/70 bg-card/95 backdrop-blur-md shrink-0 select-none sticky top-0 z-20', className)}>
      {/* Primary Toolbar Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2">
        {/* Filename & Tag */}
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon icon={FileCodeIcon} size={16} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground text-xs truncate max-w-[200px] sm:max-w-[320px]">
            {doc.originalFilename}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted text-muted-foreground border-border shrink-0 hidden sm:inline">
            Markdown
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Table of Contents Popover (if >= 3 headings) */}
          {hasHeadings && mode === 'rendered' && (
            <Popover open={isTocOpen} onOpenChange={setIsTocOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
                    title="Table of Contents"
                  >
                    <AppIcon icon={Menu01Icon} size={13} />
                    <span className="hidden sm:inline">Contents</span>
                  </Button>
                }
              />
              <PopoverContent align="end" className="w-72 p-3 text-xs max-h-[70vh] overflow-y-auto">
                <div className="font-semibold text-foreground mb-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Table of Contents
                </div>
                <nav aria-label="Table of contents" className="space-y-1">
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleHeadingClick(h.id)}
                      className={cn(
                        'w-full text-left py-1 px-2 rounded-md hover:bg-muted text-foreground transition-colors truncate block text-xs',
                        h.level === 1 && 'font-semibold',
                        h.level === 2 && 'pl-4 text-foreground/90',
                        h.level >= 3 && 'pl-7 text-muted-foreground'
                      )}
                    >
                      {h.title}
                    </button>
                  ))}
                </nav>
              </PopoverContent>
            </Popover>
          )}

          {/* Search Toggle */}
          {mode === 'rendered' && (
            <Button
              variant={isSearchOpen ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn('h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1', isSearchOpen && 'bg-primary text-primary-foreground font-semibold shadow-2xs')}
              title="Search in document"
            >
              <AppIcon icon={Search01Icon} size={13} />
              <span className="hidden sm:inline">Search</span>
            </Button>
          )}

          {/* Copy Full Markdown */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(content)}
            className="h-7 px-2.5 rounded-lg text-xs font-medium border-border gap-1"
            title="Copy entire Markdown source"
          >
            <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} />
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Rendered / Source Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/70 bg-surface text-xs font-mono">
            <button
              type="button"
              onClick={() => onModeChange('rendered')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                mode === 'rendered'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Rendered
            </button>
            <button
              type="button"
              onClick={() => onModeChange('source')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium',
                mode === 'source'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Source
            </button>
          </div>
        </div>
      </div>

      {/* In-Document Search Bar */}
      {isSearchOpen && mode === 'rendered' && (
        <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-1.5 bg-muted/40 border-t border-border/50 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <AppIcon icon={Search01Icon} size={14} className="text-muted-foreground shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Find in rendered document…"
              autoFocus
              className="h-7 text-xs font-mono bg-transparent border-none shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {searchQuery && (
              <span className="text-[11px] font-mono text-muted-foreground mr-1">
                {totalMatches > 0 ? `${activeMatchIndex + 1} of ${totalMatches}` : '0 matches'}
              </span>
            )}

            <Button
              variant="ghost"
              size="sm"
              disabled={totalMatches === 0}
              onClick={onPrevMatch}
              className="size-6 p-0 rounded"
              title="Previous match"
            >
              <AppIcon icon={ArrowUp01Icon} size={12} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={totalMatches === 0}
              onClick={onNextMatch}
              className="size-6 p-0 rounded"
              title="Next match"
            >
              <AppIcon icon={ArrowDown01Icon} size={12} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('')
                setIsSearchOpen(false)
              }}
              className="size-6 p-0 rounded text-muted-foreground hover:text-foreground"
              title="Close search"
            >
              <AppIcon icon={Cancel01Icon} size={13} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
