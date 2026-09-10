import React from 'react'
import { useIsMobile } from '../../hooks/use-mobile'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../ui/sheet'

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  contentClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className = '',
  contentClassName = '',
  maxWidth = 'lg',
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile()

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={`max-h-[92vh] rounded-t-[24px] border-t border-border bg-surface p-0 flex flex-col focus:outline-none ${className}`}
        >
          {/* Native mobile drag indicator notch */}
          <div className="pt-3 pb-1 flex justify-center shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-border-strong/70" />
          </div>

          {(title || description) && (
            <SheetHeader className="px-6 py-3 border-b border-border/60 text-left shrink-0">
              {title && (
                <SheetTitle className="text-base font-semibold text-foreground tracking-tight">
                  {title}
                </SheetTitle>
              )}
              {description && (
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
          )}

          <div className={`p-6 overflow-y-auto flex-1 ${contentClassName}`}>
            {children}
          </div>

          {footer && (
            <SheetFooter className="p-4 px-6 border-t border-border/60 bg-surface-muted/40 shrink-0 flex flex-col gap-2">
              {footer}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`rounded-2xl border border-border/80 bg-surface shadow-2xl p-0 overflow-hidden ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {(title || description) && (
          <DialogHeader className="p-6 pb-4 border-b border-border/60 text-left">
            {title && (
              <DialogTitle className="text-lg font-semibold text-foreground tracking-tight">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={`p-6 max-h-[75vh] overflow-y-auto ${contentClassName}`}>
          {children}
        </div>

        {footer && (
          <DialogFooter className="p-4 px-6 border-t border-border/60 bg-surface-muted/30 flex items-center justify-end gap-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
