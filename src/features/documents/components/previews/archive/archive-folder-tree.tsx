import { useState } from 'react'
import {
  Folder01Icon,
  FolderOpenIcon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { cn } from '@/lib/utils'

export interface ArchiveFolderTreeProps {
  rootTree: ArchiveTreeNode
  currentPath: string
  onSelectDirectory: (path: string) => void
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
  className?: string
}

interface TreeNodeItemProps {
  node: ArchiveTreeNode
  currentPath: string
  onSelectDirectory: (path: string) => void
  level?: number
}

function TreeNodeItem({
  node,
  currentPath,
  onSelectDirectory,
  level = 0,
}: TreeNodeItemProps) {
  // Only render directories in tree
  if (!node.dir && node.path !== '') return null

  const isRoot = node.path === ''
  const isSelected = currentPath === node.path
  const isAncestor = currentPath.startsWith(node.path + '/')

  const [isExpanded, setIsExpanded] = useState<boolean>(isRoot || isAncestor || level === 0)

  const childDirs = node.children.filter((c) => c.dir)
  const hasChildDirs = childDirs.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const handleClick = () => {
    onSelectDirectory(node.path)
  }

  return (
    <div className="select-none font-mono text-xs">
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors',
          isSelected
            ? 'bg-primary/10 text-foreground font-semibold border-l-2 border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-surface-muted/60'
        )}
        style={{ paddingLeft: `${Math.max(8, level * 14 + 8)}px` }}
      >
        {hasChildDirs ? (
          <button
            type="button"
            onClick={handleToggle}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground shrink-0"
            aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
          >
            <AppIcon icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon} size={11} />
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <AppIcon
          icon={isExpanded || isSelected ? FolderOpenIcon : Folder01Icon}
          size={14}
          className={cn(
            'shrink-0',
            isSelected ? 'text-primary' : 'text-muted-foreground'
          )}
        />

        <span className="truncate flex-1">
          {isRoot ? 'root' : node.name}
        </span>

        {node.directDirCount > 0 && (
          <span className="text-[10px] text-muted-foreground/60 px-1 font-sans">
            {node.directDirCount}
          </span>
        )}
      </div>

      {isExpanded && hasChildDirs && (
        <div className="space-y-0.5">
          {childDirs.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              currentPath={currentPath}
              onSelectDirectory={onSelectDirectory}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ArchiveFolderTree({
  rootTree,
  currentPath,
  onSelectDirectory,
  isOpen,
  onClose,
  isMobile = false,
  className,
}: ArchiveFolderTreeProps) {
  // Mobile rendering via Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="left"
          className="w-80 max-w-[85vw] p-0 flex flex-col bg-surface border-r border-border select-none"
        >
          <SheetHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between text-left">
            <SheetTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AppIcon icon={Folder01Icon} size={16} className="text-primary" />
              <span>Archive Folders</span>
            </SheetTitle>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Close folder tree"
            >
              <AppIcon icon={Cancel01Icon} size={15} />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
            <TreeNodeItem
              node={rootTree}
              currentPath={currentPath}
              onSelectDirectory={(p) => {
                onSelectDirectory(p)
                onClose()
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop inline rail
  if (!isOpen) return null

  return (
    <aside
      aria-label="Archive directory tree"
      className={cn(
        'w-64 shrink-0 border-r border-border/70 bg-surface-muted/20 flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="p-3 border-b border-border/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
        <span>Directories</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-muted-foreground hover:text-foreground"
          aria-label="Close directory rail"
          title="Close"
        >
          <AppIcon icon={Cancel01Icon} size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <TreeNodeItem
          node={rootTree}
          currentPath={currentPath}
          onSelectDirectory={onSelectDirectory}
        />
      </div>
    </aside>
  )
}
