import React from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { PageTitleRow } from './page-title-row'
import { PageSubtitle } from './page-subtitle'
import { PageHeaderActions } from './page-header-actions'
import { cn } from 'cn'

export interface MobilePageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  overflowAction?: React.ReactNode
  metadata?: React.ReactNode
  icon?: IconSvgElement
  className?: string
}

export function MobilePageHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryActions,
  overflowAction,
  metadata,
  icon,
  className,
}: MobilePageHeaderProps) {
  return (
    <header className={cn('space-y-3', className)}>
      {/* Title & Context */}
      <PageTitleRow eyebrow={eyebrow} title={title} icon={icon} />

      {/* Subtitle */}
      {description && <PageSubtitle>{description}</PageSubtitle>}

      {/* Primary and Secondary Actions */}
      {(primaryAction || secondaryActions || overflowAction) && (
        <div className="space-y-2 pt-1">
          {primaryAction && <div className="w-full sm:w-auto">{primaryAction}</div>}
          {(secondaryActions || overflowAction) && (
            <PageHeaderActions
              secondary={secondaryActions}
              overflow={overflowAction}
              className="w-full justify-start"
            />
          )}
        </div>
      )}

      {/* Metadata */}
      {metadata}
    </header>
  )
}
