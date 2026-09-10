import { ShieldCheckIcon, FolderSecurityIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

interface StorageSummaryProps {
  totalStorageFormatted: string
  govCount: number
  studentCount: number
  totalCount: number
}

export function StorageSummary({
  totalStorageFormatted,
  govCount,
  studentCount,
  totalCount,
}: StorageSummaryProps) {
  const govPercent = totalCount > 0 ? Math.round((govCount / totalCount) * 100) : 0
  const studentPercent = totalCount > 0 ? 100 - govPercent : 0

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-border/80 bg-surface space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppIcon icon={FolderSecurityIcon} size={18} className="text-foreground" />
          <h4 className="text-sm font-semibold text-foreground tracking-tight">
            Vault Storage
          </h4>
        </div>
        <span className="font-mono text-xs font-semibold text-foreground">
          {totalStorageFormatted}
        </span>
      </div>

      {/* Clean segmented bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden flex">
          <div
            style={{ width: `${govPercent}%` }}
            className="bg-primary h-full transition-all duration-300"
            title={`Government: ${govPercent}%`}
          />
          <div
            style={{ width: `${studentPercent}%` }}
            className="bg-muted-foreground/40 h-full transition-all duration-300"
            title={`Student: ${studentPercent}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Government ({govCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/40" />
            Student ({studentCount})
          </span>
        </div>
      </div>

      {/* Security reassurance banner */}
      <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground">
        <AppIcon icon={ShieldCheckIcon} size={14} className="text-foreground shrink-0" />
        <span>Private storage with owner-restricted access.</span>
      </div>
    </div>
  )
}
