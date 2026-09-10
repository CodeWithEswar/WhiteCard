import { UploadItem } from './upload-item'
import type { UploadQueueItem } from './upload-item'

interface UploadQueueProps {
  items: UploadQueueItem[]
  onRemove: (id: string) => void
  className?: string
}

export function UploadQueue({
  items,
  onRemove,
  className = '',
}: UploadQueueProps) {
  if (items.length === 0) return null

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
        <span>Files Ready ({items.length})</span>
        <span className="font-mono text-[11px]">
          {(
            items.reduce((acc, it) => acc + it.file.size, 0) /
            (1024 * 1024)
          ).toFixed(1)}{' '}
          MB total
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <UploadItem key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}
