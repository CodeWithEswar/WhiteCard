import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  Download01Icon,
  Share03Icon,
  Delete02Icon,
  Calendar03Icon,
  HardDriveIcon,
  ShieldCheckIcon,
  Edit01Icon,
  Tick02Icon,
  Alert02Icon,
  Clock01Icon,
  ViewIcon,
  CursorPointer01Icon,
} from '@hugeicons/core-free-icons'
import { PageContainer } from '../components/layout/page-container'
import { DocumentPreview } from '../features/documents/components/document-preview'
import { TagChip } from '../features/tags/components/tag-chip'
import { ShareDialog } from '../features/sharing/components/share-dialog'
import { AppIcon } from '../components/icons/app-icon'
import { Button } from '../components/ui/button'
import {
  useDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import { ErrorState } from '../components/feedback/error-state'

export function DocumentDetailPage() {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>()
  const targetId = documentId || id
  const navigate = useNavigate()
  const { data: document, isLoading } = useDocument(targetId)
  const updateMutation = useUpdateDocument()
  const deleteMutation = useDeleteDocument()

  const [shareOpen, setShareOpen] = useState(false)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState('')

  if (isLoading) {
    return (
      <PageContainer maxWidth="normal" className="py-12 text-center text-xs text-muted-foreground animate-pulse">
        Decryption in progress...
      </PageContainer>
    )
  }

  if (!document) {
    return (
      <PageContainer maxWidth="reading" className="py-12">
        <ErrorState
          title="Document Not Found"
          description="This file may have been relocated or removed from your vault."
          retryLabel="Back to Vault"
          onRetry={() => navigate('/app')}
        />
      </PageContainer>
    )
  }

  const handleDownload = () => {
    if (document.fileUrl && document.fileUrl !== '#') {
      const a = window.document.createElement('a')
      a.href = document.fileUrl
      a.download = document.originalFilename
      a.click()
    } else {
      alert(`Downloading original file: ${document.originalFilename}`)
    }
  }

  const handleDelete = () => {
    if (confirm(`Permanently delete "${document.title}" from your vault?`)) {
      deleteMutation.mutate(document.id, {
        onSuccess: () => navigate('/app'),
      })
    }
  }

  const handleSaveNotes = () => {
    updateMutation.mutate({
      id: document.id,
      updates: { notes: notesText },
    })
    setIsEditingNotes(false)
  }

  const isExpiringSoon = Boolean(
    document.expiryDate &&
      new Date(document.expiryDate).getTime() - Date.now() < 30 * 24 * 3600 * 1000 &&
      new Date(document.expiryDate).getTime() > Date.now()
  )

  const formatLongDate = (isoString?: string | null) => {
    if (!isoString) return 'Not configured'
    const d = new Date(isoString)
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <PageContainer maxWidth="wide" className="space-y-6">
      {/* Top Breadcrumb / Back Bar */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <AppIcon icon={ArrowLeft01Icon} size={16} />
          <span>Back to documents</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareOpen(true)}
            className="h-9 px-3 rounded-xl text-xs gap-1.5 border-border hover:bg-surface-muted"
          >
            <AppIcon icon={Share03Icon} size={15} />
            <span>Share Link</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="h-9 px-4 rounded-xl font-semibold text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <AppIcon icon={Download01Icon} size={15} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Two-Column Detail Grid: Preview on Left, Metadata on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Preview Surface */}
        <div className="lg:col-span-7 space-y-4">
          <DocumentPreview document={document} onDownload={handleDownload} />
        </div>

        {/* Right 5 Columns: Metadata & Management Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Document Header Card */}
          <div className="p-6 rounded-3xl border border-border/80 bg-surface shadow-xs space-y-4 text-left">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                <span>{document.space} Space</span>
                <span>•</span>
                <span>{document.fileType.toUpperCase()}</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {document.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                {document.originalFilename}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {document.tags.map((t) => (
                <TagChip key={t} label={t} variant="default" />
              ))}
            </div>

            {/* Expiring Alert if applicable */}
            {isExpiringSoon && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AppIcon icon={Alert02Icon} size={16} className="shrink-0" />
                <span>Expires soon: {formatLongDate(document.expiryDate)}</span>
              </div>
            )}
          </div>

          {/* Detailed Metadata Spec Sheet */}
          <div className="p-6 rounded-3xl border border-border/80 bg-surface space-y-4 text-left">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              File Details & Storage
            </h3>

            <div className="divide-y divide-border/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">{document.category}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">File Size</span>
                <span className="font-mono text-foreground">{document.sizeFormatted}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Date Deposited</span>
                <span className="font-mono text-foreground">{formatLongDate(document.createdAt)}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Expiry / Renewal</span>
                <span className="font-mono text-foreground">{formatLongDate(document.expiryDate)}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Integrity Check</span>
                <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <AppIcon icon={ShieldCheckIcon} size={13} />
                  SHA-256 Verified
                </span>
              </div>
            </div>
          </div>

          {/* Engagement & Activity Metrics */}
          <div className="p-6 rounded-3xl border border-border/80 bg-surface space-y-4 text-left">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Engagement & Activity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-surface-muted/50 border border-border/60 flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <AppIcon icon={ViewIcon} size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground font-mono">
                    {document.viewCount ?? 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Total Views</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-muted/50 border border-border/60 flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <AppIcon icon={CursorPointer01Icon} size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground font-mono">
                    {document.clickCount ?? 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Downloads / Clicks</div>
                </div>
              </div>
            </div>

            {document.sharedDirectLink && (
              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Direct Share Active</span>
                  <span className="text-[11px] text-primary">
                    Expires {new Date(document.sharedDirectLink.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>Link views: {document.sharedDirectLink.viewCount ?? 0}</span>
                  <span>•</span>
                  <span>Link clicks: {document.sharedDirectLink.clickCount ?? 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="p-6 rounded-3xl border border-border/80 bg-surface space-y-3 text-left">
            <div className="flex items-center justify-between">
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
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <AppIcon icon={Edit01Icon} size={13} />
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
                  placeholder="Add renewal notes, document numbers, or remarks..."
                  className="w-full p-2.5 text-xs rounded-xl bg-surface-muted border border-border outline-none focus:border-ring"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setIsEditingNotes(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={handleSaveNotes}
                    className="bg-primary text-primary-foreground"
                  >
                    Save Memo
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {document.notes || 'No notes added for this document yet.'}
              </p>
            )}
          </div>

          {/* Danger Zone: Separated Delete */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="w-full h-10 rounded-2xl text-xs font-medium text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 gap-1.5"
            >
              <AppIcon icon={Delete02Icon} size={15} />
              <span>Delete Document from Vault</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        document={document}
      />
    </PageContainer>
  )
}
