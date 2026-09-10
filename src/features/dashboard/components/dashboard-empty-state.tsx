import { Upload01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

interface DashboardEmptyStateProps {
  onUploadClick: () => void
}

export function DashboardEmptyState({ onUploadClick }: DashboardEmptyStateProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-border bg-card/60 text-center flex flex-col items-center justify-center space-y-3.5 my-2">
      <div className="size-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-foreground">
        <AppIcon icon={ShieldCheckIcon} size={24} />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Welcome to your White Card vault
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Store your official government identification documents and student certificates in one secure, private place.
        </p>
      </div>
      <Button
        onClick={onUploadClick}
        className="h-10 px-5 rounded-xl font-medium text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
      >
        <AppIcon icon={Upload01Icon} size={16} />
        <span>Upload your first document</span>
      </Button>
    </div>
  )
}
