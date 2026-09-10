import { formatBytes } from '@/lib/files/format-bytes'

interface StorageBreakdownProps {
  governmentBytes: number
  studentBytes: number
  totalBytes: number
}

export function StorageBreakdown({
  governmentBytes,
  studentBytes,
  totalBytes,
}: StorageBreakdownProps) {
  const govPercent = totalBytes > 0 ? Math.round((governmentBytes / totalBytes) * 100) : 0
  const studentPercent = totalBytes > 0 ? 100 - govPercent : 0

  return (
    <div className="space-y-3 pt-2" aria-label="Storage Distribution Breakdown">
      {/* Visual Segmented Bar */}
      <div
        className="h-2 w-full rounded-full bg-muted overflow-hidden flex"
        role="progressbar"
        aria-valuenow={govPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Storage distribution: Government ${govPercent}%, Student ${studentPercent}%`}
      >
        <div
          style={{ width: `${govPercent}%` }}
          className="bg-primary h-full transition-all duration-300"
          title={`Government: ${govPercent}%`}
        />
        <div
          style={{ width: `${studentPercent}%` }}
          className="bg-muted-foreground/45 h-full transition-all duration-300"
          title={`Student: ${studentPercent}%`}
        />
      </div>

      {/* Accessible Textual Summary Table/Rows */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-2.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
            <span className="size-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
            <span className="truncate">Government</span>
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono font-semibold text-foreground text-xs">
              {formatBytes(governmentBytes)}
            </span>
            <span className="text-[10.5px] font-mono text-muted-foreground">
              {govPercent}%
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
            <span className="size-2 rounded-full bg-muted-foreground/45 shrink-0" aria-hidden="true" />
            <span className="truncate">Student</span>
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono font-semibold text-foreground text-xs">
              {formatBytes(studentBytes)}
            </span>
            <span className="text-[10.5px] font-mono text-muted-foreground">
              {studentPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
