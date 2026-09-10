import { Link } from 'react-router-dom'
import {
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import type { SpaceSummary } from '../dashboard.types'
import { AppIcon } from '@/components/icons/app-icon'
import { formatDocumentCount, formatShortDate } from '../dashboard.utils'

interface DashboardSpaceCardProps {
  summary: SpaceSummary
}

export function DashboardSpaceCard({ summary }: DashboardSpaceCardProps) {
  const isGov = summary.space === 'government'
  const to = isGov ? '/app/government' : '/app/student'
  const title = isGov ? 'Government Documents' : 'Student Certificates'
  const actionLabel = isGov ? 'View Government' : 'View Certificates'
  const description = isGov
    ? 'Identity records, licences, insurance, and other official files.'
    : 'Degrees, academic transcripts, marksheets, and certifications.'

  const icon = isGov ? Passport01Icon : Certificate01Icon
  const hasExpiring = Boolean(isGov && summary.expiringCount && summary.expiringCount > 0)

  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-[22px] border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-md active:scale-[0.995] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none min-h-[190px] sm:min-h-[220px] md:min-h-[250px] overflow-hidden`}
    >
      {/* Subtle Micro-Pattern Motif */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05] transition-opacity group-hover:opacity-[0.06] ${
          isGov
            ? 'bg-[radial-gradient(circle_at_top_right,var(--color-foreground)_1px,transparent_1px)] bg-[size:16px_16px]'
            : 'bg-[radial-gradient(ellipse_at_bottom_left,var(--color-foreground)_1px,transparent_1px)] bg-[size:18px_18px]'
        }`}
        aria-hidden="true"
      />

      {/* Top Header Row: Icon + Arrow Action */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 sm:size-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0 transition-transform duration-200 group-hover:scale-105">
            <AppIcon icon={icon} size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              {formatDocumentCount(summary.count)}
            </p>
          </div>
        </div>

        <div className="size-9 rounded-xl border border-border/80 bg-background/80 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all shrink-0">
          <AppIcon
            icon={ArrowRight01Icon}
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      {/* Center Description */}
      <div className="relative z-10 my-4 sm:my-5">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
          {description}
        </p>
      </div>

      {/* Footer Metadata & Action State */}
      <div className="relative z-10 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
        {summary.count === 0 ? (
          <span className="text-muted-foreground/90 font-medium">
            Add your first {isGov ? 'government document' : 'student certificate'}
          </span>
        ) : hasExpiring ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
            <AppIcon icon={Alert02Icon} size={14} />
            <span>
              {summary.expiringCount} {summary.expiringCount === 1 ? 'needs' : 'need'} review soon
            </span>
          </span>
        ) : summary.latestDoc ? (
          <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
            Latest: <span className="text-foreground/90 font-medium">{summary.latestDoc.title}</span>
            {summary.latestDoc.createdAt && (
              <span className="text-muted-foreground/70 ml-1">
                ({formatShortDate(summary.latestDoc.createdAt)})
              </span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {formatDocumentCount(summary.count)} secured
          </span>
        )}

        <span className="font-semibold text-primary text-xs flex items-center gap-1 opacity-90 group-hover:opacity-100 shrink-0">
          <span>{actionLabel}</span>
          <AppIcon icon={ArrowRight01Icon} size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
