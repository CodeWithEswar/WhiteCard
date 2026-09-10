import React from 'react'
import { ThemePreviewCard } from './theme-preview-card'
import { useTheme } from '@/providers/theme-provider'
import type { ThemeId } from '@/types/theme'
import { cn } from 'cn'

interface ThemePreviewGridProps {
  compact?: boolean
  columns?: 2 | 3 | 5
  className?: string
  onThemeSelect?: (themeId: ThemeId) => void
}

export function ThemePreviewGrid({
  compact = false,
  columns,
  className,
  onThemeSelect,
}: ThemePreviewGridProps) {
  const { theme: currentTheme, setTheme, isDark, allThemes } = useTheme()

  const handleSelect = (themeId: ThemeId) => {
    setTheme(themeId)
    onThemeSelect?.(themeId)
  }

  const gridColsClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : compact
      ? 'grid-cols-2'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={cn('grid gap-2', gridColsClass, className)}
    >
      {allThemes.map((preset) => (
        <ThemePreviewCard
          key={preset.id}
          theme={preset}
          isSelected={currentTheme === preset.id}
          isDark={isDark}
          onSelect={() => handleSelect(preset.id)}
        />
      ))}
    </div>
  )
}
