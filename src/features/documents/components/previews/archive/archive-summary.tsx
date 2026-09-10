import { useState } from 'react'
import { BookOpen01Icon, ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { RichMarkdownRenderer } from '@/features/documents/lib/markdown-renderer'
import { cn } from '@/lib/utils'

export interface ArchiveSummaryProps {
  rootTree: ArchiveTreeNode
  readmeContent?: string | null
  readmePath?: string
  className?: string
}

export function ArchiveSummary({
  rootTree,
  readmeContent,
  readmePath,
  className,
}: ArchiveSummaryProps) {
  const [readmeExpanded, setReadmeExpanded] = useState(true)

  const topFolders = rootTree.children.filter((c) => c.dir)

  return (
    <div className={cn('space-y-4 pt-4 pb-8 select-none', className)}>
      {/* 1. Structural Archive Map Overview */}
      {topFolders.length > 0 && (
        <div className="p-3.5 rounded-2xl border border-border/70 bg-surface-muted/30">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono mb-2">
            Archive Map
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {topFolders.slice(0, 8).map((folder) => (
              <div
                key={folder.path}
                className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border/60"
              >
                <span className="font-semibold text-foreground truncate">{folder.name}/</span>
                <span className="text-[10px] text-muted-foreground ml-1 shrink-0">
                  {folder.children.length} {folder.children.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Root README.md Section */}
      {readmeContent && (
        <div className="rounded-2xl border border-border/80 bg-surface shadow-2xs overflow-hidden text-left">
          {/* README Header */}
          <button
            type="button"
            onClick={() => setReadmeExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 bg-surface-muted/40 border-b border-border/70 text-xs font-semibold text-foreground font-mono transition-colors hover:bg-surface-muted/70"
          >
            <div className="flex items-center gap-2">
              <AppIcon icon={BookOpen01Icon} size={16} className="text-primary" />
              <span>{readmePath || 'README.md'}</span>
            </div>

            <AppIcon
              icon={readmeExpanded ? ArrowDown01Icon : ArrowRight01Icon}
              size={14}
              className="text-muted-foreground"
            />
          </button>

          {/* README Content */}
          {readmeExpanded && (
            <div className="p-6 text-foreground leading-relaxed select-text max-h-[600px] overflow-y-auto">
              <RichMarkdownRenderer content={readmeContent} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
