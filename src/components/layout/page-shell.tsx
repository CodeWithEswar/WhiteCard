import React from 'react'
import { cn } from 'cn'

export interface PageShellProps {
  children: React.ReactNode
  header?: React.ReactNode
  maxWidth?: 'wide' | 'default' | 'reading'
  className?: string
}

const MAX_WIDTH_MAP = {
  wide: 'max-w-[1480px]',
  default: 'max-w-[1280px]',
  reading: 'max-w-[960px]',
}

export function PageShell({
  children,
  header,
  maxWidth = 'default',
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 space-y-6 sm:space-y-8',
        MAX_WIDTH_MAP[maxWidth],
        className
      )}
    >
      {header && <div className="space-y-3">{header}</div>}
      <div className="w-full">{children}</div>
    </div>
  )
}
