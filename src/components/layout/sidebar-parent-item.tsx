import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import type { NavigationItem } from '@/config/navigation'
import { SidebarChildItem } from './sidebar-child-item'
import { isParentRouteActive, isChildRouteActive } from '@/lib/navigation/is-route-active'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from 'cn'

interface SidebarParentItemProps {
  item: NavigationItem
  isExpanded: boolean
  onToggle: () => void
  isCollapsed?: boolean
  expiringCount?: number
  onActionClick?: (actionId: string) => void
}

export function SidebarParentItem({
  item,
  isExpanded,
  onToggle,
  isCollapsed = false,
  expiringCount = 0,
  onActionClick,
}: SidebarParentItemProps) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const reduceMotion = useReducedMotion()

  const hasChildren = Boolean(item.children && item.children.length > 0)
  const isParentActive = isParentRouteActive(item.href, location.pathname, location.search)

  // Check if any child is currently active
  const hasActiveChild =
    hasChildren &&
    item.children?.some((child) => isChildRouteActive(child, location.pathname, searchParams))

  const isHighlighted = isParentActive || hasActiveChild

  // Action items (e.g. Quick Upload)
  if (item.isAction) {
    const actionButton = (
      <button
        type="button"
        onClick={() => item.actionId && onActionClick?.(item.actionId)}
        className={cn(
          'w-full flex items-center gap-3 h-10 px-3 rounded-md text-xs font-medium text-foreground transition-all duration-150 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-ring border border-dashed border-border/80 hover:border-border hover:bg-muted/50',
          isCollapsed ? 'justify-center px-0' : ''
        )}
      >
        <AppIcon icon={item.icon} size={18} className="text-foreground shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </button>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger render={actionButton} />
          <TooltipContent side="right" align="center">
            {item.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return actionButton
  }

  // Standalone items (e.g. Search Vault, Government Documents, Expiring Soon)
  if (!hasChildren) {
    const standaloneLink = (
      <Link
        to={item.href}
        aria-current={isParentActive ? 'page' : undefined}
        className={cn(
          'relative w-full flex items-center gap-3 h-10 px-3 rounded-md text-xs transition-colors duration-150 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-ring group',
          isParentActive
            ? 'font-semibold text-foreground bg-muted/60'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal',
          isCollapsed ? 'justify-center px-0' : ''
        )}
      >
        <AppIcon
          icon={item.icon}
          size={18}
          className={cn(
            'shrink-0 transition-colors',
            isParentActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />
        {!isCollapsed && (
          <>
            <span className="truncate flex-1">{item.label}</span>
            {item.badgeKey === 'expiring' && expiringCount > 0 && (
              <span className="size-5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                {expiringCount}
              </span>
            )}
          </>
        )}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger render={standaloneLink} />
          <TooltipContent side="right" align="center">
            {item.label}
            {item.badgeKey === 'expiring' && expiringCount > 0 ? ` (${expiringCount})` : ''}
          </TooltipContent>
        </Tooltip>
      )
    }

    return standaloneLink
  }

  // Expandable Parent item (Vault Home, Government, Student)
  const parentTrigger = (
    <div
      className={cn(
        'group flex items-center justify-between h-10 px-3 rounded-md text-xs transition-colors duration-150 select-none outline-hidden',
        isHighlighted
          ? 'font-semibold text-foreground bg-muted/40'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 font-medium',
        isCollapsed ? 'justify-center px-0' : ''
      )}
    >
      <Link
        to={item.href}
        className="flex items-center gap-3 flex-1 min-w-0 outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-current={isParentActive ? 'page' : undefined}
      >
        <AppIcon
          icon={item.icon}
          size={18}
          className={cn(
            'shrink-0 transition-colors',
            isHighlighted ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </Link>

      {!isCollapsed && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggle()
          }}
          aria-expanded={isExpanded}
          aria-label={`Toggle ${item.label} submenu`}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-transform duration-200 outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <AppIcon
            icon={ArrowDown01Icon}
            size={14}
            className={cn(
              'transition-transform duration-200 ease-in-out',
              isExpanded ? 'rotate-0' : '-rotate-90'
            )}
          />
        </button>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={parentTrigger} />
        <TooltipContent side="right" align="center">
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="space-y-1">
      {parentTrigger}

      {/* Children list with connector line */}
      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            key={`children-${item.id}`}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden space-y-0.5 pt-0.5"
          >
            {item.children?.map((child) => {
              const isChildActive = isChildRouteActive(child, location.pathname, searchParams)
              return (
                <SidebarChildItem
                  key={child.id}
                  label={child.label}
                  href={child.href}
                  isActive={isChildActive}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
