import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu01Icon,
  ArrowLeft01Icon,
  Upload01Icon,
  Settings02Icon,
  Logout01Icon,
  Shield01Icon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'
import { CompactThemeControl } from '../theme/compact-theme-control'
import { UserIdentity } from '../account/user-identity'
import { MobileNavSheet } from './mobile-nav-sheet'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import { getPageTitle } from '@/lib/navigation/route-labels'
import { useSmartBack } from '@/lib/navigation/previous-route'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface MobileTopbarProps {
  onOpenUpload: () => void
}

export function MobileTopbar({ onOpenUpload }: MobileTopbarProps) {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)

  const { displayName, email, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()
  const goBack = useSmartBack('/app')

  const isDeepRoute =
    pathname.startsWith('/app/document/') ||
    pathname.startsWith('/app/documents/') ||
    pathname === '/app/settings'

  const title = getPageTitle(pathname, searchParams)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const renderedName = displayName || (email ? email.split('@')[0] : 'Account')

  return (
    <>
      <header
        aria-label="Mobile navigation header"
        className="h-14 px-3.5 flex items-center justify-between border-b border-topbar-border bg-topbar-background/90 backdrop-blur-md sticky top-0 z-30 select-none pt-[env(safe-area-inset-top)]"
      >
        {/* Left: Drawer Toggle + Contextual Back / Page Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation drawer"
            className="p-1.5 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <AppIcon icon={Menu01Icon} size={19} />
          </button>

          {isDeepRoute ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className="flex items-center gap-1.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors min-w-0"
            >
              <AppIcon icon={ArrowLeft01Icon} size={16} className="shrink-0" />
              <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                {title}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/app" aria-label="White Card Home" className="flex items-center shrink-0">
                <WhiteCardLogo size={22} showWordmark={false} />
              </Link>
              <span className="text-xs font-semibold text-foreground truncate pl-2 border-l border-border/70">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Right Area: Quick Upload + Compact Theme + User Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={onOpenUpload}
            className="h-8 px-2.5 rounded-md font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-95"
          >
            <AppIcon icon={Upload01Icon} size={14} />
            <span className="hidden xs:inline">Upload</span>
          </Button>

          {/* Theme Control */}
          <CompactThemeControl />

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="User profile options"
                  className="rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                />
              }
            >
              <UserIdentity compact={true} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-56 rounded-xl p-1.5 select-none shadow-lg border border-border/80 bg-popover"
            >
              <div className="p-2 pb-1.5 space-y-1">
                {isBootstrapping ? (
                  <div className="h-3.5 w-28 bg-muted/80 animate-pulse rounded" />
                ) : (
                  <p className="text-xs font-semibold text-foreground truncate">{renderedName}</p>
                )}
                {email && (
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{email}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/app/settings')}
                className="text-xs gap-2 rounded-md"
              >
                <AppIcon icon={Settings02Icon} size={15} />
                <span>Vault Settings & Themes</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/privacy')}
                className="text-xs gap-2 rounded-md"
              >
                <AppIcon icon={Shield01Icon} size={15} />
                <span>Privacy Policy</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/terms')}
                className="text-xs gap-2 rounded-md"
              >
                <AppIcon icon={HelpCircleIcon} size={15} />
                <span>Terms of Service</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-xs gap-2 rounded-md text-destructive hover:text-destructive focus:text-destructive"
              >
                <AppIcon icon={Logout01Icon} size={15} />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 220px Mobile Navigation Sheet Drawer */}
      <MobileNavSheet
        open={navOpen}
        onOpenChange={setNavOpen}
        onOpenUpload={onOpenUpload}
      />
    </>
  )
}
