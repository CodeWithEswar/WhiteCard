import { Link, useNavigate } from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  Settings02Icon,
  Shield01Icon,
  Logout01Icon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import { useTheme } from "@/providers/theme-provider"
import { useAuth } from "@/features/auth/auth-provider"
import { getInitials } from "@/features/auth/hooks/use-profile"
import { cn } from "cn"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const { isDark, setAppearance } = useTheme()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={isCollapsed ? user.name : undefined}
                className={cn(
                  "aria-expanded:bg-muted",
                  isCollapsed ? "justify-center" : ""
                )}
              />
            }
          >
            <Avatar className="size-7 rounded-xl shrink-0">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="rounded-xl font-bold text-[11px] bg-sidebar-primary text-sidebar-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold text-foreground text-xs">{user.name}</span>
                  <span className="truncate text-[10.5px] text-muted-foreground font-mono">{user.email}</span>
                </div>
                <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto size-4 text-muted-foreground shrink-0" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1.5 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-xl">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="rounded-xl font-bold text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground text-xs">{user.name}</span>
                    <span className="truncate text-[10px] text-muted-foreground font-mono">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/app/settings')} className="text-xs gap-2">
                <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
                <span>Vault Settings & Themes</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAppearance(isDark ? 'light' : 'dark')}
                className="text-xs gap-2"
              >
                <HugeiconsIcon icon={isDark ? Sun01Icon : Moon02Icon} strokeWidth={2} />
                <span>{isDark ? 'Light' : 'Dark'} Appearance</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/government')} className="text-xs gap-2">
                <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />
                <span>Security Overview</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs gap-2 text-destructive hover:text-destructive focus:text-destructive"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
