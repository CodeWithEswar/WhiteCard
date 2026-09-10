import React from 'react'
import { ComputerIcon, Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { useTheme } from '@/providers/theme-provider'
import type { AppearanceMode } from '@/types/theme'
import { cn } from 'cn'

interface AppearanceSwitcherProps {
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md'
}

export function AppearanceSwitcher({
  className,
  showLabels = true,
  size = 'md',
}: AppearanceSwitcherProps) {
  const { appearance, setAppearance } = useTheme()

  const options: { id: AppearanceMode; label: string; icon: typeof ComputerIcon }[] = [
    { id: 'system', label: 'System', icon: ComputerIcon },
    { id: 'light', label: 'Light', icon: Sun01Icon },
    { id: 'dark', label: 'Dark', icon: Moon02Icon },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Appearance mode selection"
      className={cn(
        'inline-flex items-center p-1 rounded-lg bg-muted/50 border border-border/70 select-none w-full justify-between',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = appearance === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setAppearance(opt.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              size === 'sm' ? 'h-7 px-2 text-[11px]' : 'h-8 px-2.5 text-xs',
              isSelected
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            <AppIcon icon={opt.icon} size={size === 'sm' ? 13 : 15} />
            {showLabels && <span>{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
