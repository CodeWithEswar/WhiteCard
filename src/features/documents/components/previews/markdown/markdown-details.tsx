import React from 'react'
import { cn } from '@/lib/utils'

export function MarkdownDetails({
  children,
  className,
  open,
}: {
  children?: React.ReactNode
  className?: string
  open?: boolean
}) {
  return (
    <details
      open={open}
      className={cn(
        'my-3 rounded-xl border border-border/70 bg-card/60 overflow-hidden text-xs transition-colors',
        className
      )}
    >
      {children}
    </details>
  )
}

export function MarkdownSummary({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <summary
      className={cn(
        'px-4 py-2.5 font-semibold text-foreground cursor-pointer select-none bg-muted/30 hover:bg-muted/50 border-b border-border/40 transition-colors list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden',
        className
      )}
    >
      <span className="text-muted-foreground text-xs select-none">▶</span>
      <span>{children}</span>
    </summary>
  )
}
