import { useState, useEffect } from 'react'
import { useTheme } from '@/providers/theme-provider'

export interface ChartThemeColors {
  primary: string
  secondary: string
  government: string
  governmentMuted: string
  student: string
  studentMuted: string
  muted: string
  border: string
  popover: string
  popoverForeground: string
  track: string
  grid: string
}

function getComputedCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return val || fallback
}

/**
 * Hook that extracts resolved CSS color tokens for Recharts SVGs.
 * Subscribes to theme preset and appearance changes to trigger re-renders.
 */
export function useChartTheme(): ChartThemeColors {
  const { theme, appearance, isDark } = useTheme()
  const [colors, setColors] = useState<ChartThemeColors>(() => ({
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    government: 'var(--space-government)',
    governmentMuted: 'var(--space-government-muted)',
    student: 'var(--space-student)',
    studentMuted: 'var(--space-student-muted)',
    muted: 'var(--muted-foreground)',
    border: 'var(--border)',
    popover: 'var(--popover)',
    popoverForeground: 'var(--popover-foreground)',
    track: 'var(--muted)',
    grid: 'var(--border)',
  }))

  useEffect(() => {
    // Re-resolve colors on theme or appearance update
    const resolved: ChartThemeColors = {
      primary: getComputedCssVar('--primary', 'currentColor'),
      secondary: getComputedCssVar('--secondary', 'currentColor'),
      government: getComputedCssVar('--space-government', '#3b82f6'),
      governmentMuted: getComputedCssVar('--space-government-muted', 'rgba(59, 130, 246, 0.12)'),
      student: getComputedCssVar('--space-student', '#8b5cf6'),
      studentMuted: getComputedCssVar('--space-student-muted', 'rgba(139, 92, 246, 0.12)'),
      muted: getComputedCssVar('--muted-foreground', '#71717a'),
      border: getComputedCssVar('--border', '#27272a'),
      popover: getComputedCssVar('--popover', '#18181b'),
      popoverForeground: getComputedCssVar('--popover-foreground', '#f4f4f5'),
      track: getComputedCssVar('--muted', '#27272a'),
      grid: getComputedCssVar('--border', '#27272a'),
    }
    setColors(resolved)
  }, [theme, appearance, isDark])

  return colors
}
