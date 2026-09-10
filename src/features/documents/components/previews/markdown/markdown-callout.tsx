import React from 'react'
import {
  InformationCircleIcon,
  CheckmarkBadge01Icon,
  AlertCircleIcon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { cn } from '@/lib/utils'
import type { MarkdownCalloutType } from '@/features/documents/lib/markdown/markdown-types'

interface MarkdownCalloutProps {
  type: MarkdownCalloutType
  children: React.ReactNode
  className?: string
}

const CALLOUT_CONFIG: Record<
  MarkdownCalloutType,
  {
    label: string
    icon: any
    containerClass: string
    iconClass: string
    titleClass: string
  }
> = {
  note: {
    label: 'Note',
    icon: InformationCircleIcon,
    containerClass: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/40 dark:border-blue-400/40 text-blue-950 dark:text-blue-100',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-700 dark:text-blue-300',
  },
  tip: {
    label: 'Tip',
    icon: CheckmarkBadge01Icon,
    containerClass: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/40 dark:border-emerald-400/40 text-emerald-950 dark:text-emerald-100',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    titleClass: 'text-emerald-700 dark:text-emerald-300',
  },
  important: {
    label: 'Important',
    icon: InformationCircleIcon,
    containerClass: 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/40 dark:border-violet-400/40 text-violet-950 dark:text-violet-100',
    iconClass: 'text-violet-600 dark:text-violet-400',
    titleClass: 'text-violet-700 dark:text-violet-300',
  },
  warning: {
    label: 'Warning',
    icon: AlertCircleIcon,
    containerClass: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 dark:border-amber-400/40 text-amber-950 dark:text-amber-100',
    iconClass: 'text-amber-600 dark:text-amber-400',
    titleClass: 'text-amber-700 dark:text-amber-300',
  },
  caution: {
    label: 'Caution',
    icon: AlertCircleIcon,
    containerClass: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/40 dark:border-rose-400/40 text-rose-950 dark:text-rose-100',
    iconClass: 'text-rose-600 dark:text-rose-400',
    titleClass: 'text-rose-700 dark:text-rose-300',
  },
}

export function MarkdownCallout({ type, children, className }: MarkdownCalloutProps) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.note

  return (
    <aside
      aria-label={config.label}
      className={cn(
        'my-4 p-3.5 rounded-xl border-l-4 border text-xs leading-relaxed',
        config.containerClass,
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider mb-1.5">
        <AppIcon icon={config.icon} size={15} className={config.iconClass} />
        <span className={config.titleClass}>{config.label}</span>
      </div>
      <div className="text-foreground/90 space-y-1.5 select-text [&>p]:m-0 [&>p]:leading-relaxed">
        {children}
      </div>
    </aside>
  )
}
