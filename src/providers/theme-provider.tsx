import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import type { AppearanceMode, ThemeConfig, ThemeId } from '../types/theme'
import { DEFAULT_THEME_ID, getThemeConfig, THEME_PRESETS } from '../config/themes'

interface ThemeContextType {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  appearance: AppearanceMode
  setAppearance: (mode: AppearanceMode) => void
  isDark: boolean
  themeConfig: ThemeConfig
  allThemes: ThemeConfig[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_KEY = 'whitecard_theme_preset'
const APPEARANCE_KEY = 'whitecard_appearance_mode'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (saved && THEME_PRESETS.some((t) => t.id === saved)) {
      return saved
    }
    return DEFAULT_THEME_ID
  })

  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    const saved = localStorage.getItem(APPEARANCE_KEY) as AppearanceMode | null
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      return saved
    }
    return 'system'
  })

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Watch system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const isDark = appearance === 'dark' || (appearance === 'system' && systemIsDark)

  // Apply theme & dark class to documentElement
  useEffect(() => {
    const root = document.documentElement

    // Update theme data attribute
    root.setAttribute('data-theme', theme)

    // Update dark class
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme, isDark])

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
  }

  const setAppearance = (newMode: AppearanceMode) => {
    setAppearanceState(newMode)
    localStorage.setItem(APPEARANCE_KEY, newMode)
  }

  const themeConfig = getThemeConfig(theme)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        appearance,
        setAppearance,
        isDark,
        themeConfig,
        allThemes: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
