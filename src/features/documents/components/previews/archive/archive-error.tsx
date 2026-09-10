import {
  LockKeyIcon,
  Alert02Icon,
  Download01Icon,
  RefreshIcon,
  Zip01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { ArchiveErrorKind } from '@/features/documents/hooks/use-archive-preview'

export interface ArchiveErrorProps {
  errorKind: ArchiveErrorKind
  onRetry?: () => void
  onDownloadOriginal?: () => void
}

export function ArchiveError({
  errorKind,
  onRetry,
  onDownloadOriginal,
}: ArchiveErrorProps) {
  const isEncrypted = errorKind === 'ENCRYPTED'
  const isCorrupted = errorKind === 'CORRUPTED'

  return (
    <div className="w-full flex-1 flex items-center justify-center p-6 text-center select-none">
      <div className="max-w-md p-8 rounded-3xl border border-border/80 bg-surface shadow-xs space-y-4">
        <div className="size-14 rounded-2xl border border-border bg-surface-muted flex items-center justify-center mx-auto text-foreground shadow-2xs">
          <AppIcon
            icon={isEncrypted ? LockKeyIcon : isCorrupted ? Alert02Icon : Zip01Icon}
            size={26}
            className={isEncrypted ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}
          />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {isEncrypted
              ? 'Password-Protected Archive'
              : isCorrupted
              ? 'Archive Read Error'
              : "Couldn't Inspect Archive"}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {isEncrypted
              ? "This archive is password protected. White Card can safely store and download it, but cannot preview its encrypted contents."
              : isCorrupted
              ? "This archive couldn't be read completely. The original file is intact and available for download."
              : "We couldn't inspect this archive's structure. The original file is still available."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {onRetry && !isEncrypted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-9 px-3.5 rounded-xl text-xs gap-1.5 shadow-2xs"
            >
              <AppIcon icon={RefreshIcon} size={14} />
              <span>Try Again</span>
            </Button>
          )}

          {onDownloadOriginal && (
            <Button
              size="sm"
              onClick={onDownloadOriginal}
              className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
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
