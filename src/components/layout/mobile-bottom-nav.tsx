import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Home01Icon,
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { isParentRouteActive } from '@/lib/navigation/is-route-active'
import { cn } from 'cn'

export function MobileBottomNav() {
  const location = useLocation()
  const pathname = location.pathname
  const reduceMotion = useReducedMotion()

  const tabs = [
    { id: 'home', label: 'Home', path: '/app', icon: Home01Icon },
    { id: 'government', label: 'Government', path: '/app/government', icon: Passport01Icon },
    { id: 'student', label: 'Student', path: '/app/student', icon: Certificate01Icon },
    { id: 'search', label: 'Search', path: '/app/search', icon: Search01Icon },
  ]

  return (
    <nav
      aria-label="Mobile primary vault navigation"
      className="fixed z-40 left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] select-none pointer-events-auto"
    >
      <div className="h-15 max-w-md mx-auto px-2 rounded-[22px] border border-border/85 bg-surface/90 backdrop-blur-xl shadow-lg flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = isParentRouteActive(tab.path, pathname, location.search)

          return (
            <Link
              key={tab.id}
              to={tab.path}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex-1 flex flex-col items-center justify-center h-12 py-1 transition-colors group outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              {isActive && (
                <motion.div
                  layoutId={reduceMotion ? undefined : 'mobile-nav-active'}
                  className="absolute inset-x-2 inset-y-1 rounded-xl bg-muted/80 border border-border/70 -z-10 shadow-2xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <AppIcon
                icon={tab.icon}
                size={18}
                className={cn(
                  'transition-all duration-150',
                  isActive ? 'text-foreground scale-105' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span
                className={cn(
                  'text-[10.5px] tracking-tight mt-0.5 transition-colors',
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium'
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
