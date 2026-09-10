import React from 'react'
import {
  Passport01Icon,
  Certificate01Icon,
  Search01Icon,
  Upload01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'

type EmptyStateType = 'government' | 'student' | 'search' | 'generic'

interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  let defaultIcon = File01Icon
  let defaultTitle = 'No documents yet'
  let defaultDesc = 'Get started by adding your first important document to White Card.'
  let defaultAction = 'Upload Document'

  if (type === 'government') {
    defaultIcon = Passport01Icon
    defaultTitle = 'Government documents vault'
    defaultDesc =
      'Your government documents will appear here. Store IDs, licences, insurance and other records securely.'
    defaultAction = 'Upload Government Document'
  } else if (type === 'student') {
    defaultIcon = Certificate01Icon
    defaultTitle = 'Student certificates vault'
    defaultDesc =
      'Your certificates will appear here. Keep marksheets, degrees and course certificates organized.'
    defaultAction = 'Upload Certificate'
  } else if (type === 'search') {
    defaultIcon = Search01Icon
    defaultTitle = 'No documents matched'
    defaultDesc =
      'We could not find any files matching your search query or selected filters. Try broadening your criteria.'
    defaultAction = 'Clear Search'
  }

  const finalTitle = title || defaultTitle
  const finalDesc = description || defaultDesc
  const finalAction = actionLabel || defaultAction

  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-md border border-border/70 bg-surface/40 backdrop-blur-sm overflow-hidden min-h-[300px] ${className}`}
    >
      {/* Local subtle dotted field */}
      <div
        className="absolute inset-0 pattern-dots mask-radial opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Tactile Icon Container */}
      <div className="relative mb-4 flex items-center justify-center size-14 rounded-md border border-border bg-surface-muted/90 shadow-2xs">
        <AppIcon icon={defaultIcon} size={26} className="text-foreground" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight max-w-md">
        {finalTitle}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
        {finalDesc}
      </p>

      {onAction && (
        <div className="mt-6 relative z-10">
          <Button
            onClick={onAction}
            className="h-10 px-4 rounded-md font-medium text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs active:scale-[0.985]"
          >
            <AppIcon icon={Upload01Icon} size={16} />
            {finalAction}
          </Button>
        </div>
      )}
    </div>
  )
}
