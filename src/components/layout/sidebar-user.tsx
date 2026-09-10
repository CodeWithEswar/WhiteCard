import { useNavigate } from 'react-router-dom'
import {
  Settings02Icon,
  Sun01Icon,
  Moon02Icon,
  Shield01Icon,
  HelpCircleIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { UserIdentity } from '../account/user-identity'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuth } from '@/features/auth/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { cn } from 'cn'

interface SidebarUserProps {
  isCollapsed?: boolean
  className?: string
}

export function SidebarUser({ isCollapsed = false, className }: SidebarUserProps) {
  const navigate = useNavigate()
  const { isDark, setAppearance } = useTheme()
  const { displayName, email, isBootstrapping } = useCurrentUser()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const renderedName = displayName || (email ? email.split('@')[0] : '')

  return (
    <div className={cn('w-full', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="User profile and settings"
              className={cn(
                'flex items-center rounded-md text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/50 transition-colors',
                isCollapsed ? 'size-10 mx-auto justify-center p-0' : 'w-full justify-between p-1.5 gap-2'
              )}
            />
          }
        >
          <UserIdentity
            compact={isCollapsed}
            showEmail={!isCollapsed}
            showAvatar={true}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={isCollapsed ? 'start' : 'end'}
          side={isCollapsed ? 'right' : 'top'}
          sideOffset={8}
          className="w-56 rounded-md p-1.5 select-none"
        >
          <div className="p-2 pb-1.5 space-y-1">
            {isBootstrapping ? (
              <div className="h-3.5 w-28 bg-muted/80 animate-pulse rounded" />
            ) : (
              <p className="text-xs font-semibold text-foreground truncate">
                {renderedName}
              </p>
            )}
            {email && (
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {email}
              </p>
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
            onClick={() => setAppearance(isDark ? 'light' : 'dark')}
            className="text-xs gap-2 rounded-md"
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={15} />
            <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
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
  )
}
