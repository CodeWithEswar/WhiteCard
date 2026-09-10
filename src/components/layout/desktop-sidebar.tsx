import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarLeft01Icon } from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { SidebarSection } from './sidebar-section'
import { SidebarParentItem } from './sidebar-parent-item'
import { SidebarUser } from './sidebar-user'
import { useNavigationState } from '@/lib/navigation/navigation-state'
import { isParentRouteActive } from '@/lib/navigation/is-route-active'
import { useVaultStats } from '@/features/documents/hooks/use-documents'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from 'cn'

interface DesktopSidebarProps {
  onOpenUpload: () => void
}

export function DesktopSidebar({ onOpenUpload }: DesktopSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { expiringCount } = useVaultStats()

  const {
    isCollapsed,
    toggleCollapsed,
    expandedParents,
    toggleParent,
    ensureParentExpanded,
  } = useNavigationState()

  // Auto-expand active parent space on route changes
  useEffect(() => {
    NAVIGATION_CONFIG.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (isParentRouteActive(item.href, pathname, location.search)) {
            ensureParentExpanded(item.id)
          }
        }
      })
    })
  }, [pathname, location.search])

  const handleActionClick = (actionId: string) => {
    if (actionId === 'upload') {
      onOpenUpload()
    }
  }

  return (
    <aside
      aria-label="Desktop primary sidebar"
      className={cn(
        'h-screen sticky top-0 flex flex-col justify-between border-r border-sidebar-border/80 bg-sidebar select-none shrink-0 z-30 transition-all duration-200 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-[256px]'
      )}
    >
      {/* Top Brand Area with Micro-Grid Fade (Section 62/63) */}
      <div className="relative shrink-0 border-b border-sidebar-border/70">
        {/* Subtle architectural micro-grid fade in the first 96px */}
        <div
          aria-hidden="true"
          className="absolute inset-0 h-24 pointer-events-none opacity-[0.035] dark:opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
        />

        <div
          className={cn(
            'relative h-16 flex items-center',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          <Link
            to="/app"
            aria-label="White Card Vault Home"
            className="flex items-center gap-2.5 outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-md py-1"
          >
            <WhiteCardLogo size={26} showWordmark={!isCollapsed} />
          </Link>

          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label="Collapse sidebar"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                <AppIcon icon={SidebarLeft01Icon} size={16} />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Collapse Sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Middle Scrollable Navigation List (Section 76) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {NAVIGATION_CONFIG.map((group) => (
          <SidebarSection
            key={group.id}
            label={group.label}
            isCollapsed={isCollapsed}
          >
            {group.items.map((item) => (
              <SidebarParentItem
                key={item.id}
                item={item}
                isExpanded={Boolean(expandedParents[item.id])}
                onToggle={() => toggleParent(item.id)}
                isCollapsed={isCollapsed}
                expiringCount={expiringCount}
                onActionClick={handleActionClick}
              />
            ))}
          </SidebarSection>
        ))}
      </div>

      {/* Bottom User Area & Collapse Controls (Section 65) */}
      <div className="shrink-0 p-2.5 border-t border-sidebar-border/80 bg-sidebar/95 backdrop-blur-xs">
        {isCollapsed && (
          <div className="flex justify-center pb-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label="Expand sidebar"
                    className="size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                <AppIcon icon={SidebarLeft01Icon} size={16} className="rotate-180" />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Expand Sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <SidebarUser isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}
