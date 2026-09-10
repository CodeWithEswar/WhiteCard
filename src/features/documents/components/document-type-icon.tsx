import {
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Table01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import type { DocumentFileType } from '../../../types/document'
import { AppIcon } from '../../../components/icons/app-icon'

interface DocumentTypeIconProps {
  type: DocumentFileType
  size?: number
  showBadge?: boolean
  className?: string
}

export function DocumentTypeIcon({
  type,
  size = 20,
  showBadge = true,
  className = '',
}: DocumentTypeIconProps) {
  let icon = File01Icon
  let badgeText = 'FILE'
  let colorClass = 'text-foreground'
  let bgClass = 'bg-surface-muted border-border/80'

  switch (type) {
    case 'pdf':
      icon = Pdf01Icon
      badgeText = 'PDF'
      colorClass = 'text-foreground'
      bgClass = 'bg-surface-muted/90 border-border'
      break
    case 'image':
      icon = Image01Icon
      badgeText = 'IMG'
      colorClass = 'text-foreground'
      bgClass = 'bg-surface-muted/90 border-border'
      break
    case 'zip':
      icon = Zip01Icon
      badgeText = 'ZIP'
      colorClass = 'text-foreground'
      bgClass = 'bg-surface-muted/90 border-border'
      break
    case 'sheet':
      icon = Table01Icon
      badgeText = 'SHEET'
      colorClass = 'text-foreground'
      bgClass = 'bg-surface-muted/90 border-border'
      break
    case 'doc':
      icon = File01Icon
      badgeText = 'DOC'
      colorClass = 'text-foreground'
      bgClass = 'bg-surface-muted/90 border-border'
      break
    default:
      icon = File01Icon
      badgeText = 'FILE'
      colorClass = 'text-muted-foreground'
      bgClass = 'bg-surface-muted border-border/70'
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border shrink-0 ${bgClass} ${colorClass} ${className}`}
    >
      <AppIcon icon={icon} size={size} />
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 text-[8.5px] font-mono font-semibold px-1 py-0.2 rounded bg-surface border border-border text-muted-foreground uppercase leading-none shadow-xs">
          {badgeText}
        </span>
      )}
    </div>
  )
}
