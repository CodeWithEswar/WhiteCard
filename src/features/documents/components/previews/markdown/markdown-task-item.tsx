import React from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'

interface MarkdownTaskItemProps {
  checked?: boolean
  children?: React.ReactNode
  className?: string
}

export function MarkdownTaskItem({
  checked = false,
  children,
  className,
}: MarkdownTaskItemProps) {
  return (
    <li className={cn('flex items-start gap-2.5 my-1.5 list-none -ml-4', className)}>
      <span
        className={cn(
          'size-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 select-none transition-colors',
          checked
            ? 'bg-primary border-primary text-primary-foreground shadow-2xs'
            : 'border-border/80 bg-muted/40 text-transparent'
        )}
        aria-hidden="true"
      >
        {checked && <AppIcon icon={Tick02Icon} size={12} strokeWidth={2.5} />}
      </span>
      <div className={cn('text-xs select-text leading-relaxed', checked && 'text-muted-foreground')}>
        {children}
      </div>
    </li>
  )
}
