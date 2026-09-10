import {
  Passport01Icon,
  Certificate01Icon,
  ZipIcon,
  SparklesIcon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { StorageInsight } from '../storage.types'

interface StorageInsightStripProps {
  insights: StorageInsight[]
}

export function StorageInsightStrip({ insights }: StorageInsightStripProps) {
  if (!insights.length) {
    return null
  }

  const getIcon = (type: StorageInsight['iconType']) => {
    switch (type) {
      case 'government':
        return Passport01Icon
      case 'student':
        return Certificate01Icon
      case 'archive':
        return ZipIcon
      case 'warning':
        return InformationCircleIcon
      default:
        return SparklesIcon
    }
  }

  const getColorClass = (type: StorageInsight['iconType']) => {
    switch (type) {
      case 'government':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'student':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
      case 'archive':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
      <div className="space-y-0.5">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Observations
        </div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          Storage Insights
        </h3>
        <p className="text-xs text-muted-foreground">
          Key patterns derived directly from your current vault documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {insights.map((insight) => {
          const IconComponent = getIcon(insight.iconType)
          const colorClass = getColorClass(insight.iconType)

          return (
            <div
              key={insight.id}
              className="p-4 rounded-xl border border-border/70 bg-muted/15 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                  <AppIcon icon={IconComponent} size={16} />
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
                  {insight.value}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground leading-snug">
                  {insight.title}
                </div>
                {insight.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
