import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload01Icon,
  Search01Icon,
  Settings02Icon,
  Logout01Icon,
  Shield01Icon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { CompactThemeControl } from '../theme/compact-theme-control'
import { UserIdentity } from '../account/user-identity'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface TopbarActionsProps {
  onOpenUpload: () => void
}

export function TopbarActions({ onOpenUpload }: TopbarActionsProps) {
  const navigate = useNavigate()
  const { displayName, email, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
  const shortcutText = isMac ? '⌘K' : 'Ctrl K'

  const handleOpenSearch = () => {
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

  const renderedName = displayName || (email ? email.split('@')[0] : 'Account')

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
      {/* 1. Global Search Trigger (Desktop full, Tablet icon-only) */}
      <button
        type="button"
        onClick={handleOpenSearch}
        aria-label={`Search White Card (${shortcutText})`}
        className="hidden lg:flex items-center gap-3 h-9 px-3 rounded-md bg-muted/40 hover:bg-muted/70 border border-border/70 text-muted-foreground hover:text-foreground text-xs font-normal transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2">
          <AppIcon icon={Search01Icon} size={15} className="text-muted-foreground" />
          <span>Search White Card...</span>
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-xs bg-background border border-border/80 shadow-2xs">
          {shortcutText}
        </kbd>
      </button>

      {/* Tablet Search Icon Trigger */}
      <Tooltip>
        <TooltipTrigger
          type="button"
          onClick={handleOpenSearch}
          aria-label={`Search (${shortcutText})`}
          className="hidden md:flex lg:hidden size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AppIcon icon={Search01Icon} size={17} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Search ({shortcutText})</TooltipContent>
      </Tooltip>

      {/* 2. Quick Upload CTA */}
      <Button
        onClick={onOpenUpload}
        className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-[0.98]"
      >
        <AppIcon icon={Upload01Icon} size={15} />
        <span className="hidden sm:inline">Upload</span>
      </Button>

      {/* 3. Compact Theme & Appearance Control */}
      <CompactThemeControl />

      {/* 4. User Profile Menu */}
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
          <DropdownMenuItem onClick={() => navigate('/privacy')} className="text-xs gap-2 rounded-md">
            <AppIcon icon={Shield01Icon} size={15} />
            <span>Privacy Policy</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/terms')} className="text-xs gap-2 rounded-md">
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
  )
}
