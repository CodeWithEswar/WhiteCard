import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Upload01Icon,
  Settings02Icon,
  Sun01Icon,
  Moon02Icon,
  Logout01Icon,
  HelpCircleIcon,
  Shield01Icon,
} from '@hugeicons/core-free-icons'
import { WhiteCardLogo } from '../brand/white-card-logo'
import { AppIcon } from '../icons/app-icon'
import { useTheme } from '../../providers/theme-provider'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { isParentRouteActive } from '@/lib/navigation/is-route-active'
import { useVaultStats } from '@/features/documents/hooks/use-documents'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import { UserIdentity } from '../account/user-identity'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { TabletNavFlyout } from './tablet-nav-flyout'
import { cn } from 'cn'

interface TabletRailProps {
  onOpenUpload: () => void
}

export function TabletRail({ onOpenUpload }: TabletRailProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { isDark, setAppearance } = useTheme()
  const { expiringCount } = useVaultStats()
  const { displayName, email, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()

  const vaultSpaces = NAVIGATION_CONFIG.find((g) => g.id === 'vault-spaces')?.items || []
  const expiringItem = NAVIGATION_CONFIG.find((g) => g.id === 'collections-alerts')?.items.find(
    (i) => i.id === 'collection-expiring'
  )

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside
      aria-label="Tablet primary rail"
      className="w-[56px] h-screen sticky top-0 flex flex-col justify-between items-center py-3 border-r border-sidebar-border/80 bg-sidebar select-none shrink-0 z-30"
    >
      {/* Brand & Main Spaces */}
      <div className="flex flex-col items-center gap-3.5 w-full">
        {/* Brand Logo */}
        <Link
          to="/app"
          aria-label="White Card Vault Home"
          className="size-9 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <WhiteCardLogo size={22} showWordmark={false} />
        </Link>

        {/* Quick Upload Action */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={onOpenUpload}
                aria-label="Quick Upload document"
                className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xs hover:bg-primary/90 transition-all active:scale-95 outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <AppIcon icon={Upload01Icon} size={17} />
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Quick Upload
          </TooltipContent>
        </Tooltip>

        <div className="w-6 h-px bg-border/60 my-0.5" />

        {/* Core Spaces Navigation */}
        <nav aria-label="Vault spaces navigation" className="flex flex-col items-center gap-1.5 w-full px-1">
          {vaultSpaces.map((item) => {
            const isActive = isParentRouteActive(item.href, pathname, location.search)

            const navButton = (
              <Link
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative size-9 rounded-xl flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/40',
                  isActive ? 'font-semibold' : ''
                )}
              >
                <AppIcon
                  icon={item.icon}
                  size={18}
                  className={cn(
                    'relative z-10 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </Link>
            )

            // If item has expandable children, wrap with TabletNavFlyout
            if (item.children && item.children.length > 0) {
              return (
                <TabletNavFlyout
                  key={item.id}
                  item={item}
                  trigger={
                    <button
                      type="button"
                      aria-label={`${item.label} space`}
                      className={cn(
                        'relative size-9 rounded-xl flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/40',
                        isActive ? 'font-semibold' : ''
                      )}
                    >
                      <AppIcon
                        icon={item.icon}
                        size={18}
                        className={cn(
                          'relative z-10 transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </button>
                  }
                />
              )
            }

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger render={navButton} />
                <TooltipContent side="right" align="center">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Expiring Soon shortcut */}
          {expiringItem && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to={expiringItem.href}
                    aria-current={pathname === expiringItem.href ? 'page' : undefined}
                    className="relative size-9 rounded-xl flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/40"
                  >
                    <AppIcon
                      icon={expiringItem.icon}
                      size={18}
                      className={cn(
                        'transition-colors',
                        pathname === expiringItem.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    {expiringCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 ring-2 ring-background" />
                    )}
                  </Link>
                }
              >
                <AppIcon icon={expiringItem.icon} size={18} />
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {expiringItem.label}
                {expiringCount > 0 ? ` (${expiringCount})` : ''}
              </TooltipContent>
            </Tooltip>
          )}
        </nav>
      </div>

      {/* Bottom Utilities & Profile */}
      <div className="flex flex-col items-center gap-1.5 w-full px-1">
        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className="size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={17} />
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                to="/app/settings"
                aria-label="Vault settings"
                aria-current={pathname === '/app/settings' ? 'page' : undefined}
                className={cn(
                  'size-9 rounded-xl flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/50',
                  pathname === '/app/settings' ? 'font-semibold' : ''
                )}
              />
            }
          >
            <AppIcon
              icon={Settings02Icon}
              size={17}
              className={cn(
                'transition-colors',
                pathname === '/app/settings' ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Settings & Themes
          </TooltipContent>
        </Tooltip>

        <div className="w-6 h-px bg-border/60 my-0.5" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="User profile and preferences"
                className="size-9 rounded-xl flex items-center justify-center outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <UserIdentity compact={true} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" sideOffset={12} className="w-56 rounded-xl p-1.5 select-none">
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
            <DropdownMenuItem onClick={() => navigate('/app/settings')} className="text-xs gap-2 rounded-xl">
              <AppIcon icon={Settings02Icon} size={15} />
              Vault Settings & Themes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/privacy')} className="text-xs gap-2 rounded-xl">
              <AppIcon icon={Shield01Icon} size={15} />
              Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/terms')} className="text-xs gap-2 rounded-xl">
              <AppIcon icon={HelpCircleIcon} size={15} />
              Terms of Service
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs gap-2 rounded-xl text-destructive hover:text-destructive focus:text-destructive"
            >
              <AppIcon icon={Logout01Icon} size={15} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
