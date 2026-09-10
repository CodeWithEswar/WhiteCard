import { motion, AnimatePresence } from 'framer-motion'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { SearchState } from '../search.types'
import { resolveTagColor } from '@/config/tag-colors'
import { SEARCH_FILE_TYPES, SEARCH_EXPIRY_OPTIONS, SEARCH_DATE_PRESETS } from '../search.constants'
import { useAppReducedMotion } from '@/lib/motion'

export interface SearchActiveFiltersProps {
  state: SearchState
  onRemoveSpace?: () => void
  onRemoveCategory?: () => void
  onRemoveFileType?: () => void
  onRemoveTag?: (tag: string) => void
  onRemoveDate?: () => void
  onRemoveExpiry?: () => void
  onClearAll: () => void
}

export function SearchActiveFilters({
  state,
  onRemoveSpace,
  onRemoveCategory,
  onRemoveFileType,
  onRemoveTag,
  onRemoveDate,
  onRemoveExpiry,
  onClearAll,
}: SearchActiveFiltersProps) {
  const reduceMotion = useAppReducedMotion()

  const tokens: {
    id: string
    label: string
    colorDot?: string
    onRemove: () => void
    ariaLabel: string
  }[] = []

  // 1. Space
  if (state.space && state.space !== 'all') {
    tokens.push({
      id: `space-${state.space}`,
      label: state.space === 'government' ? 'Government Space' : 'Student Space',
      onRemove: () => onRemoveSpace?.(),
      ariaLabel: `Remove ${state.space} space filter`,
    })
  }

  // 2. Category
  if (state.category) {
    tokens.push({
      id: `cat-${state.category}`,
      label: `Category: ${state.category}`,
      onRemove: () => onRemoveCategory?.(),
      ariaLabel: `Remove category ${state.category} filter`,
    })
  }

  // 3. File Type
  if (state.fileType) {
    const ft = SEARCH_FILE_TYPES.find((f) => f.id === state.fileType)
    tokens.push({
      id: `type-${state.fileType}`,
      label: `Type: ${ft?.label || state.fileType.toUpperCase()}`,
      onRemove: () => onRemoveFileType?.(),
      ariaLabel: `Remove file type ${ft?.label} filter`,
    })
  }

  // 4. Tags
  if (state.tags && state.tags.length > 0) {
    state.tags.forEach((tag) => {
      const colorConfig = resolveTagColor(tag)
      tokens.push({
        id: `tag-${tag}`,
        label: tag,
        colorDot: colorConfig.dot,
        onRemove: () => onRemoveTag?.(tag),
        ariaLabel: `Remove tag ${tag} filter`,
      })
    })
  }

  // 5. Date Preset or Custom Range
  if (state.datePreset && state.datePreset !== 'all') {
    const preset = SEARCH_DATE_PRESETS.find((p) => p.id === state.datePreset)
    tokens.push({
      id: `date-${state.datePreset}`,
      label: `Date: ${preset?.label || state.datePreset}`,
      onRemove: () => onRemoveDate?.(),
      ariaLabel: `Remove date filter`,
    })
  } else if (state.uploadedFrom || state.uploadedTo) {
    tokens.push({
      id: 'date-range',
      label: `Date Range`,
      onRemove: () => onRemoveDate?.(),
      ariaLabel: `Remove date range filter`,
    })
  }

  // 6. Expiry Filter
  if (state.expires && state.expires !== 'all') {
    const exp = SEARCH_EXPIRY_OPTIONS.find((e) => e.id === state.expires)
    tokens.push({
      id: `expiry-${state.expires}`,
      label: exp?.label || `Expiry: ${state.expires}`,
      onRemove: () => onRemoveExpiry?.(),
      ariaLabel: `Remove expiry filter`,
    })
  }

  if (tokens.length === 0) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="Active document search filters"
      className="flex flex-wrap items-center gap-1.5 pt-2 pb-1 select-none"
    >
      <span className="text-[11px] font-medium text-muted-foreground mr-1">
        Active:
      </span>

      <AnimatePresence mode="popLayout">
        {tokens.map((token) => (
          <motion.span
            key={token.id}
            layout={!reduceMotion}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.14 }}
            className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-lg border border-border/70 bg-surface-muted/70 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted"
          >
            {token.colorDot && (
              <span className={`size-1.5 rounded-full ${token.colorDot}`} aria-hidden="true" />
            )}
            <span>{token.label}</span>
            <button
              type="button"
              onClick={token.onRemove}
              aria-label={token.ariaLabel}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface transition-colors ml-0.5"
            >
              <AppIcon icon={Cancel01Icon} size={12} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline ml-2 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  )
}
