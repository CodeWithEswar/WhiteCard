import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import { useAppReducedMotion } from '../../lib/motion'
import { NAVIGATION_CONFIG } from '@/config/navigation'
import { isParentRouteActive } from '@/lib/navigation/is-route-active'
import { useVaultStats } from '@/features/documents/hooks/use-documents'
import { useProfile, getInitials } from '@/features/auth/hooks/use-profile'
import { useAuth } from '@/features/auth/auth-provider'
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
  const reduceMotion = useAppReducedMotion()
  const { expiringCount } = useVaultStats()
  const { profile } = useProfile()
  const { signOut } = useAuth()

  const userName = profile?.name || 'Personal Vault'
  const userEmail = profile?.email || 'Private Account'
  const userAvatar = profile?.avatar

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
      className="w-[72px] h-screen sticky top-0 flex flex-col justify-between items-center py-3 border-r border-sidebar-border/80 bg-sidebar select-none shrink-0 z-30"
    >
      {/* Brand & Main Spaces */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Logo */}
        <Link
          to="/app"
          aria-label="White Card Vault Home"
          className="size-10 rounded-md flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <WhiteCardLogo size={24} showWordmark={false} />
        </Link>

        {/* Quick Upload Action */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={onOpenUpload}
                aria-label="Quick Upload document"
                className="size-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-2xs hover:bg-primary/90 transition-all active:scale-95 outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <AppIcon icon={Upload01Icon} size={18} />
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Quick Upload
          </TooltipContent>
        </Tooltip>

        <div className="w-8 h-px bg-border/60 my-1" />

        {/* Core Spaces Navigation */}
        <nav aria-label="Vault spaces navigation" className="flex flex-col items-center gap-1.5 w-full px-2">
          {vaultSpaces.map((item) => {
            const isActive = isParentRouteActive(item.href, pathname, location.search)

            const navButton = (
              <Link
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative size-10 rounded-md flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'text-foreground font-semibold bg-muted/70'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={reduceMotion ? undefined : 'tablet-nav-active'}
                    className="absolute inset-0 rounded-md bg-muted/80 border border-border shadow-2xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <AppIcon
                  icon={item.icon}
                  size={18}
                  className={cn('relative z-10', isActive ? 'text-foreground' : 'text-muted-foreground')}
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
                        'relative size-10 rounded-md flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'text-foreground font-semibold bg-muted/70'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId={reduceMotion ? undefined : 'tablet-nav-active'}
                          className="absolute inset-0 rounded-md bg-muted/80 border border-border shadow-2xs"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <AppIcon
                        icon={item.icon}
                        size={18}
                        className={cn('relative z-10', isActive ? 'text-foreground' : 'text-muted-foreground')}
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
                    className={cn(
                      'relative size-10 rounded-md flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                      pathname === expiringItem.href
                        ? 'text-foreground font-semibold bg-muted/70'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                  />
                }
              >
                <AppIcon icon={expiringItem.icon} size={18} />
                {expiringCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 ring-2 ring-background" />
                )}
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
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className="size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
                  'size-9 rounded-md flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                  pathname === '/app/settings'
                    ? 'text-foreground bg-muted font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              />
            }
          >
            <AppIcon icon={Settings02Icon} size={17} />
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Settings & Themes
          </TooltipContent>
        </Tooltip>

        <div className="w-8 h-px bg-border/60 my-0.5" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="User profile and preferences"
                className="size-9 rounded-md bg-muted/60 border border-border/80 flex items-center justify-center font-semibold text-xs text-foreground hover:border-foreground/20 transition-colors overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
    </aside>
  )
}
