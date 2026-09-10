import { useState } from 'react'
import {
  Sorting01Icon,
  CheckmarkBadge01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { SearchSort } from '../search.types'
import { SEARCH_SORT_OPTIONS } from '../search.constants'
import { cn } from '@/lib/utils'

export interface SearchSortControlProps {
  value: SearchSort
  onChange: (sort: SearchSort) => void
  className?: string
  compact?: boolean
}

export function SearchSortControl({
  value,
  onChange,
  className,
  compact = false,
}: SearchSortControlProps) {
  const [open, setOpen] = useState(false)

  const currentOption =
    SEARCH_SORT_OPTIONS.find((opt) => opt.id === value) || SEARCH_SORT_OPTIONS[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-9 px-3 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors select-none',
              value !== 'recent' && 'border-primary/40 bg-primary/5 text-foreground',
              className
            )}
            aria-label={`Sort by: ${currentOption.label}`}
          >
            <AppIcon icon={Sorting01Icon} size={14} className="text-muted-foreground" />
            <span className="hidden md:inline text-muted-foreground font-normal">Sort:</span>
            <span>{compact ? currentOption.shortLabel : currentOption.label}</span>
            <AppIcon
              icon={ArrowDown01Icon}
              size={12}
              className={cn('text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
            />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border border-border shadow-md">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Sort Documents
        </div>
        {SEARCH_SORT_OPTIONS.map((opt) => {
          const isSelected = value === opt.id
          return (
            <DropdownMenuItem
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={cn(
                'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer',
                isSelected && 'bg-surface-muted font-medium text-foreground'
              )}
            >
              <span>{opt.label}</span>
              {isSelected && (
                <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
