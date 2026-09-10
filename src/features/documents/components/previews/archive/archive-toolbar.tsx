import { Folder01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { ArchiveBreadcrumbs } from './archive-breadcrumbs'
import { ArchiveSearch } from './archive-search'
import type { BreadcrumbItem } from '@/features/documents/hooks/use-archive-navigation'
import { cn } from '@/lib/utils'

export interface ArchiveToolbarProps {
  breadcrumbs: BreadcrumbItem[]
  onNavigateBreadcrumb: (path: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onSearchClear: () => void
  searchMatchCount?: number
  isTreeOpen: boolean
  onToggleTree: () => void
  className?: string
}

export function ArchiveToolbar({
  breadcrumbs,
  onNavigateBreadcrumb,
  searchQuery,
  onSearchChange,
  onSearchClear,
  searchMatchCount,
  isTreeOpen,
  onToggleTree,
  className,
}: ArchiveToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 border-b border-border/70 bg-surface/70 backdrop-blur-xs select-none',
        className
      )}
    >
      {/* Left: Files Tree Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <Button
          variant={isTreeOpen ? 'secondary' : 'outline'}
          size="sm"
          onClick={onToggleTree}
          className="h-8 px-2.5 rounded-xl border-border text-xs font-medium gap-1.5 shrink-0 shadow-2xs"
          aria-label={isTreeOpen ? 'Hide folder tree' : 'Show folder tree'}
          title="Toggle directory tree"
        >
          <AppIcon icon={Folder01Icon} size={14} className={isTreeOpen ? 'text-primary' : 'text-muted-foreground'} />
          <span className="hidden sm:inline">Files</span>
        </Button>

        <div className="h-4 w-px bg-border/80 hidden sm:block shrink-0" />

        <div className="min-w-0 flex-1">
          <ArchiveBreadcrumbs
            breadcrumbs={breadcrumbs}
            onNavigate={onNavigateBreadcrumb}
          />
        </div>
      </div>

      {/* Right: Search Filter Input */}
      <div className="shrink-0">
        <ArchiveSearch
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          matchCount={searchMatchCount}
        />
      </div>
    </div>
  )
}
