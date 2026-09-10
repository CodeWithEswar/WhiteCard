import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Upload01Icon,
  Search01Icon,
  Sun01Icon,
  Moon02Icon,
  Settings02Icon,
  Logout01Icon,
  Shield01Icon,
  HelpCircleIcon,
  ArrowRight01Icon,
  SidebarLeft01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'
import { useTheme } from '@/providers/theme-provider'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import { getBreadcrumbs, getPageTitle } from '@/lib/navigation/route-labels'
import { useNavigationState } from '@/lib/navigation/navigation-state'
import { UserIdentity } from '../account/user-identity'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface AppTopbarProps {
  onOpenUpload: () => void
}

export function AppTopbar({ onOpenUpload }: AppTopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const { isDark, setAppearance } = useTheme()
  const { displayName, email, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()

  const { isCollapsed, toggleCollapsed } = useNavigationState()
  const breadcrumbs = getBreadcrumbs(pathname, searchParams)
  const pageTitle = getPageTitle(pathname, searchParams)

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
  const shortcutText = isMac ? '⌘K' : 'Ctrl K'

  const handleOpenSearch = () => {
    // Open CommandMenu via synthetic keyboard event or direct navigation
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header
      aria-label="Desktop and tablet top command bar"
      className="h-16 px-5 border-b border-border/80 bg-surface/85 dark:bg-surface/75 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between select-none shadow-2xs"
    >
      {/* Left: Sidebar Toggle + Contextual Breadcrumb & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        >
          <AppIcon icon={SidebarLeft01Icon} size={17} />
        </button>
        <div className="h-4 w-px bg-border/80 shrink-0" />

        {breadcrumbs.length > 1 ? (
          <nav aria-label="Breadcrumb navigation" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <React.Fragment key={`${crumb.label}-${idx}`}>
                  {idx > 0 && (
                    <AppIcon
                      icon={ArrowRight01Icon}
                      size={12}
                      className="text-muted-foreground/60 shrink-0"
                    />
                  )}
                  {crumb.href && !isLast ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-foreground transition-colors font-medium truncate max-w-[140px]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground truncate max-w-[180px]">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              )
            })}
          </nav>
        ) : (
          <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
        )}
      </div>

      {/* Right: Search Shortcut + Quick Upload + Theme + Profile Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search Shortcut */}
        <button
          type="button"
          onClick={handleOpenSearch}
          aria-label={`Search White Card (${shortcutText})`}
          className="hidden sm:flex items-center gap-3 h-9 px-3 rounded-md bg-muted/50 hover:bg-muted/80 border border-border/80 text-muted-foreground hover:text-foreground text-xs font-normal transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center gap-2">
            <AppIcon icon={Search01Icon} size={15} className="text-muted-foreground" />
            <span>Search White Card...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-sm bg-background border border-border shadow-2xs">
            {shortcutText}
          </kbd>
        </button>

        {/* Quick Upload CTA */}
        <Button
          onClick={onOpenUpload}
          className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-[0.98]"
        >
          <AppIcon icon={Upload01Icon} size={15} />
          <span>Upload</span>
        </Button>

        {/* Theme Appearance Control */}
        <button
          type="button"
          onClick={() => setAppearance(isDark ? 'light' : 'dark')}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={17} />
        </button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="User profile options"
                className="rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <UserIdentity compact={true} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={8} className="w-56 rounded-md p-1.5 select-none">
            <div className="p-2 pb-1.5 space-y-1">
              {isBootstrapping ? (
                <div className="h-3.5 w-28 bg-muted/80 animate-pulse rounded" />
              ) : (
                <p className="text-xs font-semibold text-foreground truncate">
                  {displayName || (email ? email.split('@')[0] : '')}
                </p>
              )}
              {email && (
                <p className="text-[10px] text-muted-foreground font-mono truncate">{email}</p>
              )}
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
              {isDark ? 'Light Appearance' : 'Dark Appearance'}
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
    </header>
  )
}
