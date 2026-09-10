import React from 'react'
import { cn } from 'cn'

export interface PageHeaderActionsProps {
  primary?: React.ReactNode
  secondary?: React.ReactNode
  overflow?: React.ReactNode
  className?: string
}

export function PageHeaderActions({
  primary,
  secondary,
  overflow,
  className,
}: PageHeaderActionsProps) {
  if (!primary && !secondary && !overflow) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-start sm:self-auto',
        className
      )}
    >
      {secondary}
      {overflow}
      {primary}
    </div>
  )
}
