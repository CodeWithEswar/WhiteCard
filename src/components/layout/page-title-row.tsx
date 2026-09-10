import React from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { AppIcon } from '../icons/app-icon'
import { cn } from 'cn'

export interface PageTitleRowProps {
  eyebrow?: string
  title: string
  icon?: IconSvgElement
  actions?: React.ReactNode
  className?: string
}

export function PageTitleRow({
  eyebrow,
  title,
  icon,
  actions,
  className,
}: PageTitleRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4',
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        {eyebrow && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground select-none">
            {icon && <AppIcon icon={icon} size={13} className="text-muted-foreground shrink-0" />}
            <span>{eyebrow}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 min-w-0">
          {!eyebrow && icon && (
            <AppIcon icon={icon} size={22} className="text-foreground shrink-0" />
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
            {title}
          </h1>
        </div>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
