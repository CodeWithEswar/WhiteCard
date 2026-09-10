import { motion } from 'framer-motion'
import { ArchiveFileRow } from './archive-file-row'
import type { ArchiveTreeNode } from '@/features/documents/lib/archive-tree'
import { useAppReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface ArchiveFileListProps {
  entries: ArchiveTreeNode[]
  isRoot: boolean
  onSelectNode: (node: ArchiveTreeNode) => void
  onNavigateUp: () => void
  className?: string
}

export function ArchiveFileList({
  entries,
  isRoot,
  onSelectNode,
  onNavigateUp,
  className,
}: ArchiveFileListProps) {
  const reduceMotion = useAppReducedMotion()

  return (
    <div
      className={cn(
        'w-full flex-1 flex flex-col bg-surface overflow-hidden',
        className
      )}
    >
      {/* Desktop Table Column Header */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-surface-muted/40 border-b border-border/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none font-mono">
        <div className="flex-1">Name</div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="w-24 text-left">Type</div>
          <div className="w-20 text-right">Size</div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.16 }}
        className="flex-1 overflow-y-auto divide-y divide-border/40"
      >
        {/* Parent Directory Link (..) if not at root */}
        {!isRoot && (
          <ArchiveFileRow
            node={{
              name: '..',
              path: '..',
              dir: true,
              size: 0,
              formattedSize: '-',
              children: [],
              directFileCount: 0,
              directDirCount: 0,
            }}
            isParentLink={true}
            onClick={onNavigateUp}
          />
        )}

        {/* Directory Entries */}
        {entries.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-mono select-none">
            {isRoot ? 'This archive contains no files.' : 'This folder is empty.'}
          </div>
        ) : (
          entries.map((entry) => (
            <ArchiveFileRow
              key={entry.path}
              node={entry}
              onClick={() => onSelectNode(entry)}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}
