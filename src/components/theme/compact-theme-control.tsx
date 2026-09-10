import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PaintBoardIcon, Settings02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { AppearanceSwitcher } from './appearance-switcher'
import { ThemePreviewGrid } from './theme-preview-grid'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from 'cn'

interface CompactThemeControlProps {
  className?: string
}

export function CompactThemeControl({ className }: CompactThemeControlProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const triggerButton = (
    <button
      type="button"
      aria-label="Change appearance and color theme"
      className={cn(
        'size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0',
        open && 'bg-muted/60 text-foreground',
        className
      )}
    >
      <AppIcon icon={PaintBoardIcon} size={17} />
    </button>
  )

  const content = (
    <div className="space-y-4">
      {/* 1. Appearance Mode */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground select-none">
          Appearance
        </div>
        <AppearanceSwitcher size="sm" />
      </div>

      {/* 2. Theme Presets (2-column compact grid) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground select-none">
          <span>Theme Preset</span>
          <span className="text-[10px] text-muted-foreground/80 font-normal">10 Presets</span>
        </div>
        <ThemePreviewGrid compact={true} columns={2} />
      </div>

      {/* 3. Link to Full Settings */}
      <div className="pt-2 border-t border-border/70 flex items-center justify-between">
        <Link
          to="/app/settings"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <AppIcon icon={Settings02Icon} size={14} />
          <span>Full Theme Settings</span>
        </Link>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={triggerButton} />
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-2xl p-5 border-t border-border bg-popover select-none overflow-y-auto"
        >
          <SheetHeader className="p-0 pb-3 border-b border-border/60">
            <SheetTitle className="text-sm font-semibold text-foreground">
              Appearance & Themes
            </SheetTitle>
          </SheetHeader>
          <div className="pt-4">{content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={triggerButton} />
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[340px] p-4 rounded-xl shadow-lg border border-border/80 bg-popover select-none"
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}
