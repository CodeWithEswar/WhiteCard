import React from 'react'
import { Alert02Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../icons/app-icon'
import { Button } from '../ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = "We couldn't load your documents",
  description = "Please check your network connection and try again. Your vault data remains completely safe.",
  onRetry,
  retryLabel = "Try Again",
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm overflow-hidden min-h-[280px] ${className}`}
    >
      <div className="mb-4 flex items-center justify-center size-12 rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-sm">
        <AppIcon icon={Alert02Icon} size={24} />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight max-w-md">
        {title}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button
            onClick={onRetry}
            variant="outline"
            className="h-9 px-4 rounded-xl font-medium text-xs gap-2 border-border hover:bg-surface-muted transition-all active:scale-[0.985]"
          >
            <AppIcon icon={RefreshIcon} size={15} />
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
