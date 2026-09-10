import {
  Folder01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { resolveArchiveFileType } from '@/features/documents/lib/archive-file-types'
import { cn } from '@/lib/utils'

export interface ArchiveFileRowProps {
  node: ArchiveTreeNode
  onClick: () => void
  isParentLink?: boolean
  className?: string
}

export function ArchiveFileRow({
  node,
  onClick,
  isParentLink = false,
  className,
}: ArchiveFileRowProps) {
  const typeInfo = resolveArchiveFileType(node.name, node.dir)
  const isFolder = node.dir

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={
        isParentLink
          ? 'Go to parent directory'
          : isFolder
          ? `Open folder ${node.name}`
          : `Open file ${node.name}, ${typeInfo.label}, ${node.formattedSize}`
      }
      className={cn(
        'group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-2 hover:bg-surface-elevated/60 transition-colors duration-150 select-none cursor-pointer border-b border-border/50 outline-hidden focus-visible:bg-surface-muted',
        className
      )}
    >
      {/* Left: Icon & Filename */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="size-6 rounded-md flex items-center justify-center shrink-0 text-foreground">
          {isFolder ? (
            <AppIcon icon={Folder01Icon} size={16} className="text-primary" />
          ) : (
            <AppIcon icon={typeInfo.icon} size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-mono truncate transition-colors',
                isFolder
                  ? 'font-semibold text-foreground group-hover:text-primary'
                  : 'font-normal text-foreground/90 group-hover:text-foreground'
              )}
            >
              {isParentLink ? '..' : node.name}
            </span>
          </div>

          {/* Mobile sub-metadata */}
          <div className="sm:hidden flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <span>{isFolder ? 'Folder' : typeInfo.badgeText}</span>
            {!isFolder && (
              <>
                <span className="text-border-strong">•</span>
                <span>{node.formattedSize}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle/Right Desktop Columns: Type & Size */}
      <div className="hidden sm:flex items-center gap-6 shrink-0 text-xs font-mono text-muted-foreground">
        {/* Type Badge / Label */}
        <div className="w-24 text-left">
          {isFolder ? (
            <span className="text-muted-foreground/70">Folder</span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-muted/60 text-muted-foreground">
              {typeInfo.badgeText}
            </span>
          )}
        </div>

        {/* Formatted File Size */}
        <div className="w-20 text-right">
          {isFolder ? '-' : node.formattedSize}
        </div>
      </div>

      {/* Mobile chevron indicator */}
      {isFolder && (
        <div className="sm:hidden text-muted-foreground/50 shrink-0">
          <AppIcon icon={ArrowRight01Icon} size={14} />
        </div>
      )}
    </div>
  )
}
