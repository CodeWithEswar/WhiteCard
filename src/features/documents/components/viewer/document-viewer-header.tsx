import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft02Icon,
  Download01Icon,
  Link01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { DocumentDetailsTrigger } from './document-details-trigger'
import { DocumentActionsMenu } from './document-actions-menu'
import type { VaultDocument } from '@/types/document'

interface DocumentViewerHeaderProps {
  document: VaultDocument
  isDetailsOpen: boolean
  isFocusMode: boolean
  onToggleDetails: () => void
  onToggleFocusMode: () => void
  onOpenEdit: () => void
  onShare: () => void
  onDownload?: () => void
  onDelete: () => void
}

export function DocumentViewerHeader({
  document: doc,
  isDetailsOpen,
  isFocusMode,
  onToggleDetails,
  onToggleFocusMode,
  onOpenEdit,
  onShare,
  onDownload,
  onDelete,
}: DocumentViewerHeaderProps) {
  const navigate = useNavigate()
  const isGov = doc.space === 'government'

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate(`/app/${doc.space}`)
    }
  }

  return (
    <header className="h-16 sm:h-[68px] px-3 sm:px-6 border-b border-border/70 bg-card/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20 select-none">
      {/* Left: Smart Back + Document Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={handleBack}
          aria-label="Back to library"
          className="size-9 rounded-xl border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 shadow-2xs"
        >
          <AppIcon icon={ArrowLeft02Icon} size={16} />
        </Button>

        <div className="min-w-0 flex-1 flex items-center gap-2">
          <div className="size-8 rounded-xl bg-muted border border-border/70 flex items-center justify-center text-foreground shrink-0 hidden sm:flex">
            <AppIcon icon={isGov ? Passport01Icon : Certificate01Icon} size={16} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
                {doc.title}
              </h1>
              <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground border border-border/60 hidden md:inline">
                {doc.fileType.toUpperCase()}
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate hidden sm:block">
              <span>{doc.space}</span>
              <span className="mx-1">•</span>
              <span>{doc.category}</span>
              <span className="mx-1">•</span>
              <span>{doc.sizeFormatted}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Primary Actions + Details + More */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onDownload && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="h-9 px-3 rounded-xl text-xs gap-1.5 border-border/70 text-foreground hover:bg-muted hidden md:flex"
          >
            <AppIcon icon={Download01Icon} size={14} />
            <span>Download</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShare}
          className="h-9 px-3 rounded-xl text-xs gap-1.5 border-border/70 text-foreground hover:bg-muted hidden md:flex"
        >
          <AppIcon icon={Link01Icon} size={14} />
          <span>Share</span>
        </Button>

        {/* Dedicated Details Trigger Icon (Always directly visible) */}
        <DocumentDetailsTrigger
          isOpen={isDetailsOpen}
          onClick={onToggleDetails}
        />

        {/* More Menu Dropdown */}
        <DocumentActionsMenu
          document={doc}
          isFocusMode={isFocusMode}
          onEdit={onOpenEdit}
          onDownload={onDownload}
          onShare={onShare}
          onToggleFocusMode={onToggleFocusMode}
          onDelete={onDelete}
        />
      </div>
    </header>
  )
}
