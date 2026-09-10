import { useState, useEffect } from 'react'
import { SidebarLeft01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { PageBreadcrumbs } from './page-breadcrumbs'
import { TopbarActions } from './topbar-actions'
import { useNavigationState } from '@/lib/navigation/navigation-state'
import { cn } from 'cn'

interface AppTopbarProps {
  onOpenUpload: () => void
}

export function AppTopbar({ onOpenUpload }: AppTopbarProps) {
  const { isCollapsed, toggleCollapsed } = useNavigationState()
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll listener for subtle opacity enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      aria-label="Desktop and tablet top command bar"
      className={cn(
        'h-[68px] px-4 sm:px-6 lg:px-8 sticky top-0 z-30 flex items-center justify-between select-none transition-all duration-200 ease-in-out',
        isScrolled
          ? 'bg-topbar-background backdrop-blur-xl border-b border-topbar-border shadow-2xs'
          : 'bg-topbar-background/80 backdrop-blur-md border-b border-topbar-border/70'
      )}
    >
      {/* Left: Sidebar Toggle + Space / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0 cursor-pointer"
          >
            <AppIcon
              icon={SidebarLeft01Icon}
              size={17}
              className={cn('transition-transform duration-200', isCollapsed ? 'rotate-180' : '')}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border/80 shrink-0" />

        {/* Semantic Contextual Breadcrumbs */}
        <PageBreadcrumbs />
      </div>

      {/* Right: Global Search Trigger + Quick Upload + Theme + Profile Menu */}
      <TopbarActions onOpenUpload={onOpenUpload} />
    </header>
  )
}
