import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

export interface ArchiveSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  matchCount?: number
  placeholder?: string
  className?: string
}

export function ArchiveSearch({
  value,
  onChange,
  onClear,
  matchCount,
  placeholder = 'Filter files in archive...',
  className,
}: ArchiveSearchProps) {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs select-none', className)}>
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
        <AppIcon icon={Search01Icon} size={14} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Filter files in archive"
        className="w-full h-8 pl-8 pr-16 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground/60 outline-hidden focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all font-mono"
      />

      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        {value && matchCount !== undefined && (
          <span className="text-[10px] text-muted-foreground font-mono">
            {matchCount}
          </span>
        )}

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground"
            aria-label="Clear file filter"
          >
            <AppIcon icon={Cancel01Icon} size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
