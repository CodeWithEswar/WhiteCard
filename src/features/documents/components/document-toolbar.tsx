import { useState } from 'react'
import {
  Search01Icon,
  FilterHorizontalIcon,
  Sorting01Icon,
  Grid02Icon,
  ListViewIcon,
  Upload01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import type { DocumentFilterOptions } from '../../../types/document'
import { DocumentFilters } from './document-filters'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { ResponsiveDialog } from '../../../components/layout/responsive-dialog'
import { useIsMobile } from '../../../hooks/use-mobile'

interface DocumentToolbarProps {
  title?: string
  totalCount?: number
  filters: DocumentFilterOptions
  onFiltersChange: (newFilters: DocumentFilterOptions) => void
  onResetFilters: () => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onUploadClick?: () => void
  showSpaceFilter?: boolean
  showHeader?: boolean
}

export function DocumentToolbar({
  title,
  totalCount,
  filters,
  onFiltersChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  onUploadClick,
  showSpaceFilter = true,
  showHeader = false,
}: DocumentToolbarProps) {
  const isMobile = useIsMobile()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(false)

  const activeFilterCount =
    (filters.fileType && filters.fileType !== 'all' ? 1 : 0) +
    (filters.tags?.length || 0) +
    (showSpaceFilter && filters.space && filters.space !== 'all' ? 1 : 0)

  const sortOptions = [
    { id: 'updated_desc', label: 'Recently Updated' },
    { id: 'updated_asc', label: 'Oldest Updated' },
    { id: 'name_asc', label: 'Title (A to Z)' },
    { id: 'size_desc', label: 'File Size (Largest)' },
  ] as const

  const currentSortLabel =
    sortOptions.find((s) => s.id === filters.sortBy)?.label ||
    'Recently Updated'

  return (
    <div className="space-y-4 mb-6">
      {/* Optional Top Header Row (if page does not use ResponsivePageHeader) */}
      {showHeader && title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {typeof totalCount === 'number' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-muted border border-border text-muted-foreground">
                {totalCount}
              </span>
            )}
          </div>

          {/* Upload Action */}
          {onUploadClick && (
            <div className="flex items-center gap-2">
              <Button
                onClick={onUploadClick}
                className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs active:scale-[0.985]"
              >
                <AppIcon icon={Upload01Icon} size={15} />
                <span>Upload Document</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Toolbar Controls Row: Search + Filter + Sort + Grid/List */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <AppIcon icon={Search01Icon} size={15} />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Search by title, filename, tag..."
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl bg-surface border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none placeholder:text-muted-foreground/70 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <AppIcon icon={Cancel01Icon} size={13} />
            </button>
          )}
        </div>

        {/* Action Controls: Filter, Sort, View */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          {/* Filters Button */}
          {isMobile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className={`h-9 px-3 rounded-xl text-xs gap-1.5 border-border ${activeFilterCount > 0
                ? 'border-primary/50 text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <AppIcon icon={FilterHorizontalIcon} size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          ) : (
            <Popover
              open={desktopFilterOpen}
              onOpenChange={setDesktopFilterOpen}
            >
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 px-3 rounded-xl text-xs gap-1.5 border-border ${activeFilterCount > 0
                      ? 'border-primary/50 text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  />
                }
              >
                <AppIcon icon={FilterHorizontalIcon} size={15} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl border border-border/80 bg-surface">
                <DocumentFilters
                  filters={filters}
                  onChange={onFiltersChange}
                  onReset={onResetFilters}
                  showSpaceFilter={showSpaceFilter}
                  onApply={() => setDesktopFilterOpen(false)}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground border-border"
                />
              }
            >
              <AppIcon icon={Sorting01Icon} size={15} />
              <span className="hidden md:inline">{currentSortLabel}</span>
              <span className="md:hidden">Sort</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() =>
                    onFiltersChange({ ...filters, sortBy: opt.id })
                  }
                  className={`text-xs ${(filters.sortBy || 'updated_desc') === opt.id
                    ? 'font-semibold text-primary'
                    : ''
                    }`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-xl border border-border bg-surface-muted">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'grid'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <AppIcon icon={Grid02Icon} size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              className={`p-1.5 rounded-xl transition-colors ${viewMode === 'list'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <AppIcon icon={ListViewIcon} size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <ResponsiveDialog
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        title="Filter Vault Documents"
        description="Refine by format, category and tags"
      >
        <DocumentFilters
          filters={filters}
          onChange={onFiltersChange}
          onReset={() => {
            onResetFilters()
            setMobileFilterOpen(false)
          }}
          showSpaceFilter={showSpaceFilter}
          onApply={() => setMobileFilterOpen(false)}
        />
      </ResponsiveDialog>
    </div>
  )
}
