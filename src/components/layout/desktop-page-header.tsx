import React from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { PageBreadcrumbs } from './page-breadcrumbs'
import { PageTitleRow } from './page-title-row'
import { PageSubtitle } from './page-subtitle'
import { PageHeaderActions } from './page-header-actions'
import type { BreadcrumbSegment, DocumentBreadcrumbMeta } from '@/lib/navigation/build-breadcrumbs'
import { cn } from 'cn'

export interface DesktopPageHeaderProps {
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
  className?: string
}

export function DesktopPageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  documentMeta,
  primaryAction,
  secondaryActions,
  overflowAction,
  metadata,
  icon,
  className,
}: DesktopPageHeaderProps) {
  return (
    <header className={cn('space-y-3.5', className)}>
      {/* 1. Breadcrumbs */}
      <PageBreadcrumbs customSegments={breadcrumb} documentMeta={documentMeta} />

      {/* 2. Title Row & Actions */}
      <PageTitleRow
        eyebrow={eyebrow}
        title={title}
        icon={icon}
        actions={
          <PageHeaderActions
            primary={primaryAction}
            secondary={secondaryActions}
            overflow={overflowAction}
          />
        }
      />

      {/* 3. Description & Metadata */}
      {(description || metadata) && (
        <div className="space-y-1.5 pt-0.5">
          <PageSubtitle>{description}</PageSubtitle>
          {metadata}
        </div>
      )}
    </header>
  )
}
