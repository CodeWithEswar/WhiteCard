import { AnimatePresence } from 'framer-motion'
import { UploadQueueItem } from './upload-queue-item'
import { formatBytes } from '@/lib/files/format-bytes'
import type { UploadQueueItem as QueueItemType } from '../upload.types'

interface UploadQueueProps {
  items: QueueItemType[]
  onRemove: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  selectedId?: string | null
  onSelect?: (id: string) => void
}

export function UploadQueue({
  items,
  onRemove,
  onCancel,
  onRetry,
  selectedId,
  onSelect,
}: UploadQueueProps) {
  if (items.length === 0) {
    return null
  }

  const totalBytes = items.reduce((acc, it) => acc + it.bytesTotal, 0)
  const completedCount = items.filter((it) => it.status === 'completed').length

  return (
    <div className="space-y-3">
      {/* Queue Summary Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
        <span className="font-medium text-foreground">
          {items.length} {items.length === 1 ? 'file' : 'files'} in queue
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {completedCount > 0 && (
            <>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {completedCount} of {items.length} done
              </span>
              <span>•</span>
            </>
          )}
          <span>{formatBytes(totalBytes)} total</span>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <UploadQueueItem
              key={item.id}
              item={item}
              onRemove={onRemove}
              onCancel={onCancel}
              onRetry={onRetry}
              isSelected={selectedId === item.id}
              onSelect={onSelect}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
