import { ArrowRight01Icon, Folder01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { BreadcrumbItem } from '@/features/documents/hooks/use-archive-navigation'
import { cn } from '@/lib/utils'

export interface ArchiveBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (path: string) => void
  className?: string
}

export function ArchiveBreadcrumbs({
  breadcrumbs,
  onNavigate,
  className,
}: ArchiveBreadcrumbsProps) {
  return (
    <nav
      aria-label="Archive navigation path"
      className={cn(
        'flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-1 select-none scrollbar-none',
        className
      )}
    >
      {breadcrumbs.map((item, index) => {
        const isFirst = index === 0

        return (
          <div key={item.path || 'root'} className="flex items-center gap-1.5 shrink-0">
            {!isFirst && (
              <span className="text-muted-foreground/60 flex items-center" aria-hidden="true">
                <AppIcon icon={ArrowRight01Icon} size={11} />
              </span>
            )}

            {item.isLast ? (
              <span
                className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-surface-muted/60 truncate max-w-[200px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                className="text-muted-foreground hover:text-foreground hover:underline px-1 py-0.5 rounded transition-colors flex items-center gap-1 truncate max-w-[160px]"
              >
                {item.isRoot && (
                  <AppIcon icon={Folder01Icon} size={13} className="text-primary/80" />
                )}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}
