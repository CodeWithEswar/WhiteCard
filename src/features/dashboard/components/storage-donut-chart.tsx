import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatBytes } from '@/lib/files/format-bytes'

interface StorageDonutChartProps {
  governmentBytes: number
  studentBytes: number
  totalBytes: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      space: string
      color: string
    }
  }>
  totalBytes: number
}

function StorageChartTooltip({ active, payload, totalBytes }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0]
  const bytes = Number(data.value || 0)
  const percent = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0

  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md px-3 py-2 shadow-lg text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="size-2 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-semibold text-foreground">{data.name}</span>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {formatBytes(bytes)}{' '}
        <span className="text-foreground/80 font-sans font-medium">• {percent}%</span>
      </p>
    </div>
  )
}

export function StorageDonutChart({
  governmentBytes,
  studentBytes,
  totalBytes,
}: StorageDonutChartProps) {
  const chartData = useMemo(() => {
    return [
      {
        name: 'Government',
        value: governmentBytes,
        space: 'government',
        color: 'var(--primary)',
      },
      {
        name: 'Student',
        value: studentBytes,
        space: 'student',
        color: 'var(--color-chart-2, var(--muted-foreground))',
      },
    ]
  }, [governmentBytes, studentBytes])

  const formattedTotal = useMemo(() => formatBytes(totalBytes), [totalBytes])

  return (
    <div className="relative w-full h-52 sm:h-56 md:h-60 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="88%"
            paddingAngle={totalBytes > 0 && governmentBytes > 0 && studentBytes > 0 ? 3 : 0}
            dataKey="value"
            stroke="var(--card)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={500}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="transition-colors duration-200"
              />
            ))}
          </Pie>
          <Tooltip
            content={<StorageChartTooltip totalBytes={totalBytes} />}
            cursor={{ fill: 'transparent' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label inside Donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-sm sm:text-base font-bold tracking-tight text-foreground font-mono">
          {formattedTotal}
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Used
        </span>
      </div>
    </div>
  )
}
