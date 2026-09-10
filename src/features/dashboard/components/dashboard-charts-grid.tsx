import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  FolderSecurityIcon,
  Passport01Icon,
  Certificate01Icon,
  File01Icon,
  ShieldCheckIcon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'
import type { DashboardSummary } from '../dashboard.types'

interface DashboardChartsGridProps {
  summary: DashboardSummary
}

// Mini theme-aware tooltip for compact cards
function CompactChartTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md px-2.5 py-1.5 shadow-md text-xs z-50">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ backgroundColor: item.payload?.fill || item.color }} />
        <span className="font-medium text-foreground">{item.name}</span>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
        {item.payload?.formattedValue ?? item.value}
      </p>
    </div>
  )
}

export function DashboardChartsGrid({ summary }: DashboardChartsGridProps) {
  const { government, student, totalBytes, totalCount, fileTypes, health } = summary

  // 1. Storage Distribution Data (Gov vs Student Bytes)
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

  // 2. Spaces Balance Data (Gov vs Student Document Counts)
  const spacesData = useMemo(() => {
    return [
      {
        name: 'Government',
        value: government.count,
        formattedValue: `${government.count} ${government.count === 1 ? 'doc' : 'docs'}`,
        color: 'var(--primary)',
      },
      {
        name: 'Student',
        value: student.count,
        formattedValue: `${student.count} ${student.count === 1 ? 'doc' : 'docs'}`,
        color: 'var(--color-chart-2, var(--muted-foreground))',
      },
    ]
  }, [government.count, student.count])

  const govCountPercent = totalCount > 0 ? Math.round((government.count / totalCount) * 100) : 0
  const studentCountPercent = totalCount > 0 ? 100 - govCountPercent : 0

  // 3. File Formats Data
  const formatData = useMemo(() => {
    if (!fileTypes.length) {
      return [{ name: 'None', value: 1, formattedValue: '0 files', color: 'var(--muted)' }]
    }
    return fileTypes.map((f) => ({
      name: f.label,
      value: f.count,
      formattedValue: `${f.count} ${f.count === 1 ? 'file' : 'files'}`,
      color: f.color,
    }))
  }, [fileTypes])

  // 4. Vault Health Data
  const healthData = useMemo(() => {
    if (totalCount === 0) {
      return [{ name: 'Vault Empty', value: 1, formattedValue: '0 docs', color: 'var(--muted)' }]
    }
    return [
      {
        name: 'Valid & Active',
        value: health.validCount,
        formattedValue: `${health.validCount} valid`,
        color: 'var(--primary)',
      },
      {
        name: 'Expiring Soon',
        value: health.expiringCount,
        formattedValue: `${health.expiringCount} expiring`,
        color: 'oklch(0.65 0.18 70)',
      },
      {
        name: 'Expired',
        value: health.expiredCount,
        formattedValue: `${health.expiredCount} expired`,
        color: 'var(--destructive)',
      },
    ].filter((item) => item.value > 0)
  }, [totalCount, health])

  return (
    <section aria-label="Vault Overview Charts" className="space-y-3">
      {/* 4 In a Row on Desktop (lg:grid-cols-4), 2 In a Row on Tablet/Remaining UI (sm:grid-cols-2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* CHART 1: Storage Distribution */}
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
                {totalBytes > 0 && <Tooltip content={<CompactChartTooltip />} />}
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

        {/* CHART 2: Spaces Balance */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={Passport01Icon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">Spaces Ratio</h3>
                <p className="text-[10.5px] text-muted-foreground">Document count</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {totalCount} {totalCount === 1 ? 'doc' : 'docs'}
            </span>
          </div>

          <div className="relative size-28 sm:size-32 my-3 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={totalCount > 0 ? spacesData : [{ name: 'Empty', value: 1, color: 'var(--muted)' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={totalCount > 0 && government.count > 0 && student.count > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {(totalCount > 0 ? spacesData : [{ color: 'var(--muted)' }]).map((entry, index) => (
                    <Cell key={`cell-space-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {totalCount > 0 && <Tooltip content={<CompactChartTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold font-mono text-foreground leading-tight">
                {totalCount}
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/50">
            <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden flex">
              <div style={{ width: `${govCountPercent}%` }} className="bg-primary h-full transition-all" />
              <div style={{ width: `${studentCountPercent}%` }} className="bg-muted-foreground/40 h-full transition-all" />
            </div>
            <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-primary" />
                Gov ({government.count})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                Student ({student.count})
              </span>
            </div>
          </div>
        </div>

        {/* CHART 3: File Formats */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center text-foreground">
                <AppIcon icon={File01Icon} size={14} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">File Formats</h3>
                <p className="text-[10.5px] text-muted-foreground">Type breakdown</p>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
              {fileTypes.length} {fileTypes.length === 1 ? 'type' : 'types'}
            </span>
          </div>

          <div className="relative size-28 sm:size-32 my-3 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={formatData}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={fileTypes.length > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {formatData.map((entry, index) => (
                    <Cell key={`cell-format-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {fileTypes.length > 0 && <Tooltip content={<CompactChartTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-bold font-mono text-foreground leading-tight">
                {fileTypes[0]?.label.split(' ')[0] || 'Files'}
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Top
              </span>
            </div>
          </div>

          <div className="pt-1 border-t border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-muted-foreground">
              {fileTypes.slice(0, 3).map((f) => (
                <span key={f.type} className="flex items-center gap-1 font-medium">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                  {f.label.split(' ')[0]} ({f.count})
                </span>
              ))}
              {fileTypes.length === 0 && (
                <span className="text-[10px] text-muted-foreground">No files uploaded yet</span>
              )}
            </div>
          </div>
        </div>

        {/* CHART 4: Vault Health & Validity */}
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

          <div className="relative size-28 sm:size-32 my-3 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="92%"
                  paddingAngle={healthData.length > 1 ? 3 : 0}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-health-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {totalCount > 0 && <Tooltip content={<CompactChartTooltip />} />}
              </PieChart>
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
            <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden flex">
              <div
                style={{ width: `${health.healthPercentage}%` }}
                className="bg-primary h-full transition-all"
              />
              {health.expiringCount > 0 && (
                <div
                  style={{ width: `${Math.round((health.expiringCount / totalCount) * 100)}%` }}
                  className="bg-amber-500 h-full transition-all"
                />
              )}
              {health.expiredCount > 0 && (
                <div
                  style={{ width: `${Math.round((health.expiredCount / totalCount) * 100)}%` }}
                  className="bg-destructive h-full transition-all"
                />
              )}
            </div>
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
                <span className="text-muted-foreground/70">Up to date</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
