import React from 'react'
import { cn } from '@/lib/utils'

export function MarkdownKbd({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 rounded-md border border-border/80 bg-muted/80 text-foreground font-mono text-[11px] font-semibold shadow-2xs select-none align-middle mx-0.5',
        className
      )}
    >
      {children}
    </kbd>
  )
}
