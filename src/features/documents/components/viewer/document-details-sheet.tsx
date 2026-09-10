import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { DocumentDetailsContent } from './document-details-content'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import type { VaultDocument } from '@/types/document'

interface DocumentDetailsSheetProps {
  document: VaultDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  onToggleEdit: (isEditing: boolean) => void
  onSaveUpdates: (updates: {
    title: string
    category: string
    notes: string
    expiryDate: string | null
  }) => Promise<void>
  onOpenShare: () => void
  onDownload?: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function DocumentDetailsSheet({
  document: doc,
  open,
  onOpenChange,
  isEditing,
  onToggleEdit,
  onSaveUpdates,
  onOpenShare,
  onDownload,
  onDelete,
  isDeleting,
}: DocumentDetailsSheetProps) {
  const isMobile = useIsMobile()

  if (!doc) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={
          isMobile
            ? 'max-h-[90dvh] h-auto rounded-t-[28px] border-t border-border bg-background p-0 shadow-2xl flex flex-col overflow-hidden outline-none'
            : 'w-full sm:max-w-[440px] h-full border-l border-border bg-background p-0 shadow-2xl flex flex-col overflow-hidden outline-none'
        }
      >
        {/* Mobile Drag Indicator */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3.5 border-b border-border/50 shrink-0 pr-12">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleEdit(false)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
              >
                <AppIcon icon={ArrowLeft02Icon} size={15} />
                <span>Back</span>
              </button>
              <span className="text-muted-foreground/40">•</span>
              <SheetTitle className="text-sm font-bold text-foreground">
                Edit Metadata
              </SheetTitle>
            </div>
          ) : (
            <div className="min-w-0">
              <SheetTitle className="text-sm font-bold text-foreground truncate">
                {doc.title || 'Document Details'}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                {doc.originalFilename}
              </SheetDescription>
            </div>
          )}
        </div>

        {/* Sheet Body */}
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <DocumentDetailsContent
            document={doc}
            isEditing={isEditing}
            onToggleEdit={onToggleEdit}
            onSaveUpdates={onSaveUpdates}
            onOpenShare={onOpenShare}
            onDownload={onDownload}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
