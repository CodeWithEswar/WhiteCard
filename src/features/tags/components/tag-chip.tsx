import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { resolveTagColor } from '@/config/tag-colors'

export type TagVariant = 'default' | 'compact' | 'filter' | 'selected'

interface TagChipProps {
  label: string
  variant?: TagVariant
  colorDot?: string
  removable?: boolean
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export function TagChip({
  label,
  variant = 'default',
  colorDot,
  removable = false,
  onRemove,
  onClick,
  className = '',
}: TagChipProps) {
  const tagConfig = resolveTagColor(label)
  const dotColorClass = colorDot || tagConfig.dot

  const baseStyles =
    'inline-flex items-center gap-1.5 rounded-full font-medium transition-all select-none'

  const variantStyles = {
    default:
      `px-2.5 py-0.5 text-[11px] ${tagConfig.bg} ${tagConfig.text} border ${tagConfig.border}`,
    compact:
      `px-2 py-0.5 text-[10px] ${tagConfig.bg} ${tagConfig.text} border ${tagConfig.border}`,
    filter:
      'px-3 py-1 text-xs bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border-strong cursor-pointer active:scale-95',
    selected:
      'px-3 py-1 text-xs bg-accent/15 text-foreground font-semibold border border-accent/40 shadow-xs cursor-pointer',
  }

  const isInteractive = Boolean(onClick)

  return (
    <span
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={`${baseStyles} ${variantStyles[variant]} ${
        isInteractive ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
    >
      <span
        className={`size-1.5 rounded-full shrink-0 ${dotColorClass}`}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
      {removable && onRemove && (
        <button
          type="button"
          aria-label={`Remove tag ${label}`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10"
        >
          <AppIcon icon={Cancel01Icon} size={11} />
        </button>
      )}
    </span>
  )
}

