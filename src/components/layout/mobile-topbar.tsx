import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  Upload01Icon,
  Settings02Icon,
  Sun01Icon,
  Moon02Icon,
  Logout01Icon,
  Shield01Icon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'
import { useTheme } from '@/providers/theme-provider'
import { useProfile, getInitials } from '@/features/auth/hooks/use-profile'
import { useAuth } from '@/features/auth/auth-provider'
import { getPageTitle } from '@/lib/navigation/route-labels'
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
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const { isDark, setAppearance } = useTheme()
  const { profile } = useProfile()
  const { signOut } = useAuth()

  const userName = profile?.name || 'Personal Vault'
  const userEmail = profile?.email || 'Private Account'
  const userAvatar = profile?.avatar

  const isDeepRoute =
    pathname.startsWith('/app/document/') ||
    pathname.startsWith('/app/documents/') ||
    pathname === '/app/settings'

  const title = getPageTitle(pathname, searchParams)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header
      aria-label="Mobile navigation header"
      className="h-14 px-4 flex items-center justify-between border-b border-sidebar-border/80 bg-surface/90 backdrop-blur-md sticky top-0 z-30 select-none pt-[env(safe-area-inset-top)]"
    >
      {/* Left Area */}
      <div className="flex items-center gap-2.5 min-w-0">
        {isDeepRoute ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center gap-1.5 -ml-1.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <AppIcon icon={ArrowLeft01Icon} size={18} />
            <span className="text-xs font-semibold text-foreground truncate max-w-[160px]">
              {title}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/app" aria-label="White Card Home" className="flex items-center">
              <WhiteCardLogo size={24} showWordmark={false} />
            </Link>
            <span className="text-xs font-semibold text-foreground truncate pl-2 border-l border-border/70">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Right Area: Quick Upload + Avatar Menu */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={onOpenUpload}
          className="h-8 px-2.5 rounded-md font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-95"
        >
          <AppIcon icon={Upload01Icon} size={14} />
          <span>Upload</span>
        </Button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="User profile options"
                className="size-8 rounded-md bg-muted/70 border border-border/80 flex items-center justify-center font-bold text-[11px] text-foreground hover:border-foreground/20 transition-colors overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="size-full object-cover rounded-md" />
            ) : (
              getInitials(userName)
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={8} className="w-56 rounded-md p-1.5">
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
