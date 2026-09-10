import React from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { DesktopPageHeader } from './desktop-page-header'
import { MobilePageHeader } from './mobile-page-header'
import type { BreadcrumbSegment, DocumentBreadcrumbMeta } from '@/lib/navigation/build-breadcrumbs'

export interface ResponsivePageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: BreadcrumbSegment[]
  documentMeta?: DocumentBreadcrumbMeta
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  overflowAction?: React.ReactNode
  metadata?: React.ReactNode
  icon?: IconSvgElement
  compact?: boolean
  className?: string
}

export function ResponsivePageHeader(props: ResponsivePageHeaderProps) {
  return (
    <>
      {/* Desktop / Tablet Header (>= 768px) */}
      <div className="hidden md:block">
        <DesktopPageHeader {...props} />
      </div>

      {/* Mobile Header (< 768px) */}
      <div className="block md:hidden">
        <MobilePageHeader {...props} />
      </div>
    </>
  )
}
