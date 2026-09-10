import {
  Download01Icon,
  Zip01Icon,
  Table01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/files/format-bytes'
import type { VaultDocument } from '@/types/document'

interface UnsupportedPreviewStateProps {
  document: VaultDocument
  onDownload: () => void
}

export function UnsupportedPreviewState({
  document: doc,
  onDownload,
}: UnsupportedPreviewStateProps) {
  const isZip = doc.fileType === 'zip'
  const isSheet = doc.fileType === 'sheet'
  const isDoc = doc.fileType === 'doc'

  const icon = isZip ? Zip01Icon : isSheet ? Table01Icon : File01Icon
  const typeLabel = isZip
    ? 'Archive Package (ZIP)'
    : isSheet
    ? 'Spreadsheet Document'
    : isDoc
    ? 'Office Document'
    : 'Binary Document'

  const reason = isZip
    ? 'Direct browser preview is not available for archive bundles. The compressed archive is preserved with full integrity.'
    : 'Direct browser preview is not available for this office document format. You can download the original file to open it in your desktop application.'

  return (
    <div className="p-8 sm:p-12 rounded-2xl border border-border/80 bg-muted/15 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
      <div className="size-16 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-center text-foreground">
        <AppIcon icon={icon} size={28} />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {typeLabel}
        </span>
        <h3 className="text-base font-bold text-foreground tracking-tight">
          {doc.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {reason}
        </p>
      </div>

      <div className="p-3 rounded-xl border border-border/70 bg-card/70 w-full flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span className="truncate max-w-[200px] text-foreground font-sans font-medium" title={doc.originalFilename}>
          {doc.originalFilename}
        </span>
        <span>{formatBytes(doc.sizeBytes)}</span>
      </div>

      <Button
        onClick={onDownload}
        className="w-full h-10 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
      >
        <AppIcon icon={Download01Icon} size={15} />
        <span>Download Original File</span>
      </Button>
    </div>
  )
}
