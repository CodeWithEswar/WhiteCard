import { RefreshIcon, Alert02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface SearchErrorStateProps {
  onRetry: () => void
  hasCachedResults?: boolean
}

export function SearchErrorState({
  onRetry,
  hasCachedResults = false,
}: SearchErrorStateProps) {
  // If cached results already exist, show an inline non-destructive alert banner
  if (hasCachedResults) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs my-3 select-none">
        <div className="flex items-center gap-2">
          <AppIcon icon={Alert02Icon} size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Couldn't refresh these results. Showing your last loaded data.</span>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="font-medium underline hover:opacity-80 ml-3 shrink-0 cursor-pointer"
        >
          Try again
        </button>
      </div>
    )
  }

  // Full error card when zero results are cached
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 rounded-2xl border border-border bg-surface text-center select-none my-4 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-center size-12 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <AppIcon icon={Alert02Icon} size={22} />
      </div>

      <div className="space-y-1 max-w-sm">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Search couldn't be loaded
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An error occurred while communicating with the document vault. Check your connection or retry.
        </p>
      </div>

      <div className="pt-2">
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="h-9 px-4 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs"
        >
          <AppIcon icon={RefreshIcon} size={14} />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  )
}
