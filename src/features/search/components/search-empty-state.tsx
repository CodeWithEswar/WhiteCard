import { Files01Icon, Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface SearchEmptyStateProps {
  onOpenUpload: () => void
}

export function SearchEmptyState({ onOpenUpload }: SearchEmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-14 rounded-2xl border border-dashed border-border/80 bg-surface/60 text-center select-none overflow-hidden my-4">
      {/* Background Architectural Grid Fragment */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15 mask-radial"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md space-y-4">
        <div className="flex items-center justify-center size-14 rounded-2xl border border-border bg-surface-muted shadow-2xs text-muted-foreground">
          <AppIcon icon={Files01Icon} size={24} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
            Your vault is ready to search
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Upload your first government document or student certificate and it will appear here immediately.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={onOpenUpload}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-1.5 shadow-xs"
          >
            <AppIcon icon={Upload01Icon} size={15} />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
