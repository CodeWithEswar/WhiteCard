import { useState, useEffect, createContext, useContext, useRef, type ReactNode } from 'react'
import type { AppearanceMode, ThemeConfig, ThemeId } from '../types/theme'
import { DEFAULT_THEME_ID, getThemeConfig, THEME_PRESETS } from '../config/themes'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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

const THEME_KEY = 'white-card-theme'
const THEME_KEY_LEGACY = 'whitecard_theme_preset'
const APPEARANCE_KEY = 'white-card-appearance'
const APPEARANCE_KEY_LEGACY = 'whitecard_appearance_mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = (localStorage.getItem(THEME_KEY) || localStorage.getItem(THEME_KEY_LEGACY)) as ThemeId | null
    if (saved && THEME_PRESETS.some((t) => t.id === saved)) {
      return saved
    }
    return DEFAULT_THEME_ID
  })

  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    const saved = (localStorage.getItem(APPEARANCE_KEY) || localStorage.getItem(APPEARANCE_KEY_LEGACY)) as AppearanceMode | null
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

  const transitionTimerRef = useRef<number | null>(null)

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

  // Background sync: Fetch remote preferences when authenticated
  useEffect(() => {
    const client = supabase
    if (!isSupabaseConfigured || !client) return

    let isMounted = true

    async function syncRemotePreferences() {
      if (!isSupabaseConfigured || !supabase) return
      const client = supabase
      try {
        const { data: authData } = await client.auth.getUser()
        if (!authData?.user || !isMounted) return

        const { data: pref, error } = await client
          .from('user_preferences')
          .select('theme_id, appearance')
          .eq('user_id', authData.user.id)
          .maybeSingle()

        if (error || !pref || !isMounted) return

        if (pref.theme_id && THEME_PRESETS.some((t) => t.id === pref.theme_id)) {
          setThemeState(pref.theme_id as ThemeId)
          localStorage.setItem(THEME_KEY, pref.theme_id)
        }

        if (pref.appearance && ['system', 'light', 'dark'].includes(pref.appearance)) {
          setAppearanceState(pref.appearance as AppearanceMode)
          localStorage.setItem(APPEARANCE_KEY, pref.appearance)
        }
      } catch {
        // Non-blocking background sync
      }
    }

    syncRemotePreferences()

    return () => {
      isMounted = false
    }
  }, [])

  const triggerSmoothTransition = () => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.add('theme-transition')

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current)
    }

    transitionTimerRef.current = window.setTimeout(() => {
      root.classList.remove('theme-transition')
      transitionTimerRef.current = null
    }, 200)
  }

  const setTheme = (newTheme: ThemeId) => {
    triggerSmoothTransition()
    setThemeState(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
    localStorage.setItem(THEME_KEY_LEGACY, newTheme)

    // Background sync to Supabase user_preferences
    const client = supabase
    if (isSupabaseConfigured && client) {
      client.auth.getUser().then(({ data }) => {
        if (data?.user?.id) {
          Promise.resolve(
            client
              .from('user_preferences')
              .upsert(
                {
                  user_id: data.user.id,
                  theme_id: newTheme,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
              )
          ).catch(console.warn)
        }
      })
    }
  }

  const setAppearance = (newMode: AppearanceMode) => {
    triggerSmoothTransition()
    setAppearanceState(newMode)
    localStorage.setItem(APPEARANCE_KEY, newMode)
    localStorage.setItem(APPEARANCE_KEY_LEGACY, newMode)

    // Background sync to Supabase user_preferences
    const client = supabase
    if (isSupabaseConfigured && client) {
      client.auth.getUser().then(({ data }) => {
        if (data?.user?.id) {
          Promise.resolve(
            client
              .from('user_preferences')
              .upsert(
                {
                  user_id: data.user.id,
                  appearance: newMode,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
              )
          ).catch(console.warn)
        }
      })
    }
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
