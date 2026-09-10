import { File01Icon, Download01Icon, ShieldCheckIcon, LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { VaultDocument } from '@/types/document'

interface GenericFilePreviewProps {
  document: VaultDocument
  fileUrl?: string | null
  onDownload?: () => void
}

export function GenericFilePreview({
  document: doc,
  fileUrl,
  onDownload,
}: GenericFilePreviewProps) {
  const ext = doc.originalFilename.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto flex items-center justify-center p-4 sm:p-6 text-center">
      <div className="max-w-md w-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-5 sm:space-y-6 shadow-sm">
        <div className="size-20 rounded-3xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground shadow-2xs">
          <AppIcon icon={File01Icon} size={36} />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted border border-border/70 text-foreground">
            {ext} Binary Record
          </span>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {doc.originalFilename} • {doc.sizeFormatted}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground leading-relaxed text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <AppIcon icon={ShieldCheckIcon} size={14} className="text-emerald-500" />
            <span>Preserved Intact</span>
          </div>
          <p>
            This file format cannot be rendered inline safely without exposing private data. The original document is encrypted, isolated to your account, and ready for authentic download.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {fileUrl && fileUrl !== '#' && (
            <Button
              size="sm"
              variant="outline"
              render={
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="h-9 px-4 rounded-xl text-xs gap-1.5 border-border/80"
                />
              }
            >
              <AppIcon icon={LinkSquare02Icon} size={13} />
              <span>Open External</span>
            </Button>
          )}

          {onDownload && (
            <Button
              size="sm"
              onClick={onDownload}
              className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
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
