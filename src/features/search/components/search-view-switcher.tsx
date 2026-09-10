import { Grid02Icon, ListViewIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

export interface SearchViewSwitcherProps {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
  className?: string
}

export function SearchViewSwitcher({
  view,
  onChange,
  className,
}: SearchViewSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Select view mode"
      className={cn(
        'inline-flex items-center p-0.5 rounded-xl border border-border bg-surface shadow-2xs select-none',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Switch to grid view"
        title="Grid view"
        className={cn(
          'flex items-center justify-center size-8 rounded-lg text-muted-foreground transition-all',
          view === 'grid'
            ? 'bg-surface-muted text-foreground shadow-2xs'
            : 'hover:text-foreground hover:bg-surface-muted/60'
        )}
      >
        <AppIcon icon={Grid02Icon} size={15} />
      </button>

      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        aria-label="Switch to list view"
        title="List view"
        className={cn(
          'flex items-center justify-center size-8 rounded-lg text-muted-foreground transition-all',
          view === 'list'
            ? 'bg-surface-muted text-foreground shadow-2xs'
            : 'hover:text-foreground hover:bg-surface-muted/60'
        )}
      >
        <AppIcon icon={ListViewIcon} size={15} />
      </button>
    </div>
  )
}
