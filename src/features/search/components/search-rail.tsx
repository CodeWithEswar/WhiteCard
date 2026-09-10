import React, { useState } from 'react'
import { SearchCommandBar } from './search-command-bar'
import { SearchScopeSwitcher } from './search-scope-switcher'
import type { SearchScope } from '../search.types'
import { cn } from '@/lib/utils'

export interface SearchRailProps {
  query: string
  onQueryChange: (q: string) => void
  scope: SearchScope
  onScopeChange: (scope: SearchScope) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  isSearching?: boolean
  className?: string
}

export function SearchRail({
  query,
  onQueryChange,
  scope,
  onScopeChange,
  inputRef,
  isSearching = false,
  className,
}: SearchRailProps) {
  const [hasFocusWithin, setHasFocusWithin] = useState(false)

  return (
    <div
      onFocus={() => setHasFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHasFocusWithin(false)
        }
      }}
      className={cn(
        'group relative w-full rounded-[20px] border border-border/85 bg-surface/95 backdrop-blur-md transition-all duration-200 overflow-hidden select-none',
        'shadow-2xs',
        hasFocusWithin && 'border-ring ring-2 ring-ring/15 bg-surface',
        className
      )}
    >
      {/* Subtle fine grid decoration fragment in top-right corner */}
      <div
        className="absolute top-0 right-0 w-36 h-20 pointer-events-none opacity-40 dark:opacity-25 mask-radial-subtle"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top Half: Command Search Input */}
      <div className="relative">
        <SearchCommandBar
          value={query}
          onChange={onQueryChange}
          inputRef={inputRef}
          isSearching={isSearching}
        />
      </div>

      {/* Thin Architectural Inner Divider */}
      <div className="h-px w-full bg-border/60" />

      {/* Bottom Half: Segmented Scope Switcher + Subtle Status Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-surface-muted/30">
        <SearchScopeSwitcher
          value={scope}
          onChange={onScopeChange}
        />

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground/75 px-1.5">
          {isSearching ? (
            <span className="flex items-center gap-1.5 text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Searching…
            </span>
          ) : (
            <span>
              {scope === 'all'
                ? 'Searching all spaces'
                : scope === 'government'
                ? 'Government Documents'
                : 'Student Certificates'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
