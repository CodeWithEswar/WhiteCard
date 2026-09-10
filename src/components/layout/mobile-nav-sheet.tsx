import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search01Icon,
  Upload01Icon,
  Settings02Icon,
  Sun01Icon,
  Moon02Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { useNavigationState } from '@/lib/navigation/navigation-state'
import { useVaultStats } from '@/features/documents/hooks/use-documents'
import { isParentRouteActive, isChildRouteActive } from '@/lib/navigation/is-route-active'
import { useTheme } from '@/providers/theme-provider'
import { useAuth } from '@/features/auth/auth-provider'
import { UserIdentity } from '../account/user-identity'
import { cn } from 'cn'

interface MobileNavSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenUpload: () => void
}

export function MobileNavSheet({
  open,
  onOpenChange,
  onOpenUpload,
}: MobileNavSheetProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)

  const { expiringCount } = useVaultStats()
  const { isDark, setAppearance } = useTheme()
  const { signOut } = useAuth()

  const {
    expandedParents,
    toggleParent,
    ensureParentExpanded,
  } = useNavigationState()

  // Automatically close the sheet whenever the route changes
  useEffect(() => {
    if (open) {
      onOpenChange(false)
    }
  }, [pathname, location.search])

  // Ensure active category parent is expanded on load
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
  }, [pathname, location.search, ensureParentExpanded])

  const handleActionClick = (actionId?: string) => {
    if (actionId === 'upload') {
      onOpenChange(false)
      onOpenUpload()
    }
  }

  const handleSignOut = async () => {
    onOpenChange(false)
    await signOut()
    navigate('/login')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        style={{ width: '220px', maxWidth: '220px' }}
        className="!w-[220px] !max-w-[220px] data-[side=left]:!w-[220px] data-[side=left]:!max-w-[220px] p-0 flex flex-col justify-between bg-sidebar border-r border-sidebar-border text-foreground select-none shadow-2xl"
      >
        {/* Top Header */}
        <SheetHeader className="p-3.5 pr-10 border-b border-sidebar-border/70 flex flex-row items-center justify-between space-y-0 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Link
              to="/app"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              <WhiteCardLogo size={22} showWordmark={true} />
              <span className="text-[9px] font-mono font-medium tracking-wider uppercase px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Vault
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Quick Search and Primary Actions Bar */}
        <div className="p-2.5 pb-1 shrink-0 space-y-1.5">
          {/* Search Trigger */}
          <Link
            to="/app/search"
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-between w-full h-8 px-2.5 rounded-md bg-muted/40 hover:bg-muted/70 border border-border/70 text-muted-foreground hover:text-foreground text-[11px] font-normal transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center gap-1.5 truncate">
              <AppIcon icon={Search01Icon} size={14} className="text-muted-foreground shrink-0" />
              <span className="truncate">Search vault...</span>
            </div>
            <kbd className="px-1 py-0.2 text-[9px] font-mono rounded bg-background border border-border/80 shrink-0">
              Go
            </kbd>
          </Link>

          {/* Quick Upload CTA */}
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onOpenUpload()
            }}
            className="w-full h-8 rounded-md font-medium text-[11px] gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-[0.98]"
          >
            <AppIcon icon={Upload01Icon} size={14} />
            <span>Upload Document</span>
          </Button>
        </div>

        {/* Scrollable Navigation Body with Sleek Scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-4 sidebar-scroll">
          {NAVIGATION_CONFIG.map((group) => (
            <div key={group.id} className="space-y-0.5">
              <div className="px-2 pb-1 text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                {group.label}
              </div>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const hasChildren = Boolean(item.children && item.children.length > 0)
                  const isParentActive = isParentRouteActive(item.href, pathname, location.search)
                  const hasActiveChild =
                    hasChildren &&
                    item.children?.some((child) => isChildRouteActive(child, pathname, searchParams))
                  const isHighlighted = isParentActive || hasActiveChild
                  const isExpanded = Boolean(expandedParents[item.id])

                  // Action Item (e.g. Quick Upload)
                  if (item.isAction) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleActionClick(item.actionId)}
                        className="flex items-center w-full gap-2.5 h-9 px-2.5 rounded-md text-xs font-medium text-foreground border border-dashed border-border/80 hover:border-border hover:bg-muted/40 transition-colors select-none outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <AppIcon icon={item.icon} size={16} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    )
                  }

                  // Standalone Item (e.g. Search, Expiring Soon, etc.)
                  if (!hasChildren) {
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => onOpenChange(false)}
                        aria-current={isParentActive ? 'page' : undefined}
                        className="relative flex items-center justify-between w-full h-9 px-2.5 rounded-md text-xs transition-colors duration-150 select-none outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/30 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AppIcon
                            icon={item.icon}
                            size={16}
                            className={cn(
                              'shrink-0 transition-colors',
                              isParentActive
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-foreground'
                            )}
                          />
                          <span
                            className={cn(
                              'truncate',
                              isParentActive
                                ? 'text-foreground font-semibold'
                                : 'text-muted-foreground group-hover:text-foreground font-normal'
                            )}
                          >
                            {item.label}
                          </span>
                        </div>

                        {item.badgeKey === 'expiring' && expiringCount > 0 && (
                          <span className="size-4.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[9px] font-mono font-bold flex items-center justify-center shrink-0">
                            {expiringCount}
                          </span>
                        )}
                      </Link>
                    )
                  }

                  // Expandable Parent Item
                  return (
                    <div key={item.id} className="space-y-0.5">
                      <div className="group flex items-center justify-between h-9 w-full px-2.5 rounded-md text-xs transition-colors duration-150 select-none outline-hidden hover:bg-muted/30">
                        <Link
                          to={item.href}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-2.5 flex-1 min-w-0 outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded"
                          aria-current={isParentActive ? 'page' : undefined}
                        >
                          <AppIcon
                            icon={item.icon}
                            size={16}
                            className={cn(
                              'shrink-0 transition-colors',
                              isHighlighted
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-foreground'
                            )}
                          />
                          <span
                            className={cn(
                              'truncate',
                              isHighlighted
                                ? 'text-foreground font-semibold'
                                : 'text-muted-foreground group-hover:text-foreground font-medium'
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleParent(item.id)
                          }}
                          aria-expanded={isExpanded}
                          aria-label={`Toggle ${item.label} submenu`}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-transform duration-200 outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <AppIcon
                            icon={ArrowDown01Icon}
                            size={13}
                            className={cn(
                              'transition-transform duration-200 ease-in-out',
                              isExpanded ? 'rotate-0' : '-rotate-90'
                            )}
                          />
                        </button>
                      </div>

                      {/* Sub-items */}
                      {isExpanded && (
                        <div className="space-y-0.5 pl-3 ml-2.5 border-l border-border/60">
                          {item.children?.map((child) => {
                            const isChildActive = isChildRouteActive(child, pathname, searchParams)
                            return (
                              <Link
                                key={child.id}
                                to={child.href}
                                onClick={() => onOpenChange(false)}
                                aria-current={isChildActive ? 'page' : undefined}
                                className={cn(
                                  'flex items-center h-7.5 px-2 rounded-md text-[11px] transition-colors duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-ring group',
                                  isChildActive
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 font-normal'
                                )}
                              >
                                <span className="truncate">{child.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Area & Utilities */}
        <div className="shrink-0 border-t border-sidebar-border/80 bg-sidebar/95 backdrop-blur-xs p-2.5 space-y-1.5">
          {/* User Profile Card */}
          <div className="p-1.5 rounded-md bg-muted/30 border border-border/60 flex items-center justify-between">
            <UserIdentity compact={false} showEmail={true} />
          </div>

          {/* Quick Utility Links */}
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <Link
              to="/app/settings"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <AppIcon icon={Settings02Icon} size={14} />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => setAppearance(isDark ? 'light' : 'dark')}
              className="flex items-center gap-1.5 h-7 px-2 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-left"
            >
              <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={14} />
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/50">
            <Link
              to="/privacy"
              onClick={() => onOpenChange(false)}
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span className="opacity-40">•</span>
            <Link
              to="/terms"
              onClick={() => onOpenChange(false)}
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <span className="opacity-40">•</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-destructive hover:underline font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
