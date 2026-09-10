import { Link } from 'react-router-dom'
import { FolderSecurityIcon, Upload01Icon, ShieldCheckIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
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
  govCount?: number
  studentCount?: number
  onUploadClick?: () => void
}

export function StorageOverview({
  governmentBytes,
  studentBytes,
  totalBytes,
  totalCount,
  govCount,
  studentCount,
  onUploadClick,
}: StorageOverviewProps) {
  const hasStorage = totalBytes > 0 && totalCount > 0

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center text-foreground shrink-0">
            <AppIcon icon={FolderSecurityIcon} size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
              Storage
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Vault distribution across spaces
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-semibold text-foreground px-2.5 py-1 rounded-md bg-muted/60 border border-border/60">
          {hasStorage ? `${formatBytes(totalBytes)} stored` : '0 B'}
        </span>
      </div>

      {/* Content: Compact side-by-side composition */}
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
        <div className="pt-2 flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-7">
          {/* Compact Donut */}
          <div className="shrink-0 flex items-center justify-center">
            <StorageDonutChart
              governmentBytes={governmentBytes}
              studentBytes={studentBytes}
              totalBytes={totalBytes}
            />
          </div>

          {/* Breakdown stats on right */}
          <div className="flex-1 w-full flex flex-col justify-center space-y-3">
            <StorageBreakdown
              governmentBytes={governmentBytes}
              studentBytes={studentBytes}
              totalBytes={totalBytes}
              govCount={govCount}
              studentCount={studentCount}
            />
            <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80 pt-0.5">
              <AppIcon icon={ShieldCheckIcon} size={13} className="text-muted-foreground shrink-0" />
              <span>Private vault storage with owner-restricted access.</span>
            </div>
          </div>
        </div>
      )}

      {/* Deep-link to Storage Breakdown observatory */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <Link
          to="/app/storage"
          className="inline-flex items-center gap-1.5 font-medium text-xs text-primary hover:text-primary/80 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
        >
          <span>View storage details</span>
          <AppIcon icon={ArrowRight01Icon} size={14} />
        </Link>
        <span className="text-[11px] text-muted-foreground font-mono">
          {totalCount} {totalCount === 1 ? 'document' : 'documents'}
        </span>
      </div>
    </div>
  )
}
