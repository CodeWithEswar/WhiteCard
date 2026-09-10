import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Settings02Icon,
  Logout01Icon,
  Sun01Icon,
  Moon02Icon,
  Shield01Icon,
  HelpCircleIcon,
  SidebarLeft01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { SidebarSection } from './sidebar-section'
import { SidebarParentItem } from './sidebar-parent-item'
import { useNavigationState } from '@/lib/navigation/navigation-state'
import { isParentRouteActive } from '@/lib/navigation/is-route-active'
import { useVaultStats } from '@/features/documents/hooks/use-documents'
import { useProfile, getInitials } from '@/features/auth/hooks/use-profile'
import { useAuth } from '@/features/auth/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from 'cn'

interface DesktopSidebarProps {
  onOpenUpload: () => void
}

export function DesktopSidebar({ onOpenUpload }: DesktopSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { isDark, setAppearance } = useTheme()
  const { expiringCount } = useVaultStats()
  const { profile } = useProfile()
  const { signOut } = useAuth()

  const {
    isCollapsed,
    toggleCollapsed,
    expandedParents,
    toggleParent,
    ensureParentExpanded,
  } = useNavigationState()

  const userName = profile?.name || 'Personal Vault'
  const userEmail = profile?.email || 'Private Account'
  const userAvatar = profile?.avatar

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

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

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
      <div className="shrink-0 p-3 border-t border-sidebar-border/80 bg-sidebar/95 backdrop-blur-xs space-y-2">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
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

            {/* Collapsed Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="User profile and preferences"
                    className="size-9 rounded-md bg-muted/70 border border-border/80 flex items-center justify-center font-bold text-[11px] text-foreground hover:border-foreground/20 transition-colors overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  />
                }
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="size-full object-cover rounded-md" />
                ) : (
                  getInitials(userName)
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" sideOffset={12} className="w-56 rounded-md p-1.5">
                <div className="p-2 pb-1.5 space-y-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app/settings')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={Settings02Icon} size={15} />
                  Vault Settings & Themes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                  className="text-xs gap-2 rounded-md"
                >
                  <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={15} />
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/privacy')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={Shield01Icon} size={15} />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/terms')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={HelpCircleIcon} size={15} />
                  Terms of Service
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-xs gap-2 rounded-md text-destructive hover:text-destructive focus:text-destructive"
                >
                  <AppIcon icon={Logout01Icon} size={15} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="User profile and preferences"
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
                  />
                }
              >
                <div className="size-8 rounded-md bg-muted/70 border border-border/80 flex items-center justify-center font-bold text-xs text-foreground shrink-0 overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="size-full object-cover rounded-md" />
                  ) : (
                    getInitials(userName)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground font-mono truncate leading-tight">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56 rounded-md p-1.5">
                <div className="p-2 pb-1.5 space-y-0.5">
                  <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app/settings')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={Settings02Icon} size={15} />
                  Vault Settings & Themes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                  className="text-xs gap-2 rounded-md"
                >
                  <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={15} />
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/privacy')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={Shield01Icon} size={15} />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/terms')} className="text-xs gap-2 rounded-md">
                  <AppIcon icon={HelpCircleIcon} size={15} />
                  Terms of Service
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-xs gap-2 rounded-md text-destructive hover:text-destructive focus:text-destructive"
                >
                  <AppIcon icon={Logout01Icon} size={15} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </aside>
  )
}
