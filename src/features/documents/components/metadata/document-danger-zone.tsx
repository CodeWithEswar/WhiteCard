import { useState } from 'react'
import { Delete02Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { VaultDocument } from '@/types/document'

interface DocumentDangerZoneProps {
  document: VaultDocument
  onDelete: () => void
  isDeleting?: boolean
}

export function DocumentDangerZone({
  document,
  onDelete,
  isDeleting = false,
}: DocumentDangerZoneProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleConfirm = () => {
    setDialogOpen(false)
    onDelete()
  }

  return (
    <div className="space-y-3 pt-2">
      <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
        Danger Zone
      </h4>

      <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3 text-left">
        <div className="flex items-start gap-2.5">
          <AppIcon icon={AlertCircleIcon} size={16} className="text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-foreground">
              Delete this document
            </h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Permanently removes this document record and deletes the underlying file from encrypted object storage.
            </p>
          </div>
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-8 rounded-xl text-xs font-medium text-destructive border-destructive/40 hover:bg-destructive/10 gap-1.5 transition-colors"
                disabled={isDeleting}
              />
            }
          >
            <AppIcon icon={Delete02Icon} size={13} />
            <span>{isDeleting ? 'Deleting document...' : 'Delete Document'}</span>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete &ldquo;{document.title}&rdquo;? Both the metadata record and original file will be erased immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Document
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
