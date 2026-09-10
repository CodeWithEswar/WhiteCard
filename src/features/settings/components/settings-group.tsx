import type { ReactNode } from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { AppIcon } from '../../../components/icons/app-icon'

interface SettingItem {
  id: string
  title: string
  description?: string
  icon?: IconSvgElement
  action?: ReactNode
  onClick?: () => void
  destructive?: boolean
}

interface SettingsGroupProps {
  title?: string
  description?: string
  items: SettingItem[]
  className?: string
}

export function SettingsGroup({
  title,
  description,
  items,
  className = '',
}: SettingsGroupProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {(title || description) && (
        <div className="px-1 space-y-0.5">
          {title && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground/80">{description}</p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-xs">
        {items.map((item) => {
          const isClickable = Boolean(item.onClick)

          return (
            <div
              key={item.id}
              onClick={item.onClick}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              className={`flex items-center justify-between p-4 px-5 gap-4 transition-colors ${isClickable
                ? 'hover:bg-surface-muted/60 cursor-pointer select-none'
                : ''
                } ${item.destructive ? 'text-destructive' : ''}`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {item.icon && (
                  <div className="size-9 rounded-xl border border-border bg-surface-muted/80 flex items-center justify-center shrink-0">
                    <AppIcon icon={item.icon} size={18} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {item.action && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  {item.action}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
