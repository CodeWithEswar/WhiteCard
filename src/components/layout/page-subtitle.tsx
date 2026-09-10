import React from 'react'
import { cn } from 'cn'

interface PageSubtitleProps {
  children: React.ReactNode
  className?: string
}

export function PageSubtitle({ children, className }: PageSubtitleProps) {
  if (!children) return null
  return (
    <p
      className={cn(
        'text-xs sm:text-sm text-muted-foreground max-w-[680px] leading-relaxed',
        className
      )}
    >
      {children}
    </p>
  )
}
