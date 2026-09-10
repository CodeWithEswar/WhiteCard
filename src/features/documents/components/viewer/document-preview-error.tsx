import { AlertCircleIcon, RefreshIcon, Download01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

interface DocumentPreviewErrorProps {
  onRetry?: () => void
  onDownload?: () => void
}

export function DocumentPreviewError({
  onRetry,
  onDownload,
}: DocumentPreviewErrorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-4 shadow-sm">
        <div className="size-14 rounded-2xl border border-border bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AppIcon icon={AlertCircleIcon} size={28} />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            We couldn't render this preview
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The original document remains safely preserved in your vault. You can try reloading the preview or download the file directly.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="h-9 px-4 rounded-xl text-xs gap-1.5"
            >
              <AppIcon icon={RefreshIcon} size={14} />
              <span>Try Again</span>
            </Button>
          )}

          {onDownload && (
            <Button
              size="sm"
              onClick={onDownload}
              className="h-9 px-4 rounded-xl text-xs gap-1.5 shadow-xs"
            >
              <AppIcon icon={Download01Icon} size={14} />
              <span>Download Original</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
