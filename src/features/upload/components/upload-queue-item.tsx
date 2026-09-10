import { motion } from 'framer-motion'
import {
  Cancel01Icon,
  RefreshIcon,
  Tick02Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { UploadFileIcon } from './upload-file-icon'
import { UploadProgress } from './upload-progress'
import { formatBytes } from '@/lib/files/format-bytes'
import { useAppReducedMotion } from '@/lib/motion'
import type { UploadQueueItem as QueueItemType } from '../upload.types'

interface UploadQueueItemProps {
  item: QueueItemType
  onRemove: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export function UploadQueueItem({
  item,
  onRemove,
  onCancel,
  onRetry,
  isSelected = false,
  onSelect,
}: UploadQueueItemProps) {
  const reduceMotion = useAppReducedMotion()

  const isUploading = item.status === 'uploading' || item.status === 'preparing' || item.status === 'saving'
  const isCompleted = item.status === 'completed'
  const isFailed = item.status === 'failed' || item.status === 'cancelled'

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={() => onSelect?.(item.id)}
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex flex-col gap-2.5 ${
        isSelected
          ? 'border-primary ring-1 ring-primary/40 bg-card'
          : isCompleted
          ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
          : isFailed
          ? 'border-destructive/30 bg-destructive/[0.03]'
          : 'border-border bg-card'
      } ${onSelect ? 'cursor-pointer hover:border-border/80' : ''}`}
    >
      {/* Top Row: Icon + Filename + Size + Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <UploadFileIcon
            filename={item.file.name}
            mimeType={item.file.type}
            size={18}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-foreground truncate" title={item.file.name}>
              {item.file.name}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-0.5">
              <span>{formatBytes(item.bytesTotal)}</span>
              {item.metadata.space && (
                <>
                  <span>•</span>
                  <span className="font-sans capitalize">{item.metadata.space}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isCompleted && (
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <div className="size-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <AppIcon icon={Tick02Icon} size={13} />
              </div>
              <span className="hidden sm:inline">Complete</span>
            </div>
          )}

          {isUploading && (
            <button
              type="button"
              aria-label={`Cancel upload of ${item.file.name}`}
              onClick={() => onCancel(item.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          )}

          {isFailed && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={`Retry upload of ${item.file.name}`}
                onClick={() => onRetry(item.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground flex items-center gap-1 transition-colors"
              >
                <AppIcon icon={RefreshIcon} size={12} />
                <span>Retry</span>
              </button>
              <button
                type="button"
                aria-label={`Remove ${item.file.name}`}
                onClick={() => onRemove(item.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <AppIcon icon={Cancel01Icon} size={14} />
              </button>
            </div>
          )}

          {item.status === 'queued' && (
            <button
              type="button"
              aria-label={`Remove ${item.file.name}`}
              onClick={() => onRemove(item.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <AppIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress and Stage Row */}
      {(isUploading || isCompleted) && (
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{item.stageText || 'Processing'}</span>
            {item.percent !== undefined && (
              <span className="font-mono tabular-nums">{Math.round(item.percent)}%</span>
            )}
          </div>
          <UploadProgress
            percent={isCompleted ? 100 : item.percent}
            isIndeterminate={isUploading && item.percent === undefined}
          />
        </div>
      )}

      {/* Error reason text */}
      {isFailed && item.error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive pt-0.5">
          <AppIcon icon={Alert02Icon} size={13} className="shrink-0" />
          <span className="truncate">{item.error}</span>
        </div>
      )}
    </motion.div>
  )
}
