import { Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface SearchVaultHeaderProps {
  onOpenUpload: () => void
}

export function SearchVaultHeader({ onOpenUpload }: SearchVaultHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-4 select-none">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Vault / Search
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Search Vault
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
          Find anything in your White Card by title, filename, category, tag, or document type.
        </p>
        <p className="text-xs text-muted-foreground sm:hidden">
          Find any document in your White Card.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Button
          onClick={onOpenUpload}
          variant="outline"
          size="sm"
          className="h-9 px-3.5 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium text-foreground gap-1.5 shadow-2xs hover:border-border-strong transition-all"
        >
          <AppIcon icon={Upload01Icon} size={14} className="text-primary" />
          <span>Upload Document</span>
        </Button>
      </div>
    </header>
  )
}
