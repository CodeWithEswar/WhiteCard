import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'
import { StorageUsageRing } from './storage-usage-ring'
import type { StorageBreakdown } from '../storage.types'

interface StorageSummaryHeroProps {
  data: StorageBreakdown
}

export function StorageSummaryHero({ data }: StorageSummaryHeroProps) {
  const { totalBytes, totalDocuments, spaces } = data

  const docCountText = useMemo(() => {
    return totalDocuments === 1 ? '1 document' : `${totalDocuments} documents`
  }, [totalDocuments])

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-6 sm:p-8 md:p-10 shadow-xs transition-colors">
      {/* 1. Subtle Localized Grid Fragment in Corner (Section 15 & 16) */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.04] dark:opacity-[0.07] select-none"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(circle at top right, black, transparent 75%)',
        }}
      />

      {/* 2. Soft Atmospheric Radial Glow */}
      <div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none opacity-40 blur-3xl select-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, var(--theme-glow, var(--primary)) 0%, transparent 70%)',
        }}
      />

      {/* Content Container: Asymmetric Grid */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
        {/* Left: Dominant Storage Figures */}
        <div className="space-y-6 flex-1 max-w-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground select-none">
              <span>01</span>
              <span>•</span>
              <span>Vault Storage</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-mono tabular-nums leading-none">
                {formatBytes(totalBytes)}
              </h1>
              <p className="text-sm sm:text-base font-medium text-muted-foreground pt-1">
                Stored across your White Card vault
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/60 text-xs font-mono text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary/80" />
              <span>{docCountText}</span>
            </div>
          </div>

          {/* Quick Space Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
            {/* Government Space Quick Stat */}
            <Link
              to="/app/government"
              className="group p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-muted/70 border border-border/80 text-foreground flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                  <AppIcon icon={Passport01Icon} size={15} />
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-semibold text-foreground truncate">
                    Government
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {spaces.government.count} docs • {spaces.government.percentage}%
                  </div>
                </div>
              </div>
              <div className="text-right pl-2 shrink-0">
                <div className="text-xs font-mono font-bold text-foreground">
                  {formatBytes(spaces.government.bytes)}
                </div>
                <AppIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  className="text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all ml-auto"
                />
              </div>
            </Link>

            {/* Student Space Quick Stat */}
            <Link
              to="/app/student"
              className="group p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-lg bg-muted/70 border border-border/80 text-foreground flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                  <AppIcon icon={Certificate01Icon} size={15} />
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-semibold text-foreground truncate">
                    Student
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {spaces.student.count} certs • {spaces.student.percentage}%
                  </div>
                </div>
              </div>
              <div className="text-right pl-2 shrink-0">
                <div className="text-xs font-mono font-bold text-foreground">
                  {formatBytes(spaces.student.bytes)}
                </div>
                <AppIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  className="text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all ml-auto"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Radial Donut Visual */}
        <div className="w-full md:w-auto flex items-center justify-center">
          <StorageUsageRing totalBytes={totalBytes} spaces={spaces} />
        </div>
      </div>
    </div>
  )
}
