import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft02Icon,
  Edit01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { PageShell } from '@/components/layout/page-shell'
import { PageMeta } from '@/components/seo/page-meta'
import { ErrorState } from '@/components/feedback/error-state'
import { DocumentGridSkeleton } from '@/components/feedback/page-skeleton'
import { DocumentPreview } from '../components/document-preview'
import { DocumentMetadataPanel } from '../components/document-metadata-panel'
import { DocumentActionsMenu } from '../components/document-actions-menu'
import { ShareDialog } from '@/features/sharing/components/share-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GOVERNMENT_CATEGORIES,
  STUDENT_CATEGORIES,
} from '@/features/upload/upload.constants'
import {
  useDocument,
  useUpdateDocument,
  useDeleteDocument,
  useRecordDocumentView,
  useDocumentDownload,
} from '../hooks/use-documents'
import type { DocumentSpace } from '@/types/document'

export function DocumentDetailPage() {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>()
  const targetId = documentId || id
  const navigate = useNavigate()

  const { data: document, isLoading } = useDocument(targetId)
  const updateMutation = useUpdateDocument()
  const deleteMutation = useDeleteDocument()
  const recordView = useRecordDocumentView()
  const { download, isDownloading } = useDocumentDownload()

  // Track view count once per unique document mount
  const viewedDocRef = useRef<string | null>(null)
  useEffect(() => {
    if (targetId && viewedDocRef.current !== targetId) {
      viewedDocRef.current = targetId
      recordView.mutate(targetId)
    }
  }, [targetId])

  // Modals & Sheets
  const [shareOpen, setShareOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editExpiry, setEditExpiry] = useState('')

  // Categories list based on document space
  const categories = useMemo(() => {
    const baseList = document?.space === 'student' ? STUDENT_CATEGORIES : GOVERNMENT_CATEGORIES
    const all = [...baseList]
    if (editCategory && !all.includes(editCategory as any)) {
      return [editCategory, ...all]
    }
    return all
  }, [document?.space, editCategory])

  // Quick notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState('')

  // Open Edit Details Dialog pre-filled with current values
  const handleOpenEdit = () => {
    if (!document) return
    setEditTitle(document.title)
    setEditCategory(document.category || '')
    setEditNotes(document.notes || '')
    setEditExpiry(
      document.expiryDate ? new Date(document.expiryDate).toISOString().split('T')[0] : ''
    )
    setEditDialogOpen(true)
  }

  // Save full edit details
  const handleSaveEdit = async () => {
    if (!document || !editTitle.trim()) return
    await updateMutation.mutateAsync({
      id: document.id,
      updates: {
        title: editTitle.trim(),
        category: editCategory.trim() || document.category,
        notes: editNotes.trim(),
        expiryDate: editExpiry ? new Date(editExpiry).toISOString() : null,
      },
    })
    setEditDialogOpen(false)
  }

  // Save quick notes
  const handleSaveNotes = async () => {
    if (!document) return
    await updateMutation.mutateAsync({
      id: document.id,
      updates: { notes: notesText.trim() },
    })
    setIsEditingNotes(false)
  }

  // Handle document download (increments download count + triggers download)
  const handleDownload = () => {
    if (document) {
      download(document)
    }
  }

  // Handle document deletion
  const handleDelete = () => {
    if (!document) return
    deleteMutation.mutate(document.id, {
      onSuccess: () => {
        navigate('/app')
      },
    })
  }

  // Loading skeleton on cold load
  if (isLoading && !document) {
    return (
      <PageShell maxWidth="wide">
        <PageMeta title="White Card — Loading Document" noIndex noFollow />
        <div className="py-8">
          <DocumentGridSkeleton count={1} />
        </div>
      </PageShell>
    )
  }

  // Document not found error state
  if (!document) {
    return (
      <PageShell maxWidth="reading">
        <PageMeta title="White Card — Document Not Found" noIndex noFollow />
        <div className="py-12">
          <ErrorState
            title="Document Not Found"
            description="This file may have been relocated or removed from your vault."
            retryLabel="Back to Vault"
            onRetry={() => navigate('/app')}
          />
        </div>
      </PageShell>
    )
  }

  const isGov = document.space === 'government'

  return (
    <PageShell maxWidth="wide">
      <PageMeta
        title={`White Card — ${document.title}`}
        description={`Original file: ${document.originalFilename}`}
        noIndex
        noFollow
      />

      <div className="space-y-6">
        {/* Top Navigation & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => navigate(-1)}
              className="size-8.5 rounded-xl border-border text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Back to previous page"
            >
              <AppIcon icon={ArrowLeft02Icon} size={16} />
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/60 font-mono">
                  <AppIcon icon={isGov ? Passport01Icon : Certificate01Icon} size={11} />
                  {document.space}
                </span>
                <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                  {document.originalFilename}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                {document.title}
              </h1>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <DocumentActionsMenu
              document={document}
              onDownload={handleDownload}
              onShare={() => setShareOpen(true)}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isDownloading={isDownloading}
              isDeleting={deleteMutation.isPending}
            />
          </div>
        </div>

        {/* Master Responsive Layout: 8/4 desktop split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Preview Canvas (col-span-7 or 8) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3">
            <DocumentPreview
              document={document}
              onDownload={handleDownload}
            />
          </div>

          {/* RIGHT: Metadata & Notes Sidebar (col-span-5 or 4) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Metadata Panel */}
            <DocumentMetadataPanel
              document={document}
              onEditClick={handleOpenEdit}
            />

            {/* Private Memo / Notes Card */}
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Private Memo
                </h3>
                {!isEditingNotes && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotesText(document.notes || '')
                      setIsEditingNotes(true)
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    <AppIcon icon={Edit01Icon} size={12} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Add renewal notes, reference IDs, or remarks..."
                    className="w-full p-2.5 text-xs rounded-xl bg-muted/30 border border-border text-foreground outline-none focus:ring-1 focus:ring-ring"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(false)}
                      className="h-7 px-2.5 text-xs rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={updateMutation.isPending}
                      className="h-7 px-3 text-xs rounded-lg bg-primary text-primary-foreground"
                    >
                      {updateMutation.isPending ? 'Saving…' : 'Save Memo'}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  {document.notes && document.notes.trim().length > 0
                    ? document.notes
                    : 'No private notes configured for this document.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        document={document}
      />

      {/* Edit Details Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              Edit Document Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            {/* Title */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Display Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Document display title"
                className="w-full h-9 px-3 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-1 focus:ring-ring outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Category
              </label>
              <Select
                value={editCategory}
                onValueChange={(val) => {
                  if (val) setEditCategory(val)
                }}
              >
                <SelectTrigger className="w-full h-9 px-3 rounded-xl border-border bg-card text-foreground text-xs focus-visible:ring-2 focus-visible:ring-ring select-none">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="z-50 rounded-xl shadow-xl border border-border/80 bg-popover">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs cursor-pointer py-1.5">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expiry Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-4">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <span>Expiry Date</span>
                  {document?.space === 'government' && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium text-[10px] lowercase tracking-normal">
                      • renewal
                    </span>
                  )}
                </label>
                <span className="text-[10px] font-normal lowercase text-muted-foreground/75">
                  (optional)
                </span>
              </div>
              <DatePicker
                value={editExpiry}
                onChange={setEditExpiry}
                placeholder="Select expiry date"
                isRenewal={document?.space === 'government' && !!editExpiry}
              />
            </div>

            {/* Private Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-4">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Notes
                </label>
                <span className="text-[10px] font-normal lowercase text-muted-foreground/75">
                  (optional)
                </span>
              </div>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Private reminders, policy numbers, or remarks..."
                className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-1 focus:ring-ring outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(false)}
              className="h-8.5 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending || !editTitle.trim()}
              className="h-8.5 rounded-xl text-xs bg-primary text-primary-foreground"
            >
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
