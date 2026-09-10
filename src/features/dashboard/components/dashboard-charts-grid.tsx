import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import {
  FolderSecurityIcon,
  Clock01Icon,
  File01Icon,
  ShieldCheckIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'
import type { DashboardSummary } from '../dashboard.types'

interface DashboardChartsGridProps {
  summary: DashboardSummary
}

// 1. Tooltip for Storage Donut
function StorageTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md px-2.5 py-1.5 shadow-md text-xs z-50">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: item.payload?.color || item.color }} />
        <span className="font-medium text-foreground">{item.name}</span>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
        {item.payload?.formattedValue}
      </p>
    </div>
  )
}

// 2. Tooltip for Area Activity Chart
function AreaTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md px-2.5 py-1.5 shadow-md text-xs z-50">
      <p className="font-semibold text-foreground">{item.payload?.fullMonth || item.payload?.month}</p>
      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
        {item.value} {item.value === 1 ? 'upload' : 'uploads'}
      </p>
    </div>
  )
}

// 3. Tooltip for Dotted Line Formats Chart
function LineTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md px-2.5 py-1.5 shadow-md text-xs z-50">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary" />
        <span className="font-medium text-foreground">{item.payload?.fullName || item.payload?.name}</span>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
        {item.value} {item.value === 1 ? 'document' : 'documents'}
      </p>
    </div>
  )
}

export function DashboardChartsGrid({ summary }: DashboardChartsGridProps) {
  const { government, student, totalBytes, totalCount, fileTypes, health, timeline } = summary

  // 1. STORAGE DATA (Donut Chart)
  const storageData = useMemo(() => {
    return [
      {
        name: 'Government',
        value: government.bytes,
        formattedValue: formatBytes(government.bytes),
        color: 'var(--primary)',
      },
      {
        name: 'Student',
        value: student.bytes,
        formattedValue: formatBytes(student.bytes),
        color: 'var(--color-chart-2, var(--muted-foreground))',
      },
    ]
  }, [government.bytes, student.bytes])

  const govStoragePercent = totalBytes > 0 ? Math.round((government.bytes / totalBytes) * 100) : 0
  const studentStoragePercent = totalBytes > 0 ? 100 - govStoragePercent : 0

  // 2. TIMELINE DATA (Smooth Gradient Area Chart)
  const timelineData = useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return [
        { month: 'Apr', count: 0 },
        { month: 'May', count: 0 },
        { month: 'Jun', count: 0 },
        { month: 'Jul', count: 0 },
        { month: 'Aug', count: 0 },
        { month: 'Sep', count: totalCount },
      ]
    }
    return timeline
  }, [timeline, totalCount])

  // 3. FILE FORMATS DATA (Dotted Line Chart)
  const formatLineData = useMemo(() => {
    // Standard formats mapping for clean axis
    const defaultCategories = [
      { key: 'pdf', name: 'PDF', fullName: 'PDF Documents' },
      { key: 'image', name: 'IMG', fullName: 'Image Files' },
      { key: 'doc', name: 'DOC', fullName: 'Office Documents' },
      { key: 'zip', name: 'ZIP', fullName: 'Archive Bundles' },
      { key: 'sheet', name: 'SHT', fullName: 'Spreadsheets' },
    ]

    return defaultCategories.map((cat) => {
      const match = fileTypes.find((f) => f.type === cat.key)
      return {
        name: cat.name,
        fullName: cat.fullName,
        count: match ? match.count : 0,
      }
    })
  }, [fileTypes])

  // 4. VAULT HEALTH DATA (Radial Bar Chart)
  const radialHealthData = useMemo(() => {
    return [
      {
        name: 'Valid',
        value: health.healthPercentage,
        fill: 'var(--primary)',
      },
      {
        name: 'Expiring Soon',
        value: totalCount > 0 ? Math.round((health.expiringCount / totalCount) * 100) : 0,
        fill: 'oklch(0.65 0.18 70)',
      },
      {
        name: 'Expired',
        value: totalCount > 0 ? Math.round((health.expiredCount / totalCount) * 100) : 0,
        fill: 'var(--destructive)',
      },
    ]
  }, [health, totalCount])

  return (
    <section aria-label="Vault Analytics Overview" className="space-y-3">
      {/* Responsive Grid: 4 in a row on desktop (lg:grid-cols-4), 2 in a row on tablet (sm:grid-cols-2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* =========================================================
            CHART 1: DONUT CHART — Vault Storage (Bytes Distribution)
           ========================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={FolderSecurityIcon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">Vault Storage</h3>
                <p className="text-[10.5px] text-muted-foreground">Bytes distribution</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {formatBytes(totalBytes)}
            </span>
          </div>

          <div className="relative size-28 sm:size-32 my-3 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={totalBytes > 0 ? storageData : [{ name: 'Empty', value: 1, color: 'var(--muted)' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={totalBytes > 0 && government.bytes > 0 && student.bytes > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {(totalBytes > 0 ? storageData : [{ color: 'var(--muted)' }]).map((entry, index) => (
                    <Cell key={`cell-storage-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {totalBytes > 0 && <Tooltip content={<StorageTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold font-mono text-foreground leading-tight">
                {formatBytes(totalBytes)}
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Used
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/50">
            <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden flex">
              <div style={{ width: `${govStoragePercent}%` }} className="bg-primary h-full transition-all" />
              <div style={{ width: `${studentStoragePercent}%` }} className="bg-muted-foreground/40 h-full transition-all" />
            </div>
            <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-primary" />
                Gov {govStoragePercent}%
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                Student {studentStoragePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CHART 2: AREA CHART — Vault Activity (Upload Timeline)
           ========================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={Clock01Icon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">Vault Activity</h3>
                <p className="text-[10.5px] text-muted-foreground">Upload growth timeline</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {totalCount} {totalCount === 1 ? 'total' : 'totals'}
            </span>
          </div>

          {/* Smooth Gradient Area Chart */}
          <div className="h-28 sm:h-32 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaActivityGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#areaActivityGlow)"
                  activeDot={{ r: 4, stroke: 'var(--primary)', fill: 'var(--card)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-1 border-t border-border/50 flex items-center justify-between text-[10.5px] text-muted-foreground">
            <span>Recent additions</span>
            <span className="font-mono font-medium text-foreground">
              +{timelineData[timelineData.length - 1]?.count || 0} this month
            </span>
          </div>
        </div>

        {/* =========================================================
            CHART 3: DOTTED LINE CHART — File Formats Distribution
           ========================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={File01Icon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">File Formats</h3>
                <p className="text-[10.5px] text-muted-foreground">Type distribution</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {fileTypes.length} {fileTypes.length === 1 ? 'type' : 'types'}
            </span>
          </div>

          {/* Dotted Line Chart with Precision Markers */}
          <div className="h-28 sm:h-32 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatLineData} margin={{ top: 8, right: 10, left: 10, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<LineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3.5, stroke: 'var(--primary)', fill: 'var(--card)', strokeWidth: 2 }}
                  activeDot={{ r: 5, stroke: 'var(--primary)', fill: 'var(--primary)', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-1 border-t border-border/50 flex items-center justify-between text-[10.5px] text-muted-foreground">
            <span>Primary format</span>
            <span className="font-medium text-foreground">
              {fileTypes[0]?.label || 'Standard files'}
            </span>
          </div>
        </div>

        {/* =========================================================
            CHART 4: RADIAL BAR CHART — Vault Health & Validity
           ========================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={ShieldCheckIcon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">Vault Health</h3>
                <p className="text-[10.5px] text-muted-foreground">Validity & status</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {health.healthPercentage}% Valid
            </span>
          </div>

          {/* Radial Bar Chart */}
          <div className="relative size-28 sm:size-32 my-3 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="95%"
                barSize={6}
                data={radialHealthData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'var(--muted)', opacity: 0.4 }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold font-mono text-foreground leading-tight">
                {health.healthPercentage}%
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Health
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/50">
            <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-primary" />
                Valid ({health.validCount})
              </span>
              {health.expiringCount > 0 ? (
                <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Expiring ({health.expiringCount})
                </span>
              ) : (
                <span className="text-muted-foreground/80">All records active</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
