import { motion } from 'framer-motion'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { useTheme } from '../../../providers/theme-provider'
import type { ThemeConfig } from '../../../types/theme'
import { AppIcon } from '../../../components/icons/app-icon'
import { useAppReducedMotion } from '../../../lib/motion'

export function ThemePicker() {
  const { theme, setTheme, allThemes, isDark } = useTheme()
  const reduceMotion = useAppReducedMotion()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {allThemes.map((item: ThemeConfig) => {
        const isSelected = theme === item.id
        const currentModeVars = isDark ? item.dark : item.light

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            className="group relative flex flex-col p-2.5 rounded-2xl border text-left transition-all select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              borderColor: isSelected
                ? 'var(--primary)'
                : 'color-mix(in oklch, var(--border) 90%, transparent)',
              backgroundColor: isSelected
                ? 'var(--surface-elevated)'
                : 'var(--surface)',
            }}
          >
            {/* Shared Layout Active Ring */}
            {isSelected && (
              <motion.div
                layoutId={reduceMotion ? undefined : 'active-theme-ring'}
                className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}

            {/* Mini Visual Preview Canvas */}
            <div
              className="relative w-full aspect-16/10 rounded-xl border border-border/70 overflow-hidden p-2 flex flex-col justify-between shadow-xs"
              style={{
                backgroundColor: currentModeVars.surface || 'var(--surface)',
              }}
            >
              {/* Mini Architectural Grid */}
              <div
                className="absolute inset-0 pointer-events-none pattern-grid-micro opacity-40"
                aria-hidden="true"
              />

              {/* Mini Header & Accent Dot */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: currentModeVars.accent }}
                  />
                  <div className="w-6 h-1 rounded-full bg-border-strong/60" />
                </div>

                {isSelected && (
                  <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <AppIcon icon={Tick02Icon} size={10} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Mini Content Card */}
              <div className="relative z-10 space-y-1">
                <div
                  className="w-4/5 h-2 rounded"
                  style={{
                    backgroundColor: 'color-mix(in oklch, var(--foreground) 15%, transparent)',
                  }}
                />
                <div
                  className="w-1/2 h-1.5 rounded"
                  style={{
                    backgroundColor: currentModeVars.accent,
                  }}
                />
              </div>
            </div>

            {/* Label & Description */}
            <div className="pt-2 px-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {item.accentBadge}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
