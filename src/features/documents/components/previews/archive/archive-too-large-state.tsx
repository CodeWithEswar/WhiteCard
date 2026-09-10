import { Shield01Icon, Download01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface ArchiveTooLargeStateProps {
  onDownloadOriginal?: () => void
}

export function ArchiveTooLargeState({
  onDownloadOriginal,
}: ArchiveTooLargeStateProps) {
  return (
    <div className="w-full flex-1 flex items-center justify-center p-6 text-center select-none">
      <div className="max-w-md p-8 rounded-3xl border border-border/80 bg-surface shadow-xs space-y-4">
        <div className="size-14 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-2xs">
          <AppIcon icon={Shield01Icon} size={26} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Archive Inspection Limit
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            This archive is too large or complex to inspect safely in the browser. The original ZIP is intact and ready for download.
          </p>
        </div>

        {onDownloadOriginal && (
          <div className="pt-2">
            <Button
              size="sm"
              onClick={onDownloadOriginal}
              className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download Original</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
