import { motion } from 'framer-motion'
import {
  Tick02Icon,
  Alert02Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { useAppReducedMotion } from '@/lib/motion'
import type { UploadQueueItem } from '../upload.types'

interface UploadCompleteStateProps {
  items: UploadQueueItem[]
  onViewDocuments: () => void
  onUploadMore: () => void
  onDone: () => void
  onRetryFailed?: (id: string) => void
}

export function UploadCompleteState({
  items,
  onViewDocuments,
  onUploadMore,
  onDone,
  onRetryFailed,
}: UploadCompleteStateProps) {
  const reduceMotion = useAppReducedMotion()

  const completedItems = items.filter((it) => it.status === 'completed')
  const failedItems = items.filter((it) => it.status === 'failed' || it.status === 'cancelled')

  const isPlural = completedItems.length !== 1

  return (
    <div className="py-2 sm:py-4 space-y-6">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mx-auto flex items-center justify-center"
        >
          <AppIcon icon={Tick02Icon} size={24} />
        </motion.div>

        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Upload Complete
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isPlural
              ? `${completedItems.length} documents were added to your White Card.`
              : 'Your document was successfully added to White Card.'}
          </p>
        </div>
      </div>

      {/* Completed files list */}
      <div className="space-y-3 max-h-56 overflow-y-auto px-0.5">
        {completedItems.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Added Documents
            </span>
            <div className="rounded-xl border border-border divide-y divide-border/60 bg-card overflow-hidden">
              {completedItems.map((it) => (
                <div key={it.id} className="p-2.5 sm:p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <AppIcon icon={Tick02Icon} size={11} />
                    </span>
                    <span className="font-medium text-foreground truncate">{it.metadata.title || it.file.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono shrink-0 ml-2 capitalize">
                    {it.metadata.space}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partial failures report if any */}
        {failedItems.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-destructive uppercase tracking-wider flex items-center gap-1">
              <AppIcon icon={Alert02Icon} size={13} />
              Needs Attention ({failedItems.length})
            </span>
            <div className="rounded-xl border border-destructive/30 divide-y divide-destructive/20 bg-destructive/[0.03] overflow-hidden">
              {failedItems.map((it) => (
                <div key={it.id} className="p-2.5 sm:p-3 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-medium text-foreground truncate">{it.file.name}</p>
                    <p className="text-[11px] text-destructive truncate">{it.error || 'Upload was interrupted.'}</p>
                  </div>
                  {onRetryFailed && (
                    <button
                      type="button"
                      onClick={() => onRetryFailed(it.id)}
                      className="px-2 py-1 rounded-md text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors shrink-0"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadMore}
          className="w-full sm:w-auto h-9 text-xs font-medium gap-1.5 rounded-xl border-border"
        >
          <AppIcon icon={Upload01Icon} size={14} />
          <span>Upload More</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewDocuments}
          className="w-full sm:w-auto h-9 text-xs font-medium rounded-xl border-border"
        >
          View in Vault
        </Button>

        <Button
          size="sm"
          onClick={onDone}
          className="w-full sm:w-auto h-9 text-xs font-medium px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Done
        </Button>
      </div>
    </div>
  )
}
