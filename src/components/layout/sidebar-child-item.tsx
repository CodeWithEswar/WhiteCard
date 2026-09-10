import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from 'cn'

interface SidebarChildItemProps {
  label: string
  href: string
  isActive: boolean
  onClick?: () => void
}

export function SidebarChildItem({ label, href, isActive, onClick }: SidebarChildItemProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative pl-5 ml-5 border-l border-border/70 group/child">
      {/* Active Indicator on Connector Line */}
      {isActive && (
        <motion.div
          layoutId={reduceMotion ? undefined : 'sidebar-child-active-dot'}
          className="absolute -left-[4px] top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary ring-2 ring-background"
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        />
      )}

      <Link
        to={href}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex items-center h-8 px-2.5 rounded-xl text-xs transition-colors duration-150 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'font-semibold text-primary' // Clean colored text, no background square
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 font-normal'
        )}
      >
        <span className="truncate">{label}</span>
      </Link>
    </div>
  )
}
