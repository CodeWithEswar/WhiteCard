import { formatBytes } from '@/lib/files/format-bytes'

export interface StorageChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      percentage?: number
      count?: number
      color?: string
      space?: string
      [key: string]: any
    }
  }>
  totalBytes?: number
}

export function StorageChartTooltip({ active, payload, totalBytes = 0 }: StorageChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const item = payload[0]
  const data = item.payload
  const bytes = Number(item.value || data.value || 0)
  const percentage = data.percentage ?? (totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0)

  return (
    <div className="rounded-xl border border-border/90 bg-popover/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl text-xs z-50 min-w-36 space-y-1">
      <div className="flex items-center gap-2">
        {data.color && (
          <span
            className="size-2 rounded-full shrink-0 ring-1 ring-border/50"
            style={{ backgroundColor: data.color }}
          />
        )}
        <span className="font-semibold text-foreground tracking-tight">{data.name || item.name}</span>
      </div>

      <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] text-muted-foreground pt-0.5">
        <span className="font-bold text-foreground">{formatBytes(bytes)}</span>
        <span>{percentage}% of storage</span>
      </div>

      {typeof data.count === 'number' && (
        <div className="text-[10.5px] text-muted-foreground border-t border-border/40 pt-1 mt-1">
          {data.count} {data.count === 1 ? 'document' : 'documents'}
        </div>
      )}
    </div>
  )
}
