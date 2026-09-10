import { Sun01Icon, Moon02Icon, ComputerIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { useTheme } from '../../../providers/theme-provider'
import type { AppearanceMode } from '../../../types/theme'

export function AuthThemeControl() {
  const { appearance, setAppearance, isDark } = useTheme()

  const modes: { id: AppearanceMode; label: string; icon: typeof Sun01Icon }[] = [
    { id: 'light', label: 'Light', icon: Sun01Icon },
    { id: 'dark', label: 'Dark', icon: Moon02Icon },
    { id: 'system', label: 'System', icon: ComputerIcon },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
            aria-label="Change appearance mode"
          >
            <AppIcon icon={isDark ? Sun01Icon : Moon02Icon} size={16} />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Appearance
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {modes.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onClick={() => setAppearance(m.id)}
            className={`flex items-center justify-between text-xs cursor-pointer ${appearance === m.id ? 'font-semibold text-foreground bg-muted' : ''
              }`}
          >
            <span className="flex items-center gap-2">
              <AppIcon icon={m.icon} size={14} />
              {m.label}
            </span>
            {appearance === m.id && (
              <span className="text-[10px] text-primary">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
