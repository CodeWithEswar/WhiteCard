import React from 'react'
import { cn } from 'cn'

export interface PageHeaderMetaProps {
  count?: number
  countLabel?: string
  formattedSize?: string
  updatedAt?: string
  badge?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeaderMeta({
  count,
  countLabel = 'documents',
  formattedSize,
  updatedAt,
  badge,
  children,
  className,
}: PageHeaderMetaProps) {
  const items: React.ReactNode[] = []

  if (typeof count === 'number') {
    items.push(
      <span key="count" className="font-medium text-foreground">
        {count} {count === 1 ? countLabel.replace(/s$/, '') : countLabel}
      </span>
    )
  }

  if (formattedSize) {
    items.push(<span key="size">{formattedSize}</span>)
  }

  if (updatedAt) {
    items.push(<span key="updated">{updatedAt}</span>)
  }

  if (items.length === 0 && !badge && !children) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 text-xs text-muted-foreground select-none pt-1',
        className
      )}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="opacity-40">•</span>}
          {item}
        </React.Fragment>
      ))}
      {badge && <div className="ml-1">{badge}</div>}
      {children}
    </div>
  )
}
