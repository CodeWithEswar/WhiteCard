import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import type { BreadcrumbSegment } from '@/lib/navigation/build-breadcrumbs'

interface BreadcrumbSegmentItemProps {
  segment: BreadcrumbSegment
  className?: string
}

export function BreadcrumbSegmentItem({
  segment,
  className,
}: BreadcrumbSegmentItemProps) {
  if (segment.isCurrent || !segment.href) {
    return (
      <span
        aria-current="page"
        className={cn(
          'text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-[240px] select-none',
          className
        )}
      >
        {segment.label}
      </span>
    )
  }

  return (
    <Link
      to={segment.href}
      className={cn(
        'text-xs font-normal text-muted-foreground hover:text-foreground transition-colors truncate max-w-[140px] sm:max-w-[180px] outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-xs select-none',
        className
      )}
    >
      {segment.label}
    </Link>
  )
}
