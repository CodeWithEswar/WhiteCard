import { Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface SearchVaultHeaderProps {
  onOpenUpload: () => void
}

export function SearchVaultHeader({ onOpenUpload }: SearchVaultHeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between gap-4 pt-1 pb-4 select-none">
      <div className="space-y-0.5 min-w-0 flex-1">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase block">
          Vault / Search
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground truncate">
          Search Vault
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          Find any document in your White Card.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={onOpenUpload}
          variant="outline"
          size="sm"
          className="h-9 px-3 sm:px-3.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-all shrink-0"
        >
          <AppIcon icon={Upload01Icon} size={14} className="text-primary" />
          <span>Upload Document</span>
        </Button>
      </div>
    </header>
  )
}
