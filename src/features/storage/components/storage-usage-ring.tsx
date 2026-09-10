import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { formatBytes } from '@/lib/files/format-bytes'
import { useChartTheme } from '@/lib/charts/use-chart-theme'
import { StorageChartTooltip } from './storage-chart-tooltip'
import type { StorageSpaceBreakdown } from '../storage.types'

interface StorageUsageRingProps {
  totalBytes: number
  spaces: {
    government: StorageSpaceBreakdown
    student: StorageSpaceBreakdown
  }
}

export function StorageUsageRing({ totalBytes, spaces }: StorageUsageRingProps) {
  const chartColors = useChartTheme()
  const prefersReducedMotion = useReducedMotion()

  const chartData = useMemo(() => {
    const list: Array<{
      name: string
      value: number
      percentage: number
      count: number
      space: 'government' | 'student'
      color: string
    }> = []

    if (spaces.government.bytes > 0) {
      list.push({
        name: 'Government Documents',
        value: spaces.government.bytes,
        percentage: spaces.government.percentage,
        count: spaces.government.count,
        space: 'government',
        color: chartColors.government,
      })
    }

    if (spaces.student.bytes > 0) {
      list.push({
        name: 'Student Certificates',
        value: spaces.student.bytes,
        percentage: spaces.student.percentage,
        count: spaces.student.count,
        space: 'student',
        color: chartColors.student,
      })
    }

    return list
  }, [spaces, chartColors])

  const formattedTotal = useMemo(() => formatBytes(totalBytes), [totalBytes])

  // Generate 12 subtle decorative outer calibration ticks
  const calibrationTicks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 360) / 12
      return { angle, key: i }
    })
  }, [])

  return (
    <div className="relative size-44 sm:size-52 md:size-56 shrink-0 flex items-center justify-center select-none">
      {/* Decorative Outer Calibration Ring (Section 94) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2 6"
            className="opacity-40"
          />
          {calibrationTicks.map(({ angle, key }) => (
            <line
              key={key}
              x1="100"
              y1="4"
              x2="100"
              y2="10"
              stroke="var(--muted-foreground)"
              strokeWidth={key % 3 === 0 ? '1.5' : '1'}
              strokeLinecap="round"
              className={key % 3 === 0 ? 'opacity-50' : 'opacity-25'}
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Recharts Donut Ring */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {totalBytes > 0 ? (
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="88%"
              paddingAngle={chartData.length > 1 ? 4 : 0}
              dataKey="value"
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-colors duration-200"
                />
              ))}
            </Pie>
          ) : (
            <Pie
              data={[{ name: 'Empty', value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="88%"
              dataKey="value"
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              <Cell fill="var(--muted)" className="opacity-30" />
            </Pie>
          )}

          {totalBytes > 0 && (
            <Tooltip
              content={<StorageChartTooltip totalBytes={totalBytes} />}
              cursor={{ fill: 'transparent' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label: Stored Figure */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground font-mono leading-none">
          {formattedTotal}
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
          Stored
        </span>
      </div>
    </div>
  )
}
