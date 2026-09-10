import React from 'react'
import { MarkdownBrandIcon } from './markdown-brand-icon'
import { cn } from '@/lib/utils'

export type MarkdownBadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

interface MarkdownBadgeProps {
  label: string
  brand?: string
  variant?: MarkdownBadgeVariant
  className?: string
  children?: React.ReactNode
}

const VARIANT_CLASSES: Record<MarkdownBadgeVariant, string> = {
  neutral: 'bg-muted/70 text-foreground border-border/70',
  brand: 'bg-muted/60 text-foreground border-border/80',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
}

export function MarkdownBadge({
  label,
  brand,
  variant = 'neutral',
  className,
  children,
}: MarkdownBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium shadow-2xs select-none transition-colors align-middle my-0.5 mr-1.5',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {brand && <MarkdownBrandIcon brand={brand} size={14} />}
      <span>{children || label}</span>
    </span>
  )
}
