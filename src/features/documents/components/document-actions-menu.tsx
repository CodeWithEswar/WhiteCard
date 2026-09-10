import { useState } from 'react'
import {
  Download01Icon,
  Share03Icon,
  Edit01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { VaultDocument } from '@/types/document'

interface DocumentActionsMenuProps {
  document: VaultDocument
  onDownload: () => void
  onShare: () => void
  onEdit: () => void
  onDelete: () => void
  isDownloading?: boolean
  isDeleting?: boolean
}

export function DocumentActionsMenu({
  document: doc,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  isDownloading = false,
  isDeleting = false,
}: DocumentActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Primary Action 1: Download Original */}
        <Button
          size="sm"
          onClick={onDownload}
          disabled={isDownloading}
          className="h-9 px-3.5 rounded-xl font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-[0.98]"
        >
          <AppIcon icon={Download01Icon} size={15} />
          <span>{isDownloading ? 'Preparing…' : 'Download'}</span>
        </Button>

        {/* Primary Action 2: Direct Share */}
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="h-9 px-3.5 rounded-xl text-xs gap-1.5 border-border hover:bg-muted/50 transition-all active:scale-[0.98]"
        >
          <AppIcon icon={Share03Icon} size={15} className="text-muted-foreground" />
          <span>Share</span>
        </Button>

        {/* Secondary Actions Overflow Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="size-9 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                aria-label="More document options"
              />
            }
          >
            <AppIcon icon={MoreHorizontalIcon} size={16} />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-md">
            <DropdownMenuItem
              onClick={onEdit}
              className="gap-2 text-xs cursor-pointer rounded-lg py-2"
            >
              <AppIcon icon={Edit01Icon} size={14} className="text-muted-foreground" />
              <span>Edit details</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-lg py-2"
            >
              <AppIcon icon={Delete02Icon} size={14} />
              <span>Delete document</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation AlertDialog (Requirement 135) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Delete this document?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              This removes <strong className="font-semibold text-foreground">"{doc.title}"</strong>,
              its original file, metadata, tag relationships, and active share links from White Card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2 pt-2">
            <AlertDialogCancel className="h-8.5 rounded-xl text-xs border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteDialogOpen(false)
                onDelete()
              }}
              disabled={isDeleting}
              className="h-8.5 rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting…' : 'Delete Document'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
