import { motion } from 'framer-motion'
import { Sun01Icon, Moon02Icon, ComputerIcon } from '@hugeicons/core-free-icons'
import { useTheme } from '../../../providers/theme-provider'
import type { AppearanceMode } from '../../../types/theme'
import { AppIcon } from '../../../components/icons/app-icon'
import { useAppReducedMotion } from '../../../lib/motion'

export function AppearanceControl() {
  const { appearance, setAppearance } = useTheme()
  const reduceMotion = useAppReducedMotion()

  const options: { id: AppearanceMode; label: string; icon: typeof Sun01Icon }[] = [
    { id: 'system', label: 'System', icon: ComputerIcon },
    { id: 'light', label: 'Light', icon: Sun01Icon },
    { id: 'dark', label: 'Dark', icon: Moon02Icon },
  ]

  return (
    <div className="flex items-center p-1 rounded-2xl border border-border bg-surface-muted/60 max-w-sm">
      {options.map((opt) => {
        const active = appearance === opt.id

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setAppearance(opt.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-colors select-none focus-visible:outline-hidden"
          >
            {active && (
              <motion.div
                layoutId={reduceMotion ? undefined : 'active-appearance-pill'}
                className="absolute inset-0 rounded-xl bg-surface border border-border/90 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1.5 ${active ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}
            >
              <AppIcon icon={opt.icon} size={15} />
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
