import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { useChartTheme } from '@/lib/charts/use-chart-theme'
import { StorageChartTooltip } from './storage-chart-tooltip'
import type { StorageFileTypeItem } from '../storage.types'

interface StorageFileTypeChartProps {
  fileTypes: StorageFileTypeItem[]
  totalBytes: number
}

export function StorageFileTypeChart({ fileTypes, totalBytes }: StorageFileTypeChartProps) {
  const chartColors = useChartTheme()
  const prefersReducedMotion = useReducedMotion()

  const chartData = useMemo(() => {
    return fileTypes.map((ft) => ({
      name: ft.label,
      value: ft.bytes,
      percentage: ft.percentage,
      count: ft.count,
      key: ft.key,
      color: chartColors.primary,
    }))
  }, [fileTypes, chartColors])

  if (!fileTypes.length) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
        No file types detected.
      </div>
    )
  }

  // Calculate dynamic height based on number of items (40px per bar)
  const chartHeight = Math.max(160, Math.min(280, chartData.length * 44))

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 15, bottom: 5, left: 0 }}
          barCategoryGap={10}
        >
          <XAxis type="number" hide domain={[0, 'dataMax']} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{
              fill: 'var(--muted-foreground)',
              fontSize: 11,
              fontWeight: 500,
            }}
          />
          <Tooltip
            content={<StorageChartTooltip totalBytes={totalBytes} />}
            cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
          />
          <Bar
            dataKey="value"
            fill={chartColors.primary}
            radius={[0, 6, 6, 0]}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={500}
            background={{ fill: 'var(--muted)', radius: 6, opacity: 0.25 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
