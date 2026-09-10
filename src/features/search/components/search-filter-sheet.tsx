import { useState, useEffect } from 'react'
import {
  FilterHorizontalIcon,
  Cancel01Icon,
  Tick02Icon,
  Sorting01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { SearchState, SearchScope, SearchSort, SearchDatePreset, SearchExpiryFilter } from '../search.types'
import {
  SEARCH_SCOPES,
  GOVERNMENT_CATEGORIES,
  STUDENT_CATEGORIES,
  SEARCH_FILE_TYPES,
  SEARCH_DATE_PRESETS,
  SEARCH_EXPIRY_OPTIONS,
  SEARCH_SORT_OPTIONS,
} from '../search.constants'
import { resolveTagColor } from '@/config/tag-colors'
import { getActiveFilterCount } from '../search.utils'
import { cn } from '@/lib/utils'
import type { DocumentFileType } from '@/types/document'

export interface SearchFilterSheetProps {
  state: SearchState
  availableTags: { id?: string; name: string; colorKey?: string }[]
  totalResultsCount?: number
  onApplyFilters: (draft: Partial<SearchState>) => void
  onResetFilters: () => void
  className?: string
}

export function SearchFilterSheet({
  state,
  availableTags,
  totalResultsCount,
  onApplyFilters,
  onResetFilters,
  className,
}: SearchFilterSheetProps) {
  const [open, setOpen] = useState(false)

  // Staged draft state for staged mobile changes
  const [draftSpace, setDraftSpace] = useState<SearchScope>(state.space)
  const [draftCategory, setDraftCategory] = useState<string | undefined>(state.category)
  const [draftFileType, setDraftFileType] = useState<DocumentFileType | undefined>(state.fileType)
  const [draftTags, setDraftTags] = useState<string[]>(state.tags)
  const [draftDatePreset, setDraftDatePreset] = useState<SearchDatePreset | undefined>(state.datePreset)
  const [draftExpires, setDraftExpires] = useState<SearchExpiryFilter | undefined>(state.expires)
  const [draftSort, setDraftSort] = useState<SearchSort>(state.sort)

  // Sync draft whenever sheet opens
  useEffect(() => {
    if (open) {
      setDraftSpace(state.space)
      setDraftCategory(state.category)
      setDraftFileType(state.fileType)
      setDraftTags(state.tags)
      setDraftDatePreset(state.datePreset)
      setDraftExpires(state.expires)
      setDraftSort(state.sort)
    }
  }, [open, state])

  const activeCount = getActiveFilterCount(state)

  const handleApply = () => {
    onApplyFilters({
      space: draftSpace,
      category: draftCategory,
      fileType: draftFileType,
      tags: draftTags,
      datePreset: draftDatePreset,
      expires: draftExpires,
      sort: draftSort,
    })
    setOpen(false)
  }

  const handleReset = () => {
    setDraftSpace('all')
    setDraftCategory(undefined)
    setDraftFileType(undefined)
    setDraftTags([])
    setDraftDatePreset('all')
    setDraftExpires('all')
    setDraftSort('recent')
    onResetFilters()
    setOpen(false)
  }

  const toggleDraftTag = (tag: string) => {
    setDraftTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const showGov = draftSpace === 'all' || draftSpace === 'government'
  const showStudent = draftSpace === 'all' || draftSpace === 'student'

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'h-11 px-3.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-2 shadow-2xs select-none',
              activeCount > 0 && 'border-primary/40 bg-primary/5 text-foreground',
              className
            )}
            aria-label={`Open search filters, ${activeCount} active`}
          >
            <AppIcon icon={FilterHorizontalIcon} size={16} className="text-muted-foreground" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />

      <SheetContent
        side="bottom"
        className="max-h-[90dvh] h-[90dvh] rounded-t-[24px] border-t border-border bg-surface p-0 flex flex-col z-50 overflow-hidden"
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 rounded-full bg-border mx-auto mt-3 mb-1" />

        <SheetHeader className="px-5 py-3 border-b border-border/60 flex flex-row items-center justify-between text-left">
          <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <span>Filters & Discovery</span>
            {activeCount > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({activeCount} active)
              </span>
            )}
          </SheetTitle>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted"
            aria-label="Close filters"
          >
            <AppIcon icon={Cancel01Icon} size={16} />
          </button>
        </SheetHeader>

        {/* Scrollable Filter Sections */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 select-none">
          {/* 1. Space Scope */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Document Space
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {SEARCH_SCOPES.map((scope) => {
                const isSelected = draftSpace === scope.id
                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setDraftSpace(scope.id)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-medium transition-all text-center border',
                      isSelected
                        ? 'border-primary/50 bg-primary/10 text-foreground font-semibold'
                        : 'border-border/80 bg-surface-muted/30 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {scope.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Category */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Category
              </label>
              {draftCategory && (
                <button
                  type="button"
                  onClick={() => setDraftCategory(undefined)}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline"
                >
                  Reset category
                </button>
              )}
            </div>

            <div className="space-y-3">
              {showGov && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground/70 uppercase mb-1.5">
                    Government
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {GOVERNMENT_CATEGORIES.map((cat) => {
                      const isSelected = draftCategory === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setDraftCategory(isSelected ? undefined : cat)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                            isSelected
                              ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                              : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {showStudent && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground/70 uppercase mb-1.5">
                    Student
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STUDENT_CATEGORIES.map((cat) => {
                      const isSelected = draftCategory === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setDraftCategory(isSelected ? undefined : cat)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                            isSelected
                              ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                              : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. File Type */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                File Type
              </label>
              {draftFileType && (
                <button
                  type="button"
                  onClick={() => setDraftFileType(undefined)}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline"
                >
                  Reset type
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEARCH_FILE_TYPES.map((ft) => {
                const isSelected = draftFileType === ft.id
                return (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setDraftFileType(isSelected ? undefined : ft.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                        : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {ft.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Tags */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tags
              </label>
              {draftTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDraftTags([])}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear tags
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((t) => {
                const isSelected = draftTags.includes(t.name)
                const colorConfig = resolveTagColor(t.name)
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => toggleDraftTag(t.name)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                        : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className={`size-1.5 rounded-full ${colorConfig.dot}`} />
                    <span>{t.name}</span>
                    {isSelected && <AppIcon icon={Tick02Icon} size={12} className="text-primary ml-0.5" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. Date Presets */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Uploaded Date
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SEARCH_DATE_PRESETS.map((dp) => {
                const isSelected = (draftDatePreset || 'all') === dp.id
                return (
                  <button
                    key={dp.id}
                    type="button"
                    onClick={() => setDraftDatePreset(dp.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                        : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {dp.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 6. Expiry Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Expiry Attention
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SEARCH_EXPIRY_OPTIONS.map((exp) => {
                const isSelected = (draftExpires || 'all') === exp.id
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setDraftExpires(exp.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground font-semibold shadow-2xs'
                        : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {exp.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 7. Sort Direction */}
          <div className="space-y-2.5 pb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <AppIcon icon={Sorting01Icon} size={13} />
              <span>Sort Order</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {SEARCH_SORT_OPTIONS.map((sortOpt) => {
                const isSelected = draftSort === sortOpt.id
                return (
                  <button
                    key={sortOpt.id}
                    type="button"
                    onClick={() => setDraftSort(sortOpt.id)}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-left',
                      isSelected
                        ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                        : 'border-border/70 bg-surface-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {sortOpt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-border/80 bg-surface-elevated/95 backdrop-blur-md flex items-center justify-between gap-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground h-11 px-4 rounded-xl"
          >
            Reset
          </Button>

          <Button
            onClick={handleApply}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs"
          >
            {totalResultsCount !== undefined
              ? `Show ${totalResultsCount} results`
              : 'Apply filters'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
