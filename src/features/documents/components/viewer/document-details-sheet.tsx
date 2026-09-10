import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { DocumentDetailsContent } from './document-details-content'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  if (!doc) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={
          isMobile
            ? 'h-[90dvh] rounded-t-3xl border-t border-border bg-background p-0 shadow-2xl flex flex-col'
            : 'w-full sm:max-w-[440px] border-l border-border bg-background p-0 shadow-2xl flex flex-col'
        }
      >
        <SheetHeader className="px-5 pt-5 pb-2 text-left border-b border-border/40 shrink-0">
          <SheetTitle className="text-sm font-bold text-foreground">
            {isEditing ? 'Edit Document Details' : 'Document Details'}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {doc.originalFilename}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
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
