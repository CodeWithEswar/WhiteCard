import React from 'react'
import { cn } from '@/lib/utils'

interface MarkdownInlineCodeProps {
  children?: React.ReactNode
  className?: string
}

export function MarkdownInlineCode({ children, className }: MarkdownInlineCodeProps) {
  return (
    <code
      className={cn(
        'font-mono text-[0.875em] px-1.5 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/60 break-words select-text',
        className
      )}
    >
      {children}
    </code>
  )
}
