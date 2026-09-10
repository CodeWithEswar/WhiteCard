import * as React from 'react'
import { format } from 'date-fns'
import { Calendar03Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from 'cn'

export interface DatePickerProps {
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  align?: 'start' | 'center' | 'end'
  isRenewal?: boolean
  minDate?: Date
  maxDate?: Date
}

/**
 * Parses a YYYY-MM-DD string into a local Date object without timezone shifting bugs.
 */
export function parseDateString(val?: string | null): Date | undefined {
  if (!val) return undefined
  const parts = val.split('-').map(Number)
  if (parts.length === 3 && !parts.some(isNaN)) {
    const [year, month, day] = parts
    return new Date(year, month - 1, day)
  }
  const parsed = new Date(val)
  return isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * Formats a Date object to YYYY-MM-DD.
 */
export function formatDateToString(date?: Date): string {
  if (!date || isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
  id,
  align = 'start',
  isRenewal = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => parseDateString(value), [value])

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange('')
    } else {
      onChange(formatDateToString(date))
    }
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              id={id}
              type="button"
              disabled={disabled}
              className={cn(
                'w-full h-9 pl-3 pr-8 rounded-xl border text-xs flex items-center justify-between text-left transition-all outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none bg-card hover:bg-muted/30 cursor-pointer',
                value
                  ? 'text-foreground font-medium border-border'
                  : 'text-muted-foreground font-normal border-border',
                isRenewal && value && 'border-amber-500/50 ring-1 ring-amber-500/20 bg-amber-500/5',
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
              )}
            />
          }
        >
          <span className="flex items-center gap-2 truncate">
            <AppIcon
              icon={Calendar03Icon}
              size={14}
              className={cn(
                'shrink-0 transition-colors',
                value ? (isRenewal ? 'text-amber-600 dark:text-amber-400' : 'text-primary') : 'text-muted-foreground'
              )}
            />
            <span className={cn('truncate', !value && 'text-muted-foreground/75')}>
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder}
            </span>
          </span>
          {!value && (
            <span className="text-[10px] uppercase font-mono text-muted-foreground/50 tracking-wider">
              Pick
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 rounded-2xl shadow-xl border border-border/80 bg-popover overflow-hidden z-50"
          align={align}
          sideOffset={6}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(d) => {
              if (minDate && d < minDate) return true
              if (maxDate && d > maxDate) return true
              return false
            }}
          />
          <div className="p-2 border-t border-border/60 flex items-center justify-between gap-2 bg-muted/20">
            <button
              type="button"
              className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors cursor-pointer"
              onClick={() => handleSelect(new Date())}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                className="px-2.5 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                onClick={() => handleSelect(undefined)}
              >
                Clear Date
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear date"
          aria-label="Clear date"
          className="absolute right-2 top-1/2 -translate-y-1/2 size-5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <AppIcon icon={Cancel01Icon} size={12} />
        </button>
      )}
    </div>
  )
}
