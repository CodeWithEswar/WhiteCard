export type ThemeId =
  | 'zinc'
  | 'graphite'
  | 'slate'
  | 'stone'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'

export type AppearanceMode = 'system' | 'light' | 'dark'

export interface ThemeColors {
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  ring: string
  gridLine: string
  patternOpacity: string
  surface?: string
  surfaceMuted?: string
  surfaceElevated?: string
  border?: string
  borderStrong?: string
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  description: string
  previewColor: string
  accentBadge: string
  light: ThemeColors
  dark: ThemeColors
}

export const THEME_IDS: readonly ThemeId[] = [
  'zinc',
  'graphite',
  'slate',
  'stone',
  'blue',
  'indigo',
  'violet',
  'emerald',
  'amber',
  'rose',
] as const
