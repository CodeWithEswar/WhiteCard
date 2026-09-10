import { formatBytes } from '@/lib/files/format-bytes'

interface StorageBreakdownProps {
  governmentBytes: number
  studentBytes: number
  totalBytes: number
  govCount?: number
  studentCount?: number
}

export function StorageBreakdown({
  governmentBytes,
  studentBytes,
  totalBytes,
  govCount,
  studentCount,
}: StorageBreakdownProps) {
  const govPercent = totalBytes > 0 ? Math.round((governmentBytes / totalBytes) * 100) : 0
  const studentPercent = totalBytes > 0 ? 100 - govPercent : 0

  return (
    <div className="space-y-3.5 w-full" aria-label="Storage Distribution Breakdown">
      {/* Sleek Segmented Proportion Bar */}
      <div className="space-y-1.5">
        <div
          className="h-2 w-full rounded-full bg-muted/80 overflow-hidden flex"
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
            className="bg-muted-foreground/40 h-full transition-all duration-300"
            title={`Student: ${studentPercent}%`}
          />
        </div>
      </div>

      {/* Accessible Space Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
          <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
              <span>Government</span>
            </span>
            {govCount !== undefined && (
              <span className="font-mono text-[10px] text-muted-foreground/80">
                {govCount} {govCount === 1 ? 'doc' : 'docs'}
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono font-semibold text-foreground text-xs">
              {formatBytes(governmentBytes)}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground font-medium">
              {govPercent}%
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
          <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-muted-foreground/45 shrink-0" aria-hidden="true" />
              <span>Student</span>
            </span>
            {studentCount !== undefined && (
              <span className="font-mono text-[10px] text-muted-foreground/80">
                {studentCount} {studentCount === 1 ? 'doc' : 'docs'}
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono font-semibold text-foreground text-xs">
              {formatBytes(studentBytes)}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground font-medium">
              {studentPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
