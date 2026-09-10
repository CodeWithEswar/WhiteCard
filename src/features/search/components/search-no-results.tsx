import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface SearchNoResultsProps {
  query?: string
  hasFilters: boolean
  onClearFilters: () => void
  onClearSearch?: () => void
}

export function SearchNoResults({
  query,
  hasFilters,
  onClearFilters,
  onClearSearch,
}: SearchNoResultsProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-2xl border border-dashed border-border/80 bg-surface/50 text-center select-none overflow-hidden my-4">
      <div className="relative z-10 flex flex-col items-center max-w-sm space-y-3.5">
        <div className="flex items-center justify-center size-13 rounded-2xl border border-border bg-surface-muted shadow-2xs text-muted-foreground">
          <AppIcon icon={Search01Icon} size={22} />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            No documents match this search
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {query
              ? `No records found for “${query}”. Try adjusting your query or resetting active filters.`
              : 'No documents match the current filter criteria. Try broadening your filter selections.'}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {hasFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs"
            >
              <AppIcon icon={Cancel01Icon} size={14} />
              <span>Clear filters</span>
            </Button>
          )}

          {query && onClearSearch && (
            <Button
              onClick={onClearSearch}
              variant="ghost"
              size="sm"
              className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear query
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
