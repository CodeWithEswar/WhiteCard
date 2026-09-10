import React from 'react'
import { cn } from '@/lib/utils'

interface MarkdownTableProps {
  children?: React.ReactNode
  className?: string
}

export function MarkdownTable({ children, className }: MarkdownTableProps) {
  return (
    <div className="my-5 w-full overflow-x-auto rounded-xl border border-border/70 shadow-2xs">
      <table className={cn('w-full text-xs text-left border-collapse', className)}>
        {children}
      </table>
    </div>
  )
}

export function MarkdownTableHead({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <thead className={cn('bg-muted/50 text-foreground font-semibold border-b border-border/70', className)}>
      {children}
    </thead>
  )
}

export function MarkdownTableBody({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <tbody className={cn('divide-y divide-border/50 text-foreground', className)}>
      {children}
    </tbody>
  )
}

export function MarkdownTableRow({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <tr className={cn('hover:bg-muted/30 transition-colors', className)}>
      {children}
    </tr>
  )
}

export function MarkdownTableCell({
  isHeader,
  align,
  children,
  className,
}: {
  isHeader?: boolean
  align?: 'left' | 'center' | 'right' | null
  children?: React.ReactNode
  className?: string
}) {
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  if (isHeader) {
    return (
      <th
        className={cn(
          'p-2.5 font-semibold text-foreground border-r border-border/60 last:border-r-0 whitespace-nowrap',
          alignClass,
          className
        )}
      >
        {children}
      </th>
    )
  }

  return (
    <td
      className={cn(
        'p-2.5 text-foreground border-r border-border/50 last:border-r-0',
        alignClass,
        className
      )}
    >
      {children}
    </td>
  )
}
