import { Link } from 'react-router-dom'
import type { IconSvgElement } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'

interface StorageSpaceRowProps {
  label: string
  count: number
  bytes: number
  percentage: number
  icon: IconSvgElement
  colorClass: string
  meterColor: string
  href: string
}

export function StorageSpaceRow({
  label,
  count,
  bytes,
  percentage,
  icon,
  colorClass,
  meterColor,
  href,
}: StorageSpaceRowProps) {
  const countLabel = count === 1 ? '1 document' : `${count} documents`

  return (
    <Link
      to={href}
      className="group block p-4 rounded-xl border border-border/70 bg-muted/10 hover:bg-muted/30 hover:border-border transition-all space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            <AppIcon icon={icon} size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {label}
            </h4>
            <span className="text-[11px] font-mono text-muted-foreground">
              {countLabel}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-mono font-bold text-foreground">
            {formatBytes(bytes)}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-end gap-1">
            <span>{percentage}%</span>
            <AppIcon
              icon={ArrowRight01Icon}
              size={11}
              className="text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Thin Proportional Progress Meter (Section 17) */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(percentage > 0 ? 3 : 0, percentage)}%`,
            backgroundColor: meterColor,
          }}
        />
      </div>
    </Link>
  )
}
