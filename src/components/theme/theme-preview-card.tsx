import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import type { ThemeConfig } from '@/types/theme'
import { cn } from 'cn'

interface ThemePreviewCardProps {
  theme: ThemeConfig
  isSelected: boolean
  isDark: boolean
  onSelect: () => void
  className?: string
}

export function ThemePreviewCard({
  theme,
  isSelected,
  isDark,
  onSelect,
  className,
}: ThemePreviewCardProps) {
  const reduceMotion = useReducedMotion()
  const activePalette = isDark ? theme.dark : theme.light

  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      aria-label={`Select ${theme.label} theme`}
      className={cn(
        'relative group flex flex-col items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all duration-150 outline-hidden select-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        isSelected
          ? 'border-primary/80 bg-muted/40 shadow-2xs'
          : 'border-border/70 hover:border-border hover:bg-muted/20',
        className
      )}
    >
      {/* Selected Indicator Outline via layoutId */}
      {isSelected && (
        <motion.div
          layoutId={reduceMotion ? undefined : 'theme-selected'}
          className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none -z-10"
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Miniature Architectural Surface Preview */}
      <div
        className="w-full h-11 rounded-md p-1 flex flex-col justify-between border shadow-2xs relative overflow-hidden transition-transform duration-150 group-hover:scale-[1.02]"
        style={{
          backgroundColor: activePalette.surfaceMuted,
          borderColor: activePalette.border,
        }}
      >
        {/* Top Header / Accent Dot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: activePalette.primary }}
            />
            <span
              className="h-1 w-5 rounded-xs opacity-40"
              style={{ backgroundColor: activePalette.primaryForeground }}
            />
          </div>
          {isSelected && (
            <span
              className="size-3.5 rounded-full flex items-center justify-center text-[9px] shadow-2xs"
              style={{
                backgroundColor: activePalette.primary,
                color: activePalette.primaryForeground,
              }}
            >
              <AppIcon icon={CheckmarkBadge01Icon} size={9} />
            </span>
          )}
        </div>

        {/* Inner Mini Card */}
        <div
          className="w-full h-4 rounded-xs p-0.5 flex items-center border"
          style={{
            backgroundColor: activePalette.surface,
            borderColor: activePalette.border,
          }}
        >
          <span
            className="h-1 w-3/4 rounded-xs opacity-60"
            style={{ backgroundColor: activePalette.primary }}
          />
        </div>
      </div>

      {/* Theme Label */}
      <span
        className={cn(
          'text-[11px] font-medium tracking-tight truncate w-full text-center',
          isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'
        )}
      >
        {theme.label}
      </span>
    </button>
  )
}
