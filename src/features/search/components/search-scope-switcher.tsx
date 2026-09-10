import { motion } from 'framer-motion'
import {
  Files01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { SearchScope } from '../search.types'
import { SEARCH_SCOPES } from '../search.constants'
import { cn } from '@/lib/utils'
import { useAppReducedMotion } from '@/lib/motion'

export interface SearchScopeSwitcherProps {
  value: SearchScope
  onChange: (scope: SearchScope) => void
  className?: string
}

const SCOPE_ICONS = {
  all: Files01Icon,
  government: Passport01Icon,
  student: Certificate01Icon,
}

export function SearchScopeSwitcher({
  value,
  onChange,
  className,
}: SearchScopeSwitcherProps) {
  const reduceMotion = useAppReducedMotion()

  return (
    <div
      role="radiogroup"
      aria-label="Select search space"
      className={cn('flex items-center gap-1 w-full sm:w-auto select-none', className)}
    >
      {SEARCH_SCOPES.map((scope) => {
        const isSelected = value === scope.id
        const Icon = SCOPE_ICONS[scope.id]

        return (
          <button
            key={scope.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={scope.ariaLabel}
            onClick={() => onChange(scope.id)}
            className={cn(
              'relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
              isSelected
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-muted/60'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={reduceMotion ? undefined : 'search-scope-active'}
                className="absolute inset-0 rounded-lg bg-surface border border-border/80 shadow-2xs -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <AppIcon
              icon={Icon}
              size={14}
              className={cn(
                'transition-colors',
                isSelected ? 'text-primary' : 'text-muted-foreground/80'
              )}
            />
            <span>{scope.label}</span>
          </button>
        )
      })}
    </div>
  )
}
