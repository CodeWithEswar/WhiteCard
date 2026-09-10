import { Tag01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'

interface DocumentTagListProps {
  tags: string[]
  className?: string
}

export function DocumentTagList({ tags, className = '' }: DocumentTagListProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic py-1">
        No tags assigned
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-border/70 bg-muted/50 text-foreground shadow-2xs"
        >
          <AppIcon icon={Tag01Icon} size={11} className="text-muted-foreground" />
          <span>{tag}</span>
        </span>
      ))}
    </div>
  )
}
