import { FolderSecurityIcon, Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { StorageDonutChart } from './storage-donut-chart'
import { StorageBreakdown } from './storage-breakdown'
import { formatBytes } from '@/lib/files/format-bytes'

interface StorageOverviewProps {
  governmentBytes: number
  studentBytes: number
  totalBytes: number
  totalCount: number
  onUploadClick?: () => void
}

export function StorageOverview({
  governmentBytes,
  studentBytes,
  totalBytes,
  totalCount,
  onUploadClick,
}: StorageOverviewProps) {
  const hasStorage = totalBytes > 0 && totalCount > 0

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-muted/50 border border-border/80 flex items-center justify-center text-foreground">
            <AppIcon icon={FolderSecurityIcon} size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
            Storage
          </h2>
        </div>
        <span className="font-mono text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
          {hasStorage ? `${formatBytes(totalBytes)} stored` : '0 B'}
        </span>
      </div>

      {/* Content: Donut + Breakdown OR Zero-Storage state */}
      {!hasStorage ? (
        <div className="py-6 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center flex flex-col items-center justify-center space-y-2.5">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            No storage used yet
          </p>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Upload your first document to begin building your White Card.
          </p>
          {onUploadClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              className="gap-2 text-xs font-medium h-8 rounded-lg border-border mt-1"
            >
              <AppIcon icon={Upload01Icon} size={13} />
              <span>Upload Document</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <StorageDonutChart
            governmentBytes={governmentBytes}
            studentBytes={studentBytes}
            totalBytes={totalBytes}
          />
          <StorageBreakdown
            governmentBytes={governmentBytes}
            studentBytes={studentBytes}
            totalBytes={totalBytes}
          />
        </div>
      )}
    </div>
  )
}
