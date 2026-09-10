import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { NavigationItem } from '@/config/navigation'
import { isChildRouteActive } from '@/lib/navigation/is-route-active'
import { cn } from 'cn'

interface TabletNavFlyoutProps {
  item: NavigationItem
  trigger: React.ReactElement
}

export function TabletNavFlyout({ item, trigger }: TabletNavFlyoutProps) {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  if (!item.children || item.children.length === 0) {
    return trigger
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-56 p-2 rounded-xl bg-popover/95 backdrop-blur-md border border-border shadow-md select-none"
      >
        <div className="px-2 py-1.5 border-b border-border/70 flex items-center justify-between">
          <Link
            to={item.href}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-foreground hover:underline"
          >
            {item.label}
          </Link>
          <span className="text-[10px] text-muted-foreground font-mono">Space</span>
        </div>

        <div className="pt-1.5 space-y-0.5">
          {item.children.map((child) => {
            const isChildActive = isChildRouteActive(child, location.pathname, searchParams)
            return (
              <Link
                key={child.id}
                to={child.href}
                onClick={() => setOpen(false)}
                aria-current={isChildActive ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors',
                  isChildActive
                    ? 'font-semibold text-foreground bg-muted/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-normal'
                )}
              >
                <span className="truncate">{child.label}</span>
                {isChildActive && (
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                )}
              </Link>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
