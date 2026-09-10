import { Zip01Icon, Download01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

export interface ArchiveHeaderProps {
  archiveName: string
  totalFiles: number
  totalDirs: number
  uncompressedSize: string
  compressedSize?: string
  onDownloadOriginal?: () => void
}

export function ArchiveHeader({
  archiveName,
  totalFiles,
  totalDirs,
  uncompressedSize,
  compressedSize,
  onDownloadOriginal,
}: ArchiveHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border/70 bg-surface-muted/30 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-10 rounded-xl border border-border/80 bg-surface flex items-center justify-center shrink-0 text-foreground shadow-2xs">
          <AppIcon icon={Zip01Icon} size={20} />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
            {archiveName}
          </h2>
          <p className="text-xs text-muted-foreground font-mono truncate">
            <span>{totalFiles} files</span>
            <span className="mx-1.5 text-border-strong">•</span>
            <span>{totalDirs} folders</span>
            <span className="mx-1.5 text-border-strong">•</span>
            <span>{uncompressedSize} uncompressed</span>
            {compressedSize && (
              <>
                <span className="mx-1.5 text-border-strong">•</span>
                <span className="opacity-80">({compressedSize} zip)</span>
              </>
            )}
          </p>
        </div>
      </div>

      {onDownloadOriginal && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadOriginal}
          className="h-8 px-3 rounded-xl border-border bg-surface hover:bg-surface-elevated text-xs font-medium gap-1.5 shadow-2xs self-start sm:self-auto shrink-0"
        >
          <AppIcon icon={Download01Icon} size={14} className="text-primary" />
          <span>Download Archive</span>
        </Button>
      )}
    </div>
  )
}
