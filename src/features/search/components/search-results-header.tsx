import { cn } from '@/lib/utils'

export interface SearchResultsHeaderProps {
  totalCount: number
  query?: string
  space?: string
  tag?: string
  category?: string
  isSearching?: boolean
  className?: string
  children?: React.ReactNode
}

export function SearchResultsHeader({
  totalCount,
  query,
  space,
  tag,
  category,
  isSearching = false,
  className,
  children,
}: SearchResultsHeaderProps) {
  // Construct concise, human summary
  const getSummaryText = () => {
    const noun = totalCount === 1 ? 'document' : 'documents'

    if (query && query.trim() !== '') {
      return (
        <span>
          <span className="font-semibold text-foreground">{totalCount}</span> {totalCount === 1 ? 'result' : 'results'} for{' '}
          <span className="font-medium text-foreground">“{query.trim()}”</span>
        </span>
      )
    }

    if (category) {
      return (
        <span>
          <span className="font-semibold text-foreground">{totalCount}</span> {category} {noun}
        </span>
      )
    }

    if (space && space !== 'all') {
      const spaceLabel = space === 'government' ? 'Government' : 'Student'
      return (
        <span>
          <span className="font-semibold text-foreground">{totalCount}</span> {spaceLabel} {noun}
        </span>
      )
    }

    if (tag) {
      return (
        <span>
          <span className="font-semibold text-foreground">{totalCount}</span> {noun} tagged{' '}
          <span className="font-medium text-foreground">{tag}</span>
        </span>
      )
    }

    return (
      <span>
        <span className="font-semibold text-foreground">{totalCount}</span> {noun}
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 pb-2 border-b border-border/50 select-none',
        className
      )}
    >
      {/* Result Count and Live Region */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <div aria-live="polite" aria-atomic="true">
          {getSummaryText()}
        </div>

        {isSearching && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary ml-1.5 transition-opacity duration-200">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span>Searching…</span>
          </span>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
