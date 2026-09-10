import React from 'react'
import { AppearanceSwitcher } from './appearance-switcher'
import { ThemePreviewGrid } from './theme-preview-grid'
import { cn } from 'cn'

interface ThemeSwitcherProps {
  className?: string
  showAppearance?: boolean
  compact?: boolean
}

export function ThemeSwitcher({
  className,
  showAppearance = true,
  compact = false,
}: ThemeSwitcherProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showAppearance && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground select-none">
            Appearance
          </div>
          <AppearanceSwitcher size={compact ? 'sm' : 'md'} />
        </div>
      )}

      <div className="space-y-1.5">
        <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground select-none">
          Theme Preset
        </div>
        <ThemePreviewGrid compact={compact} />
      </div>
    </div>
  )
}
