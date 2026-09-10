import React, { useState } from 'react'
import { Search01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

export interface SearchCommandBarProps {
  value: string
  onChange: (value: string) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  className?: string
  placeholder?: string
  isSearching?: boolean
}

export function SearchCommandBar({
  value,
  onChange,
  inputRef,
  className,
  placeholder = 'Search documents, filenames, tags, categories...',
  isSearching = false,
}: SearchCommandBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
    inputRef?.current?.focus()
  }

  return (
    <div
      className={cn(
        'relative flex items-center w-full transition-all duration-200',
        className
      )}
    >
      {/* Search Icon / Active Indicator */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground transition-colors duration-150">
        <AppIcon
          icon={Search01Icon}
          size={18}
          className={cn(
            'transition-colors duration-200',
            isFocused ? 'text-foreground' : 'text-muted-foreground/70'
          )}
        />
      </div>

      {/* Primary Input Element */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        aria-label="Search your White Card"
        className={cn(
          'w-full h-13 pl-11 pr-24 text-sm font-normal text-foreground placeholder:text-muted-foreground/60',
          'bg-transparent outline-hidden transition-all',
          'selection:bg-selection-background selection:text-foreground'
        )}
      />

      {/* Right-aligned Actions: Clear Button & Keyboard Shortcut Badge */}
      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
            aria-label="Clear search"
          >
            <AppIcon icon={Cancel01Icon} size={15} />
          </button>
        ) : null}

        {/* Keyboard shortcut indicator (⌘K or /) */}
        <div
          className={cn(
            'hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border/80 bg-surface-muted/60 text-[10px] font-mono font-medium text-muted-foreground/80 select-none transition-opacity duration-150',
            isFocused ? 'opacity-20 pointer-events-none' : 'opacity-100'
          )}
          title="Press / or ⌘K to search"
        >
          <span className="text-[11px]">⌘</span>K
        </div>
      </div>
    </div>
  )
}
