import React from 'react'
import {
  ResponsivePageHeader,
  type ResponsivePageHeaderProps,
} from './responsive-page-header'

export { ResponsivePageHeader, type ResponsivePageHeaderProps }

export interface LegacyPageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  badge,
  actions,
  className,
}: LegacyPageHeaderProps) {
  return (
    <ResponsivePageHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      primaryAction={actions}
      metadata={badge}
      className={className}
    />
  )
}
