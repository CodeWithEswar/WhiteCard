import { useState } from 'react'
import {
  Folder01Icon,
  File01Icon,
  Tag01Icon,
  Calendar01Icon,
  Alert02Icon,
  ArrowDown01Icon,
  CheckmarkBadge01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SearchSortControl } from './search-sort-control'
import { SearchViewSwitcher } from './search-view-switcher'
import type { SearchState } from '../search.types'
import {
  GOVERNMENT_CATEGORIES,
  STUDENT_CATEGORIES,
  SEARCH_FILE_TYPES,
  SEARCH_DATE_PRESETS,
  SEARCH_EXPIRY_OPTIONS,
} from '../search.constants'
import { resolveTagColor } from '@/config/tag-colors'
import { cn } from '@/lib/utils'

export interface SearchFilterBarProps {
  state: SearchState
  availableTags: { id?: string; name: string; colorKey?: string }[]
  onCategoryChange: (cat?: string) => void
  onFileTypeChange: (type?: any) => void
  onToggleTag: (tag: string) => void
  onDatePresetChange: (preset: any, from?: string, to?: string) => void
  onExpiryChange: (exp: any) => void
  onSortChange: (sort: any) => void
  onViewChange: (view: 'grid' | 'list') => void
  className?: string
}

export function SearchFilterBar({
  state,
  availableTags,
  onCategoryChange,
  onFileTypeChange,
  onToggleTag,
  onDatePresetChange,
  onExpiryChange,
  onSortChange,
  onViewChange,
  className,
}: SearchFilterBarProps) {
  const [tagSearch, setTagSearch] = useState('')

  const filteredTags = availableTags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase().trim())
  )

  const showGovCategories = state.space === 'all' || state.space === 'government'
  const showStudentCategories = state.space === 'all' || state.space === 'student'

  return (
    <div
      className={cn(
        'hidden md:flex items-center justify-between gap-3 pt-3 pb-1 select-none',
        className
      )}
    >
      {/* Left Toolbar: Category, File Type, Tags, Date, Expiry */}
      <div className="flex items-center flex-wrap gap-1.5">
        {/* 1. Category Filter Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 px-2.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors',
                  state.category && 'border-primary/40 bg-primary/5 text-foreground'
                )}
              >
                <AppIcon icon={Folder01Icon} size={13} className="text-muted-foreground" />
                <span>{state.category ? state.category : 'Category'}</span>
                {state.category && <span className="size-1.5 rounded-full bg-primary" />}
                <AppIcon icon={ArrowDown01Icon} size={11} className="text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-56 p-1.5 rounded-xl border border-border shadow-md">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Filter by Category</span>
              {state.category && (
                <button
                  type="button"
                  onClick={() => onCategoryChange(undefined)}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 py-1 pr-1">
              {showGovCategories && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                    Government
                  </div>
                  {GOVERNMENT_CATEGORIES.map((cat) => {
                    const isSelected = state.category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onCategoryChange(isSelected ? undefined : cat)}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                          isSelected
                            ? 'bg-surface-muted font-medium text-foreground'
                            : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span>{cat}</span>
                        {isSelected && (
                          <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {showStudentCategories && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                    Student
                  </div>
                  {STUDENT_CATEGORIES.map((cat) => {
                    const isSelected = state.category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onCategoryChange(isSelected ? undefined : cat)}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                          isSelected
                            ? 'bg-surface-muted font-medium text-foreground'
                            : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span>{cat}</span>
                        {isSelected && (
                          <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* 2. File Type Filter Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 px-2.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors',
                  state.fileType && 'border-primary/40 bg-primary/5 text-foreground'
                )}
              >
                <AppIcon icon={File01Icon} size={13} className="text-muted-foreground" />
                <span>
                  {state.fileType
                    ? SEARCH_FILE_TYPES.find((f) => f.id === state.fileType)?.label || 'Type'
                    : 'File Type'}
                </span>
                {state.fileType && <span className="size-1.5 rounded-full bg-primary" />}
                <AppIcon icon={ArrowDown01Icon} size={11} className="text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-48 p-1.5 rounded-xl border border-border shadow-md">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>File Format</span>
              {state.fileType && (
                <button
                  type="button"
                  onClick={() => onFileTypeChange(undefined)}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5 py-1">
              {SEARCH_FILE_TYPES.map((ft) => {
                const isSelected = state.fileType === ft.id
                return (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => onFileTypeChange(isSelected ? undefined : ft.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                      isSelected
                        ? 'bg-surface-muted font-medium text-foreground'
                        : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span>{ft.label}</span>
                    {isSelected && (
                      <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* 3. Tags Filter Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 px-2.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors',
                  state.tags.length > 0 && 'border-primary/40 bg-primary/5 text-foreground'
                )}
              >
                <AppIcon icon={Tag01Icon} size={13} className="text-muted-foreground" />
                <span>{state.tags.length > 0 ? `Tags (${state.tags.length})` : 'Tags'}</span>
                {state.tags.length > 0 && <span className="size-1.5 rounded-full bg-primary" />}
                <AppIcon icon={ArrowDown01Icon} size={11} className="text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-56 p-2 rounded-xl border border-border shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Filter by Tags</span>
                {state.tags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => state.tags.forEach((t) => onToggleTag(t))}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full h-7 px-2 text-xs rounded-lg border border-border bg-surface-muted/50 text-foreground placeholder:text-muted-foreground/60 outline-hidden focus:border-ring"
              />

              <div className="max-h-48 overflow-y-auto space-y-0.5 py-1">
                {filteredTags.length === 0 ? (
                  <div className="px-2 py-3 text-center text-xs text-muted-foreground">
                    No matching tags found
                  </div>
                ) : (
                  filteredTags.map((t) => {
                    const isSelected = state.tags.includes(t.name)
                    const colorConfig = resolveTagColor(t.name)
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => onToggleTag(t.name)}
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-left',
                          isSelected
                            ? 'bg-surface-muted font-medium text-foreground'
                            : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`size-1.5 rounded-full ${colorConfig.dot}`} />
                          <span>{t.name}</span>
                        </span>
                        {isSelected && (
                          <AppIcon icon={Tick02Icon} size={13} className="text-primary" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 4. Date Filter Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 px-2.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors',
                  ((state.datePreset && state.datePreset !== 'all') || state.uploadedFrom) &&
                    'border-primary/40 bg-primary/5 text-foreground'
                )}
              >
                <AppIcon icon={Calendar01Icon} size={13} className="text-muted-foreground" />
                <span>
                  {state.datePreset && state.datePreset !== 'all'
                    ? SEARCH_DATE_PRESETS.find((d) => d.id === state.datePreset)?.label || 'Date'
                    : 'Date'}
                </span>
                {state.datePreset && state.datePreset !== 'all' && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
                <AppIcon icon={ArrowDown01Icon} size={11} className="text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-48 p-1.5 rounded-xl border border-border shadow-md">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Uploaded Date</span>
              {state.datePreset !== 'all' && (
                <button
                  type="button"
                  onClick={() => onDatePresetChange('all')}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5 py-1">
              {SEARCH_DATE_PRESETS.map((dp) => {
                const isSelected = state.datePreset === dp.id
                return (
                  <button
                    key={dp.id}
                    type="button"
                    onClick={() => {
                      if (dp.id === 'all') {
                        onDatePresetChange('all')
                      } else if (dp.id === 'today') {
                        const today = new Date().toISOString().split('T')[0]
                        onDatePresetChange('today', today, today)
                      } else if (dp.id === '7d') {
                        const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0]
                        onDatePresetChange('7d', from)
                      } else if (dp.id === '30d') {
                        const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0]
                        onDatePresetChange('30d', from)
                      } else {
                        onDatePresetChange('custom')
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                      isSelected
                        ? 'bg-surface-muted font-medium text-foreground'
                        : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span>{dp.label}</span>
                    {isSelected && (
                      <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* 5. Expiry Filter Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 px-2.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-colors',
                  state.expires && state.expires !== 'all' &&
                    'border-primary/40 bg-primary/5 text-foreground'
                )}
              >
                <AppIcon icon={Alert02Icon} size={13} className="text-muted-foreground" />
                <span>
                  {state.expires && state.expires !== 'all'
                    ? SEARCH_EXPIRY_OPTIONS.find((e) => e.id === state.expires)?.label || 'Expiry'
                    : 'Expiry'}
                </span>
                {state.expires && state.expires !== 'all' && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
                <AppIcon icon={ArrowDown01Icon} size={11} className="text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-52 p-1.5 rounded-xl border border-border shadow-md">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Expiry Status</span>
              {state.expires !== 'all' && (
                <button
                  type="button"
                  onClick={() => onExpiryChange('all')}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-0.5 py-1">
              {SEARCH_EXPIRY_OPTIONS.map((exp) => {
                const isSelected = state.expires === exp.id
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => onExpiryChange(isSelected ? 'all' : exp.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                      isSelected
                        ? 'bg-surface-muted font-medium text-foreground'
                        : 'hover:bg-surface-muted/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span>{exp.label}</span>
                    {isSelected && (
                      <AppIcon icon={CheckmarkBadge01Icon} size={13} className="text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right Controls: Sort & Grid/List View Switcher */}
      <div className="flex items-center gap-2">
        <SearchSortControl value={state.sort} onChange={onSortChange} />
        <SearchViewSwitcher view={state.view} onChange={onViewChange} />
      </div>
    </div>
  )
}
