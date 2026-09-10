import { File01Icon, Download01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import type { VaultDocument } from '@/types/document'

interface OfficeDocumentPreviewProps {
  document: VaultDocument
  onDownload?: () => void
}

export function OfficeDocumentPreview({
  document: doc,
  onDownload,
}: OfficeDocumentPreviewProps) {
  const isWord = doc.originalFilename.endsWith('.doc') || doc.originalFilename.endsWith('.docx')
  const isPresentation = doc.originalFilename.endsWith('.ppt') || doc.originalFilename.endsWith('.pptx')

  const formatLabel = isWord ? 'Word Document' : isPresentation ? 'Presentation' : 'Office Document'

  return (
    <div className="w-full h-full flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-6 shadow-sm">
        <div className="size-16 rounded-2xl border border-border bg-muted/40 flex items-center justify-center mx-auto text-foreground">
          <AppIcon icon={File01Icon} size={32} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted border border-border/70 text-foreground">
            {formatLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {doc.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {doc.originalFilename} • {doc.sizeFormatted}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground leading-relaxed text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <AppIcon icon={ShieldCheckIcon} size={14} className="text-emerald-500" />
            <span>Strict Client Privacy</span>
          </div>
          <p>
            White Card does not route sensitive official documents through public Microsoft or Google online web viewers. Your file is stored with zero automated data mining and is ready for authentic download.
          </p>
        </div>

        {onDownload && (
          <Button
            size="lg"
            onClick={onDownload}
            className="w-full h-10 rounded-xl text-xs font-semibold gap-2 shadow-xs"
          >
            <AppIcon icon={Download01Icon} size={16} />
            <span>Download {formatLabel}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
