import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'

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

// Allowed theme-safe dot tints
const TAG_COLOR_MAP: Record<string, string> = {
  Identity: 'bg-blue-500',
  Education: 'bg-indigo-500',
  Travel: 'bg-emerald-500',
  Vehicle: 'bg-amber-500',
  Renewal: 'bg-rose-500',
  Personal: 'bg-purple-500',
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
  const dotColorClass =
    colorDot || TAG_COLOR_MAP[label] || 'bg-muted-foreground'

  const baseStyles =
    'inline-flex items-center gap-1.5 rounded-full font-medium transition-all select-none'

  const variantStyles = {
    default:
      'px-2.5 py-0.5 text-[11px] bg-surface-muted/90 text-foreground/85 border border-border/80',
    compact:
      'px-2 py-0.5 text-[10px] bg-surface-muted/80 text-foreground/80 border border-border/60',
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
        isInteractive ? 'cursor-pointer hover:bg-surface-muted' : ''
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
