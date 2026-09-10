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
    // Re-resolve colors on theme or appearance update (Monochrome palette)
    const resolved: ChartThemeColors = {
      primary: getComputedCssVar('--foreground', isDark ? '#fafafa' : '#09090b'),
      secondary: getComputedCssVar('--muted-foreground', isDark ? '#a1a1aa' : '#71717a'),
      government: getComputedCssVar('--foreground', isDark ? '#fafafa' : '#09090b'),
      governmentMuted: getComputedCssVar('--muted', isDark ? '#27272a' : '#f4f4f5'),
      student: getComputedCssVar('--muted-foreground', isDark ? '#a1a1aa' : '#71717a'),
      studentMuted: getComputedCssVar('--muted', isDark ? '#27272a' : '#f4f4f5'),
      muted: getComputedCssVar('--muted-foreground', isDark ? '#a1a1aa' : '#71717a'),
      border: getComputedCssVar('--border', isDark ? '#27272a' : '#e4e4e7'),
      popover: getComputedCssVar('--popover', isDark ? '#18181b' : '#ffffff'),
      popoverForeground: getComputedCssVar('--popover-foreground', isDark ? '#fafafa' : '#09090b'),
      track: getComputedCssVar('--muted', isDark ? '#27272a' : '#f4f4f5'),
      grid: getComputedCssVar('--border', isDark ? '#27272a' : '#e4e4e7'),
    }
    setColors(resolved)
  }, [theme, appearance, isDark])

  return colors
}
