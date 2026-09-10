import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface DocumentDetailsTriggerProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function DocumentDetailsTrigger({
  isOpen,
  onClick,
  className = '',
}: DocumentDetailsTriggerProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onClick}
            aria-label="Open document details"
            aria-pressed={isOpen}
            className={`size-9 rounded-xl transition-all duration-150 ${
              isOpen
                ? 'bg-primary/15 text-primary border-primary/40 shadow-xs'
                : 'border-border/70 bg-card/80 text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${className}`}
          />
        }
      >
        <AppIcon icon={InformationCircleIcon} size={17} />
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end">
        <span>Document Details</span>
        <span className="ml-1.5 text-[10px] font-mono text-muted-foreground">I</span>
      </TooltipContent>
    </Tooltip>
  )
}
